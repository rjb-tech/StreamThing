// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.171.0/crypto/mod.ts";
import {
  encode,
  decode,
} from "https://deno.land/std@0.172.0/encoding/base64url.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2";

interface GoogleOauthResponse {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
  isSuccess: boolean;
}

interface YoutubeChannelInfo {
  uploadsPlaylistId: string;
  recentVideos: string[];
  channelLink: string;
  channelId: string;
  isError?: boolean;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
};

async function getYoutubeChannelId(channelLink: string) {
  try {
    const response = await fetch(channelLink);
    const html = await response.text();

    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(html, "text/html");
    if (parsedHtml) {
      const channelIdEl = parsedHtml.querySelector("[itemprop=channelId]");
      if (channelIdEl) {
        const channelId = channelIdEl.getAttribute("content");

        return channelId ? channelId : "";
      }

      throw new Error("Error getting Youtube HTML");
    }
  } catch (error) {
    return null;
  }
}

async function getYoutubeApiAccessToken(): Promise<GoogleOauthResponse> {
  const JWTHeader = { alg: "RS256", typ: "JWT" };
  const JWTClaimSet = {
    iss: Deno.env.get("SERVICE_ACCOUNT_EMAIL") || "",
    scope: "https://www.googleapis.com/auth/youtube.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: Math.floor(+new Date() / 1000) + 120,
    iat: Math.floor(+new Date() / 1000),
  };

  const pem = Deno.env.get("SERVICE_ACCOUNT_PRIVATE_KEY") || "";
  const pemLines = pem.split("\n");
  const pemData = pemLines.slice(1, pemLines.length - 2).join("");
  const keyData = new Uint8Array(
    atob(pemData)
      .split("")
      .map((c) => c.charCodeAt(0))
  );

  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    keyData,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  // This formatting from the following documentation:
  // https://developers.google.com/identity/protocols/oauth2/service-account#httprest
  const encodedSigningData = `${encode(JSON.stringify(JWTHeader))}.${encode(
    JSON.stringify(JWTClaimSet)
  )}`;
  const signingDataBufferArray = new Uint8Array(
    encodedSigningData.split("").map((c) => c.charCodeAt(0))
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    signingDataBufferArray
  );

  // This is ugly formatting, thanks prettier you're great most of the time
  const googleJWToken = `${encode(JSON.stringify(JWTHeader))}.${encode(
    JSON.stringify(JWTClaimSet)
  )}.${encode(signature)}`;

  const authHeaders = new Headers();
  authHeaders.set("Content-Type", "application/x-www-form-urlencoded");

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: authHeaders,
      body: `grant_type=${encodeURIComponent(
        "urn:ietf:params:oauth:grant-type:jwt-bearer"
      )}&assertion=${googleJWToken}`,
    });
    const data = await response.json();
    return { ...data, isSuccess: true };
  } catch (error) {
    return { isSuccess: false };
  }
}

async function insertContentSourceInfo(
  channelInfo: YoutubeChannelInfo,
  supabaseClient: SupabaseClient
): Promise<void> {
  const { channelLink, recentVideos, channelId, uploadsPlaylistId } =
    channelInfo;

  const { data, error } = await supabaseClient.from("content_sources").insert({
    link: channelLink,
    recent_videos: recentVideos,
    channel_id: channelId,
    uploads_playlist: uploadsPlaylistId,
  });

  if (error) throw new Error("Error inserting new data, check postgres logs");
}

async function updateContentSourceInfo(
  channelInfo: YoutubeChannelInfo,
  supabaseClient: SupabaseClient
): Promise<void> {
  const { channelLink, recentVideos, channelId, uploadsPlaylistId } =
    channelInfo;

  const { data, error } = await supabaseClient.from("content_sources").update({
    recent_videos: recentVideos,
    uploads_playlist: uploadsPlaylistId,
  });

  if (error) throw new Error("Error inserting new data, check postgres logs");
}

async function getYoutubeChannelInfo(
  channelId: string,
  channelLink: string,
  accessToken: string
): Promise<YoutubeChannelInfo> {
  // Fetch Data From YoutubeDataApiv3
  try {
    const channelResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${Deno.env.get(
        "YOUTUBE_API_KEY"
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const channelResponseParsed = JSON.parse(await channelResponse.text());
    const uploadsPlaylistId =
      channelResponseParsed.items[0].contentDetails.relatedPlaylists.uploads;

    const uploadsResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${uploadsPlaylistId}&key=${Deno.env.get(
        "YOUTUBE_API_KEY"
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const playlistInfo = JSON.parse(await uploadsResponse.text()).items;
    const uploads = playlistInfo.map(
      (upload: {
        kind: string;
        etag: string;
        id: string;
        contentDetails: { videoId: string; videoPublishedAt: string };
      }) => upload.contentDetails.videoId
    );

    return { uploadsPlaylistId, recentVideos: uploads, channelId, channelLink };
  } catch (err) {
    return {
      uploadsPlaylistId: "",
      recentVideos: [],
      channelId,
      channelLink,
      isError: true,
    };
  }
}

async function handleNewContentSource(
  channelLink: string,
  supabaseClient: SupabaseClient
): Promise<YoutubeChannelInfo> {
  try {
    const [channelId, youtubeTokenResponse] = await Promise.all([
      getYoutubeChannelId(channelLink),
      getYoutubeApiAccessToken(),
    ]);

    if (channelId && youtubeTokenResponse.access_token) {
      const channelInfo = await getYoutubeChannelInfo(
        channelId,
        channelLink,
        youtubeTokenResponse.access_token
      );

      await insertContentSourceInfo(channelInfo, supabaseClient);

      return channelInfo;
    }

    throw new Error("Error retrieving youtube channel information");
  } catch (err) {
    throw err;
  }
}

async function refreshExistingContentSource(
  channelLink: string,
  supabaseClient: SupabaseClient
): Promise<YoutubeChannelInfo> {
  try {
    const [channelId, youtubeTokenResponse] = await Promise.all([
      getYoutubeChannelId(channelLink),
      getYoutubeApiAccessToken(),
    ]);

    if (channelId && youtubeTokenResponse.access_token) {
      const channelInfo = await getYoutubeChannelInfo(
        channelId,
        channelLink,
        youtubeTokenResponse.access_token
      );

      await updateContentSourceInfo(channelInfo, supabaseClient);

      return channelInfo;
    }

    throw new Error("Error retrieving youtube channel information");
  } catch (err) {
    throw err;
  }
}

serve(async (req: any) => {
  const { url, method } = req;
  const body = await req.text();
  const { channel_link: channelLink, user_id: userId } = JSON.parse(body);

  // This is needed if you're planning to invoke your function from a browser.
  if (method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (method !== "POST") {
    return new Response("Unsupported Method", { status: 400 });
  }

  try {
    const options = {
      db: { schema: "public" },
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
        autoRefreshToken: false,
      },
    };

    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get("SUPABASE_URL") || "",
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // For more details on URLPattern, check https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API
    const taskPattern = new URLPattern({ pathname: "/rest-thing/:operation" });
    const matchingPath = taskPattern.exec(url);
    const operation = matchingPath
      ? matchingPath.pathname.groups.operation
      : null;

    // call relevant method based on method
    switch (true) {
      case operation === "add-new-source":
        return new Response(
          JSON.stringify(
            await handleNewContentSource(channelLink, supabaseClient)
          )
        );
        break;
      case operation === "refresh-source":
        return new Response(
          JSON.stringify(
            await refreshExistingContentSource(channelLink, supabaseClient)
          )
        );
        break;
      default:
        throw new Error("Unsupported operation");
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  return new Response(channelLink);
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/restful-thing/:operation' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'

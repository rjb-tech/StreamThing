import { Inter } from "@next/font/google";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

interface TheaterProps {
  username: string;
}

const Theater = dynamic(() => import("../components/TheaterView"), {
  ssr: false,
});

export default function Home({ username }: TheaterProps) {
  return <Theater username={username} />;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return { redirect: { destination: "/", permanent: false } };

  const {
    data,
  }: PostgrestSingleResponse<{
    username: string;
    avatar_url: string;
    id: string;
    followers: string[];
    following: string[];
    active_content_source: string;
    content_sources: string[];
  }> = await supabase
    .rpc("get_profile_from_id", {
      userid: session.user.id,
    })
    .single();

  if (data)
    return {
      props: {
        username: data.username,
      },
    };
  else return { props: {} };
};

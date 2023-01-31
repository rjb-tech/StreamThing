import { ReactNode, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@supabase/auth-helpers-react";

import { getProfile } from "./SupabaseHelpers";
import { ModalProvider } from "./ModalProvider";
import {
  createClient,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";
import { useRouter } from "next/router";
import Head from "next/head";

interface ProviderProps {
  children: ReactNode;
}

export const StreamThingProvider = ({ children }: ProviderProps) => {
  const dispatch = useAppDispatch();
  const { showGuide, showAccountModal, showMyNetworkModal } = useAppSelector(
    (state) => state.ui
  );
  const { contentSources } = useAppSelector((state) => state.account);
  const session = useSession();
  const user = useUser();
  const router = useRouter();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    if (user) getProfile(user.id, supabaseClient, dispatch);
  }, [session?.expires_at]); // get_profile everytime the session access token expires

  useEffect(() => {
    if (!session || !user) router.replace("/");
  }, [session, user]);

  // useEffect(() => {
  //   // Realtime connection to keep track of incoming friend requests
  //   if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  //     const client = createClient(
  //       "https://uieskineapnmdqwofpjx.supabase.co/realtime/v1",
  //       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  //       {
  //         realtime: {
  //           params: {
  //             eventsPerSecond: 10,
  //           },
  //         },
  //       }
  //     );

  //     const channel = supabaseClient
  //       .channel("value-db-changes")
  //       .on(
  //         "postgres_changes",
  //         {
  //           event: "UPDATE",
  //           schema: "public",
  //           table: "profiles",
  //           filter: ``,
  //         },
  //         (
  //           payload: RealtimePostgresUpdatePayload<{
  //             ["id"]: string;
  //             ["created_at"]: string;
  //             ["sender"]: string;
  //             ["receiver"]: string;
  //           }>
  //         ) => {
  //           console.log(payload);
  //         }
  //       )
  //       .subscribe();
  //   }
  // }, []);

  // Reload profile and following everytime the network modal is opened
  useEffect(() => {
    if (Boolean(showMyNetworkModal) && user)
      getProfile(user.id, supabaseClient, dispatch);
  }, [showMyNetworkModal]);

  // useEffect(() => {
  //   if (!Boolean(session) && router.pathname === "/") router.replace("/login");

  //   if (Boolean(session) && router.pathname === "/login") router.replace("/");
  // }, [router.pathname, session]);

  // Event listeners
  // useEffect(() => {
  //   // e is a KeyboardEvent, but typescript says tagname doesn't exist on e.target even though it does
  //   // so I made e an any typed parameter
  //   function keyListener(e: any): void {
  //     const incomingTag = e.target.tagName;
  //     if (incomingTag !== "INPUT" && !e.repeat) {
  //       switch (e.key.toLowerCase()) {
  //         case "a":
  //           if (user) {
  //             dispatch(setShowAccountModal(!showAccountModal));
  //           }
  //           break;
  //         case "n":
  //           dispatch(setShowMyNetworkModal(!showMyNetworkModal));
  //           break;
  //       }
  //     }
  //   }

  //   window.addEventListener("keydown", keyListener);

  //   return () => {
  //     window.removeEventListener("keydown", keyListener);
  //   };
  // });

  return (
    <>
      {/* Do a session check here to render either login/logout modal */}
      <ModalProvider />
      <Head>
        <title>StreamThing</title>
        <link rel="icon" href="/moon-favicon.png" />
      </Head>
      <div className="h-screen w-screen transform-gpu">
        {/* Make sure the top positioning of this matches the height of the header component */}
        <main className="h-full w-full overscroll-y-contain overflow-y-hidden flex items-center justify-center bg-black">
          {children}
        </main>
      </div>
    </>
  );
};

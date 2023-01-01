import { ReactNode, useEffect } from "react";
import { StickyHeader } from "./StickyHeader";
import { Transition } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ChannelGuide } from "./ChannelGuide";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@supabase/auth-helpers-react";
import { setShowAccountModal, setShowGuide } from "../redux/slices/uiSlice";
import { getProfile } from "./SupabaseHelpers";
import { ModalProvider } from "./ModalProvider";
import {
  createClient,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";
import { addFriendRequest } from "../redux/slices/accountSlice";

interface ProviderProps {
  children: ReactNode;
}

export const StreamThingProvider = ({ children }: ProviderProps) => {
  const dispatch = useAppDispatch();
  const { friendRequests } = useAppSelector((state) => state.account);
  const { showGuide, showAccountModal } = useAppSelector((state) => state.ui);
  const session = useSession();
  const user = useUser();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    if (user) getProfile(user, supabaseClient, dispatch);

    // Realtime connection to keep track of incoming friend requests
    if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const client = createClient(
        "https://uieskineapnmdqwofpjx.supabase.co/realtime/v1",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          realtime: {
            params: {
              eventsPerSecond: 10,
            },
          },
        }
      );

      const channel = supabaseClient
        .channel("value-db-changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "friend_requests",
            filter: `receiever=eq.${user?.id}`,
          },
          (
            payload: RealtimePostgresUpdatePayload<{
              ["id"]: string;
              ["created_at"]: string;
              ["sender"]: string;
              ["receiver"]: string;
            }>
          ) => {
            if (friendRequests.includes(payload.new.id))
              dispatch(addFriendRequest(payload.new.id));
          }
        )
        .subscribe();
    }
  }, [session]);

  // Event listeners
  useEffect(() => {
    // e is a KeyboardEvent, but typescript says tagname doesn't exist on e.target even though it does
    // so I made e an any typed parameter
    function keyListener(e: any): void {
      const incomingTag = e.target.tagName;
      if (incomingTag !== "INPUT" && !e.repeat) {
        switch (e.key.toLowerCase()) {
          case "a":
            if (user) {
              dispatch(setShowAccountModal(!showAccountModal));
            }
            break;
          case "n":
            dispatch(setShowGuide(!showGuide));
            break;
        }
      }
    }

    window.addEventListener("keydown", keyListener);

    return () => {
      window.removeEventListener("keydown", keyListener);
    };
  });

  return (
    <>
      {/* Do a session check here to render either login/logout modal */}
      <ModalProvider />
      <div className="h-screen w-screen">
        <>
          <Transition
            as="div"
            show={showGuide}
            enter="transition-all duration-500"
            enterFrom="absolute opacity-0"
            enterTo="absolute top-0 h-fit w-full opacity-100"
            leave="transition-all duration-500"
            leaveFrom="h-fit w-full opacity-100"
            leaveTo="opacity-0"
          >
            <ChannelGuide />
          </Transition>
          <StickyHeader />
          {/* Make sure the top positioning of this matches the height of the header component */}
          <main className="h-full w-full overscroll-y-contain overflow-y-hidden flex items-center justify-center pt-24 bg-black">
            {children}
          </main>
        </>
      </div>
    </>
  );
};

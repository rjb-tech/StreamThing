import { ReactNode, useEffect } from "react";
import { StickyHeader } from "./StickyHeader";
import { Transition } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ChannelGuide } from "./ChannelGuide";
import { AuthModal } from "./AuthModal";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@supabase/auth-helpers-react";
import {
  setShowAccountModal,
  setShowGuide,
  setShowNetworkMenu,
  setShowUserMenu,
} from "../redux/slices/mainSlice";
import { AccountModal } from "./AccountModal";
import { getProfile } from "./SupabaseHelpers";

interface ProviderProps {
  children: ReactNode;
}

export const StreamThingProvider = ({ children }: ProviderProps) => {
  const dispatch = useAppDispatch();
  const { showGuide, showAccountModal, showNetworkMenu, showUserMenu } =
    useAppSelector((state) => state.main);
  const session = useSession();
  const user = useUser();
  const supabaseClient = useSupabaseClient();

  // e is a KeyboardEvent, but typescript says tagname doesn't exist on e.target even though it does
  // so I made e an any typed parameter
  function keyListener(e: any): void {
    const incomingTag = e.target.tagName;
    if (incomingTag !== "INPUT") {
      switch (e.key.toLowerCase()) {
        case "a":
          if (user) {
            dispatch(setShowAccountModal(!showAccountModal));
          }
          break;
        case "g":
          dispatch(setShowGuide(!showGuide));
          break;
        case "n":
          dispatch(setShowNetworkMenu(!showNetworkMenu));
          break;
        case "u":
          dispatch(setShowUserMenu(!showUserMenu));
          break;
      }
    }
  }

  useEffect(() => {
    if (user) getProfile(user, supabaseClient, dispatch);
  }, [session]);

  // Event listeners
  useEffect(() => {
    window.addEventListener("keydown", keyListener);

    return () => {
      window.removeEventListener("keydown", keyListener);
    };
  });

  return (
    <>
      {/* Do a session check here to render either login/logout modal */}
      <AuthModal session={session} supabaseClient={supabaseClient} />
      <AccountModal />
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

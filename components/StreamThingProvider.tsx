import { ReactNode, useEffect } from "react";
import { StickyHeader } from "./StickyHeader";
import { Transition } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ChannelGuide } from "./ChannelGuide";
import { AuthModal } from "./AuthModal";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@supabase/auth-helpers-react";
import {
  setAccountInfoLoading,
  setAvatarUrl,
  setFullName,
  setUsername,
} from "../redux/slices/accountSlice";
import {
  setShowAccountModal,
  setShowGuide,
  setShowNetworkMenu,
  setShowUserMenu,
} from "../redux/slices/mainSlice";
import { AccountModal } from "./AccountModal";

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

  async function getProfile() {
    try {
      dispatch(setAccountInfoLoading(true));
      if (!user) throw new Error("No user");

      let { data, error, status } = await supabaseClient
        .from("profiles")
        .select(`username, avatar_url, full_name`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        dispatch(setFullName(data.full_name));
        dispatch(setUsername(data.username));
        dispatch(setAvatarUrl(data.avatar_url));
      }
    } catch (error) {
      alert("Error loading user data!");
      console.log(error);
    } finally {
      dispatch(setAccountInfoLoading(false));
    }
  }

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: any;
    avatar_url: any;
  }) {
    try {
      dispatch(setAccountInfoLoading(true));
      if (!user) throw new Error("No user");

      const updates = {
        id: user.id,
        username,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabaseClient.from("profiles").upsert(updates);
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
    } finally {
      dispatch(setAccountInfoLoading(false));
    }
  }

  function keyListener(e: KeyboardEvent): void {
    switch (e.key.toLowerCase()) {
      case "a":
        dispatch(setShowAccountModal(!showAccountModal));
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

  useEffect(() => {
    if (user) getProfile();
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
            enter="transition-all duration-[350ms]"
            enterFrom="absolute -top-3/4 opacity-0"
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

import { Dialog, Transition } from "@headlessui/react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setShowAuthModal } from "../redux/slices/uiSlice";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import twitchLogo from "../images/TwitchGlitchPurple.png";
import Image from "next/image";

export const AuthModal = () => {
  const dispatch = useAppDispatch();
  const supabase = useSupabaseClient();
  const { showAuthModal } = useAppSelector((state) => state.ui);

  const closeModal = () => {
    dispatch(setShowAuthModal(false));
  };

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  async function signInWithTwitch() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "twitch",
    });
  }

  return (
    <>
      <Transition as="div" show={showAuthModal}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          {/* <Transition.Child
            as="span"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 z-10" />
          </Transition.Child> */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as="div"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md h-fit space-y-4 transform overflow-hidden rounded-2xl bg-gray-700 p-6 text-left align-middle shadow-xl transition-all">
                  <button
                    onClick={async () => await signInWithGoogle()}
                    className="flex items-center justify-around w-60 rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                  >
                    <Image
                      alt="google logo"
                      width={25}
                      height={25}
                      src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
                    />
                    <span>Login with Google</span>
                  </button>
                  <button
                    onClick={async () => await signInWithTwitch()}
                    className="flex items-center justify-around w-60 rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                  >
                    <Image
                      alt="Twitch logo"
                      width={25}
                      height={25}
                      src={twitchLogo}
                    />
                    <span>Login with Twitch</span>
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

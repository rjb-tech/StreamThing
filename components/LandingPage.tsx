import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import twitchLogo from "../images/TwitchGlitchPurple.png";
import discordLogo from "../images/icon_clyde_blurple_RGB.png";
import Image from "next/image";

export const LandingPage = () => {
  const dispatch = useAppDispatch();
  const supabase = useSupabaseClient();
  const { showAuthModal } = useAppSelector((state) => state.ui);

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

  async function signInWithDiscord() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
    });
  }

  return (
    <div className="h-full w-full flex justify-center items-center text-white">
      <div className="w-1/2 h-fit py-6 rounded-md flex flex-col ring-4 ring-white space-y-6 ring-opacity-80 bg-gray-700 text-center">
        <span className="text-3xl">
          Login to channel surf with your friends
        </span>
        <span className="h-full w-full flex flex-col justify-center items-center space-y-4 ">
          <button
            onClick={async () => await signInWithDiscord()}
            className="h-12 flex items-center justify-around w-60 rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-all hover:bg-opacity-30 duration-250"
          >
            <Image
              alt="Discord logo"
              width={25}
              height={25}
              src={discordLogo}
            />
            <span>Login with Discord</span>
          </button>
          <button
            onClick={async () => await signInWithGoogle()}
            className="h-12 flex items-center justify-around w-60 rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-all hover:bg-opacity-30 duration-250"
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
            className="h-12 flex items-center justify-around w-60 rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-all hover:bg-opacity-30 duration-250"
          >
            <Image alt="Twitch logo" width={25} height={25} src={twitchLogo} />
            <span>Login with Twitch</span>
          </button>
        </span>
      </div>
    </div>
  );
};

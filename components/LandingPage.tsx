import { useSupabaseClient } from "@supabase/auth-helpers-react";
import twitchLogo from "../images/TwitchGlitchPurple.png";
import discordLogo from "../images/icon_clyde_blurple_RGB.png";
import Image from "next/image";
import { Provider } from "@supabase/supabase-js";

export const LandingPage = () => {
  const supabase = useSupabaseClient();

  async function signInWith(provider: Provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: "http://localhost:3000/theater" },
    });
  }

  return (
    <>
      <div className="absolute h-screen w-screen transform-gpu">
        <div id="stars" />
        <div id="stars2" />
        <div id="stars3" />
      </div>
      <div className="h-full w-full text-white flex items-center transform-gpu">
        <div className="w-1/2 h-fit mx-auto relative py-6 rounded-md flex flex-col ring-4 ring-white space-y-6 ring-opacity-80 bg-gray-700 text-center z-50">
          <span className="text-3xl">
            Login to channel surf with your friends
          </span>
          <span className="h-full w-full flex flex-col justify-center items-center space-y-4 ">
            <button
              onClick={async () => await signInWith("discord")}
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
              onClick={async () => await signInWith("google")}
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
              onClick={async () => await signInWith("twitch")}
              className="h-12 flex items-center justify-around w-60 rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-all hover:bg-opacity-30 duration-250"
            >
              <Image
                alt="Twitch logo"
                width={25}
                height={25}
                src={twitchLogo}
              />
              <span>Login with Twitch</span>
            </button>
          </span>
        </div>
      </div>
    </>
  );
};

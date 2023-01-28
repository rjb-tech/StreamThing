import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { AuthenticatedHeader } from "./AuthenticatedHeader";
import { getAndSetVideoFromContentSource } from "./SupabaseHelpers";

export default function TheaterView({ username }: { username: string }) {
  const player = useRef<HTMLDivElement>(null);
  const supabaseClient = useSupabaseClient();
  const dispatch = useAppDispatch();
  const { activeStream, contentSourceCurrentlyShowing } = useAppSelector(
    (state) => state.ui
  );

  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [playerWidth, setPlayerWidth] = useState<number>(1000);

  useEffect(() => {
    // Set the player width on load
    setPlayerWidth(document.body.clientWidth);

    const widthListener = (e: UIEvent) => {
      setPlayerWidth(document.body.clientWidth);
    };

    window.addEventListener("resize", widthListener);

    return () => {
      window.removeEventListener("resize", widthListener);
    };
  });

  return (
    <>
      <div className="video-player h-screen w-screen flex flex-col items-center justify-center">
        <AuthenticatedHeader username={username} videoLoaded={videoLoaded} />
        <div
          ref={player}
          className={`video-player relative h-full w-full transition-all duration-500 ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <ReactPlayer
            onEnded={() => {
              getAndSetVideoFromContentSource(
                contentSourceCurrentlyShowing,
                supabaseClient,
                dispatch
              );
            }}
            onReady={() => {
              setVideoLoaded(true);
            }}
            config={{ youtube: { playerVars: { controls: 1 } } }}
            url={activeStream}
            playing
            volume={1}
            muted={false}
            height={player.current?.clientHeight || 100}
            width={playerWidth}
          />
        </div>
      </div>
    </>
  );
}

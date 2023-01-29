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
  const [playerWidth, setPlayerWidth] = useState<number>(0);
  const [playerHeight, setPlayerHeight] = useState<number>(0);
  const [minimizeHeader, setMinimizeHeader] = useState<boolean>(false);

  useEffect(() => {
    // Set the player dims on load
    setPlayerWidth(document.body.clientWidth);
    setPlayerHeight(document.body.clientHeight - 92);

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
      <div className="h-screen w-screen flex flex-col transform-gpu">
        <div
          className={`header-container ${
            Boolean(minimizeHeader) ? "h-24" : "h-screen"
          } w-full bg-gradient-to-b from-[#EF436B]/[0.65] via-[#182E63]/[1] to-transparent z-10 relative transition-all duration-500`}
        >
          <AuthenticatedHeader username={username} videoLoaded={videoLoaded} />
        </div>
        <div
          ref={player}
          className={`video-player relative ${
            Boolean(minimizeHeader) ? "h-full" : "h-0"
          } w-full transition-all duration-500 ${
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
              setMinimizeHeader(true);
              setTimeout(() => setVideoLoaded(true), 500);
            }}
            config={{ youtube: { playerVars: { controls: 1 } } }}
            url={activeStream}
            volume={1}
            muted={false}
            height={playerHeight}
            width={playerWidth}
          />
        </div>
      </div>
    </>
  );
}

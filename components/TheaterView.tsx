import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { AuthenticatedHeader } from "./AuthenticatedHeader";
import { getAndSetVideoFromContentSource } from "./SupabaseHelpers";

export default function TheaterView({ username }: { username: string }) {
  const player = useRef<HTMLDivElement>(null);
  const supabaseClient = useSupabaseClient();
  const dispatch = useAppDispatch();
  const { activeStream, contentSourceCurrentlyShowing, minimizeHeader } =
    useAppSelector((state) => state.ui);

  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

  return (
    <>
      <div className="h-screen w-screen flex flex-col transform-gpu">
        <div
          className={`header-container ${
            Boolean(minimizeHeader) ? "h-28" : "h-screen"
          } w-full bg-gradient-to-b from-[#EF436B]/[0.65] via-[#182E63]/[1] to-transparent z-10 relative transition-all duration-1000`}
        >
          <AuthenticatedHeader username={username} videoLoaded={videoLoaded} />
        </div>
        <div
          ref={player}
          className={`video-player flex items-end relative
          w-full transition-all ${
            videoLoaded ? "opacity-100 duration-[1200ms]" : "opacity-0"
          } ${minimizeHeader ? "h-full duration-1000" : "h-0"}`}
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
            volume={1}
            muted={false}
            height="100%"
            width="100%"
          />
        </div>
      </div>
    </>
  );
}

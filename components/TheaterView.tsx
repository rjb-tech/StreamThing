import { useSupabaseClient } from "@supabase/auth-helpers-react";
import dynamic from "next/dynamic";
import ReactPlayer from "react-player";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { AuthenticatedHeader } from "./AuthenticatedHeader";
import { getAndSetVideoFromContentSource } from "./SupabaseHelpers";

export default function TheaterView({ username }: { username: string }) {
  const supabaseClient = useSupabaseClient();
  const dispatch = useAppDispatch();
  const { activeStream, contentSourceCurrentlyShowing } = useAppSelector(
    (state) => state.ui
  );

  return (
    <>
      <div className="video-player h-screen w-screen flex items-center justify-center">
        <AuthenticatedHeader username={username} />
        <ReactPlayer
          onEnded={() => {
            getAndSetVideoFromContentSource(
              contentSourceCurrentlyShowing,
              supabaseClient,
              dispatch
            );
          }}
          url={activeStream}
          playing
          volume={1}
          muted={false}
          height={window.screen.availHeight - 192} // This number is (header height in px * 2)
          width={window.screen.availWidth}
        />
      </div>
    </>
  );
}

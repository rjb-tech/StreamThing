import {
  ArrowRightOnRectangleIcon,
  ForwardIcon,
  TvIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setShowAccountModal,
  setShowLogoutConfirmationModal,
  setShowMyNetworkModal,
} from "../redux/slices/uiSlice";
import { AccountModal } from "./AccountModal";
import { AuthenticatedHeader } from "./AuthenticatedHeader";
import {
  getAndSetShuffleModeVideo,
  getAndSetVideoFromContentSource,
} from "./SupabaseHelpers";

export default function TheaterView() {
  const player = useRef<HTMLDivElement>(null);
  const [auxPanelMode, setAuxPanelMode] = useState<string>("default");
  const supabaseClient = useSupabaseClient();
  const dispatch = useAppDispatch();
  const {
    activeStream,
    contentSourceCurrentlyShowing,
    minimizeHeader,
    mobileMenuOpen,
    showAccountModal,
    showMyNetworkModal,
    showLogoutConfirmationModal,
  } = useAppSelector((state) => state.ui);
  const { channelCurrentlyViewing } = useAppSelector((state) => state.account);

  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

  return (
    <>
      <div className="theater h-screen w-screen flex flex-col transform-gpu">
        <div className="absolute h-screen-w-screen transform-gpu">
          {/* These add the stars */}
          <div id="stars" />
          <div id="stars2" />
          <div id="stars3" />
        </div>
        <div
          className={`header-container ${
            Boolean(minimizeHeader) ? "h-28" : "h-screen"
          } w-full bg-gradient-to-b from-[#EF436B]/[0.2] via-[#182E63]/[0.3] to-transparent z-10 relative transition-all duration-1000 overflow-visible`}
        >
          <AuthenticatedHeader videoLoaded={videoLoaded} />
        </div>
        <span
          className={`absolute flex flex-col justify-around mt-28 sm:hidden top-0 left-0 py-4 px-2 w-full h-fit transition-all duration-300 z-40 ${
            mobileMenuOpen ? "opacity-100" : " opacity-0 invisible"
          } ${minimizeHeader ? "bg-black" : "bg-white/[0.05]"}`}
        >
          <span className="relative flex w-full justify-around">
            <UserIcon
              className="h-7 w-7 text-white cursor-pointer"
              onClick={() => {
                dispatch(setShowAccountModal(!showAccountModal));
              }}
            />
            <TvIcon
              className="h-6 w-6 text-white cursor-pointer"
              onClick={() => {
                dispatch(setShowMyNetworkModal(!showMyNetworkModal));
              }}
            />
            <ForwardIcon
              className="h-6 w-6 text-white cursor-pointer"
              onClick={() => {
                if (contentSourceCurrentlyShowing === "shuffle_mode")
                  getAndSetShuffleModeVideo(
                    channelCurrentlyViewing,
                    supabaseClient,
                    dispatch
                  );
                else
                  getAndSetVideoFromContentSource(
                    contentSourceCurrentlyShowing,
                    supabaseClient,
                    dispatch
                  );
              }}
            />
            <ArrowRightOnRectangleIcon
              className="h-6 w-6 text-white cursor-pointer"
              onClick={() =>
                dispatch(
                  setShowLogoutConfirmationModal(!showLogoutConfirmationModal)
                )
              }
            />
          </span>
        </span>

        <div
          ref={player}
          className={`video-player flex items-end relative
          w-full transition-all ${
            videoLoaded ? "opacity-100 duration-[1200ms]" : "opacity-0"
          } ${minimizeHeader ? "h-full duration-1000" : "h-0"}`}
        >
          <ReactPlayer
            onEnded={() => {
              if (contentSourceCurrentlyShowing === "shuffle_mode")
                getAndSetShuffleModeVideo(
                  channelCurrentlyViewing,
                  supabaseClient,
                  dispatch
                );
              else
                getAndSetVideoFromContentSource(
                  contentSourceCurrentlyShowing,
                  supabaseClient,
                  dispatch
                );
            }}
            onReady={() => {
              setVideoLoaded(true);
            }}
            playing
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

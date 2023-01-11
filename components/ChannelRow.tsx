import Image from "next/image";
import { useAppDispatch } from "../redux/hooks";
import {
  setActiveStream,
  setShowGuide,
  setShowMyNetworkModal,
} from "../redux/slices/uiSlice";
import { StreamThingButton } from "./StreamThingButton";
import type { UserRecord } from "./types";

interface ChannelProps {
  streamUrl: string;
  user: UserRecord;
  adminChannel?: boolean;
}

export const ChannelRow = ({
  streamUrl,
  user,
  adminChannel = false,
}: ChannelProps) => {
  const dispatch = useAppDispatch();
  const handleStreamClick = () => {
    dispatch(setActiveStream(streamUrl));
    dispatch(setShowGuide(false));
  };
  return (
    <div className="flex overscroll-y-contain h-32 lg:h-28 overflow-y-scroll border-t-4">
      <section className="bg-black h-full w-1/4 flex justify-center">
        <div className="bg-emerald-200 h-full w-full">
          <div className="flex flex-col h-full w-full lg:flex-row items-center justify-around py-4 space-y-2 lg:space-y-0">
            <Image
              className="rounded-full h-16 w-16"
              src={user.avatarUrl}
              height={100}
              width={100}
              alt={`${user.username} avatar`}
            />
            <div className="flex flex-col items-end space-y-2">
              <p className="text-center">{user.username}</p>
              {adminChannel && (
                <StreamThingButton
                  innerText="My Channel"
                  roundedFull
                  clickFn={() => dispatch(setShowMyNetworkModal(true))}
                />
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-red-200 h-full w-full cursor-pointer">
        <div
          onClick={handleStreamClick}
          className="bg-emerald-400 h-full w-full"
        ></div>
      </section>
    </div>
  );
};

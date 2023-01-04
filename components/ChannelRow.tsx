import { XMarkIcon } from "@heroicons/react/20/solid";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useAppDispatch } from "../redux/hooks";
import { setActiveStream, setShowGuide } from "../redux/slices/uiSlice";
import { StreamThingButton } from "./StreamThingButton";
import { sendUnfollow } from "./SupabaseHelpers";
import type { UserRecord } from "./types";

interface ChannelProps {
  streamUrl: string;
  user: UserRecord;
  showUnfollow?: boolean;
}

export const ChannelRow = ({
  streamUrl,
  user,
  showUnfollow = false,
}: ChannelProps) => {
  const authenticatedUser = useUser();
  const supabaseClient = useSupabaseClient();
  const dispatch = useAppDispatch();
  const handleStreamClick = () => {
    dispatch(setActiveStream(streamUrl));
    dispatch(setShowGuide(false));
  };
  return (
    <div className="flex overscroll-y-contain h-32 lg:h-28 overflow-y-scroll border-t-4">
      <section className="bg-black h-full w-1/5 flex justify-center">
        <div className="bg-emerald-200 h-full w-full">
          {showUnfollow && (
            <div className="relative w-full h-fit">
              <XMarkIcon
                onClick={() => {
                  if (authenticatedUser) {
                    sendUnfollow(authenticatedUser.id, user.id, supabaseClient);
                  }
                }}
                className="absolute right-0 pr-1 pt-1 h-5 w-5 cursor-pointer transition-all duration-200 ease-out hover:scale-105 active:scale-100"
              />
            </div>
          )}
          <div className="flex flex-col h-full w-full lg:flex-row items-center justify-around py-4 space-y-2 lg:space-y-0">
            <Image
              className="rounded-full h-16 w-16"
              src={user.avatarUrl}
              height={100}
              width={100}
              alt={`${user.username} avatar`}
            />
            <div className="flex flex-col justify-end">
              <p>{user.username}</p>
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

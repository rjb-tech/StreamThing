import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setActiveStream, setShowGuide } from "../redux/slices/mainSlice";
import type { NetworkMember } from "../redux/slices/networkSlice";
import { ChevronDoubleUpIcon, UserMinusIcon } from "@heroicons/react/20/solid";

interface ChannelProps {
  streamUrl: string;
  user: NetworkMember;
}

export const ChannelRow = ({ streamUrl, user }: ChannelProps) => {
  const dispatch = useAppDispatch();
  const { owner } = useAppSelector((state) => state.network);
  const handleStreamClick = () => {
    dispatch(setActiveStream(streamUrl));
    dispatch(setShowGuide(false));
  };
  return (
    <div className="flex overscroll-y-contain h-32 lg:h-24 overflow-y-scroll border-t-4">
      <section className="bg-black h-full w-1/5 flex justify-center">
        <div className="bg-emerald-200 h-full w-full flex flex-col lg:flex-row items-center justify-around py-2 px-2">
          <Image
            className="rounded-full h-12 w-12"
            src={user.avatarUrl}
            height={100}
            width={100}
            alt={`${user.fullName} avatar`}
          />

          <div className="w-fit flex flex-col items-center justify-center px-2">
            {user.username || user.fullName}
            {user.id === owner && (
              <span className="flex w-full flex justify-center space-x-2 pt-1">
                <button className="h-fit w-fit hover:scale-125 transition transition-duration-500 ease-in-out">
                  <ChevronDoubleUpIcon className="h-5 w-5" />
                </button>
                <button className="h-fit w-fit hover:scale-125 transition transition-duration-500 ease-in-out">
                  <UserMinusIcon className="h-5 w-5" />
                </button>
              </span>
            )}
          </div>
        </div>
      </section>
      <section className="bg-red-200 h-full w-full">
        <div
          onClick={handleStreamClick}
          className="bg-emerald-400 h-full w-full"
        ></div>
      </section>
    </div>
  );
};

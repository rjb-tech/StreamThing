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
        <div className="bg-emerald-200 h-full w-full flex flex-col lg:flex-row items-center justify-center space-x-8 py-2">
          <Image
            className="rounded-full h-12 w-12"
            src={user.avatarUrl}
            height={100}
            width={100}
            alt={`${user.fullName} avatar`}
          />

          <div>{user.username || user.fullName}</div>
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

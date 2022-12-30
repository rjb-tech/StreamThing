import Image from "next/image";
import { useAppDispatch } from "../redux/hooks";
import { setActiveStream, setShowGuide } from "../redux/slices/mainSlice";
import type { NetworkMember } from "../redux/slices/networkSlice";

interface ChannelProps {
  streamUrl: string;
  user: NetworkMember;
}

export const ChannelRow = ({ streamUrl, user }: ChannelProps) => {
  const dispatch = useAppDispatch();
  const handleStreamClick = () => {
    dispatch(setActiveStream(streamUrl));
    dispatch(setShowGuide(false));
  };
  return (
    <div className="flex overscroll-y-contain overflow-y-scroll border-t-4">
      <section className="bg-black h-full w-1/5 flex justify-center">
        <div className="bg-emerald-200 h-20 w-full lg:flex items-center justify-around mx-3">
          <Image
            className="rounded-full h-12 w-12"
            src={user.avatarUrl}
            height={100}
            width={100}
            alt={`${user.fullName} avatar`}
          />
          {user.username || user.fullName}
        </div>
      </section>
      <section className="bg-red-200 h-full w-full">
        <div
          onClick={handleStreamClick}
          className="bg-emerald-400 h-20 w-full"
        ></div>
      </section>
    </div>
  );
};

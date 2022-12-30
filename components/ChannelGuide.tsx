import { ChannelRow } from "./ChannelRow";
import Image from "next/image";
import { useAppSelector } from "../redux/hooks";
import { NetworkMember } from "../redux/slices/networkSlice";

export const ChannelGuide = () => {
  const { logoUrl, name, members } = useAppSelector((state) => state.network);

  return (
    <div className="absolute pt-24 h-fit w-full bg-gray-500">
      <div className="network-header py-3 px-6 w-full flex items-center justify-between">
        <div className="w-fit flex space-x-4">
          <Image
            className="rounded-full h-20 w-20 bg-[#D6E5E3] ring-2 ring-white ring-opacity-40 text-sm font-medium opacity-100"
            src={logoUrl || ""}
            alt="network image"
            height={100}
            width={100}
          />
        </div>
        <span className="text-3xl text-white">{name}</span>
      </div>
      {members?.map((member: NetworkMember) => {
        return (
          <ChannelRow
            streamUrl="https://www.twitch.tv/pobelter"
            user={member}
          />
        );
      })}
    </div>
  );
};

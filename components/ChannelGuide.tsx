import { ChannelRow } from "./ChannelRow";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { NetworkMember } from "../redux/slices/networkSlice";
import { setShowNetworkModal } from "../redux/slices/mainSlice";

export const ChannelGuide = () => {
  const dispatch = useAppDispatch();
  const { logoUrl, name, members } = useAppSelector((state) => state.network);

  return (
    <div className="absolute pt-24 h-fit w-full bg-gray-500">
      <div className="network-header py-3 px-6 w-full flex items-center justify-between">
        <button
          className="w-fit h-fit"
          onClick={() => dispatch(setShowNetworkModal(true))}
        >
          <Image
            className="rounded-full h-20 w-20 bg-[#D6E5E3] text-sm font-medium transition duration-75 transform-gpu ease-in opacity-100 hover:ring-4 hover:ring-white hover:ring-opacity-20"
            src={logoUrl || ""}
            alt="network image"
            height={100}
            width={100}
          />
        </button>
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

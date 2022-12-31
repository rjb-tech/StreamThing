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
      {members?.map((member: NetworkMember) => {
        return (
          <ChannelRow
            key={member.id}
            streamUrl="https://www.twitch.tv/pobelter"
            user={member}
          />
        );
      })}
    </div>
  );
};

import { ChannelRow } from "./ChannelRow";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import type { FriendRecord } from "./types";

export const ChannelGuide = () => {
  const { friends } = useAppSelector((state) => state.account);

  return (
    <div className="absolute pt-24 h-fit w-full bg-gray-500">
      {friends?.map((member: FriendRecord) => {
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

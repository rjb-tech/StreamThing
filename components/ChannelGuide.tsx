import { ChannelRow } from "./ChannelRow";
import { useAppSelector } from "../redux/hooks";
import type { FriendRecord } from "./types";
import { useUser } from "@supabase/auth-helpers-react";

export const ChannelGuide = () => {
  const user = useUser();
  const { friends, username, fullName, avatarUrl } = useAppSelector(
    (state) => state.account
  );

  const userRecord: FriendRecord = {
    id: user?.id || "",
    username: username || "",
    fullName: fullName || "",
    avatarUrl: avatarUrl || "",
  };

  return (
    <div className="absolute pt-24 h-fit w-full bg-gray-500">
      <ChannelRow
        streamUrl="https://www.twitch.tv/pobelter"
        user={userRecord}
      />
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

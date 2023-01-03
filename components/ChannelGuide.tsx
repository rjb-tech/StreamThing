import { ChannelRow } from "./ChannelRow";
import { useAppSelector } from "../redux/hooks";
import type { UserRecord } from "./types";
import { useUser } from "@supabase/auth-helpers-react";

export const ChannelGuide = () => {
  const user = useUser();
  const { following, username, avatarUrl } = useAppSelector(
    (state) => state.account
  );

  const userRecord: UserRecord = {
    id: user?.id || "",
    username: username || "",
    avatarUrl: avatarUrl || "",
  };

  return (
    <div className="absolute pt-24 h-fit w-full bg-gray-500">
      <ChannelRow
        streamUrl="https://www.twitch.tv/pobelter"
        user={userRecord}
      />
      {following?.map((member: UserRecord) => {
        return (
          <ChannelRow
            key={member.id}
            streamUrl="https://www.twitch.tv/pobelter"
            user={member}
            showUnfollow
          />
        );
      })}
    </div>
  );
};

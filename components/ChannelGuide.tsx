import { ChannelRow } from "./ChannelRow";

export const ChannelGuide = () => {
  return (
    <div className="absolute pt-24 h-full w-full">
      <ChannelRow streamUrl="https://www.twitch.tv/pobelter" user="Ryne" />
    </div>
  );
};

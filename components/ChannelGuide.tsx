import { ChannelRow } from "./ChannelRow";

export const ChannelGuide = () => {
  return (
    <div className="absolute pt-24 h-full w-full">
      <ChannelRow streamUrl="https://www.twitch.tv/pobelter" user="Ryne" />
      <ChannelRow
        streamUrl="https://www.youtube.com/watch?v=V9Cb33efYEU&list=PLYqfXQ-ztmZLzp5veg5f3oWg9ZjaGG3kk&index=2"
        user="Ryne"
      />
    </div>
  );
};

import { ChannelRow } from "./ChannelRow";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export const ChannelGuide = () => {
  const dispatch = useAppDispatch();
  const { logoUrl, name } = useAppSelector((state) => state.network);
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
      <ChannelRow streamUrl="https://www.twitch.tv/pobelter" user="Ryne" />
      <ChannelRow
        streamUrl="https://www.youtube.com/watch?v=V9Cb33efYEU&list=PLYqfXQ-ztmZLzp5veg5f3oWg9ZjaGG3kk&index=2"
        user="Ryne"
      />
    </div>
  );
};

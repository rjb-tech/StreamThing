import { ChannelRow } from "./ChannelRow";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { StreamThingButton } from "./StreamThingButton";
import { setShowEditMembersModal } from "../redux/slices/mainSlice";

export const ChannelGuide = () => {
  const dispatch = useAppDispatch();
  const { logoUrl } = useAppSelector((state) => state.network);
  const { networks } = useAppSelector((state) => state.account);
  return (
    <div className="absolute pt-24 h-fit w-full bg-gray-500">
      <div className="network-header p-3 w-full flex items-center justify-between">
        <div className="w-fit flex space-x-4">
          {networks?.map((network) => {
            return (
              <Image
                className="rounded-full h-20 w-20 bg-[#D6E5E3] ring-2 ring-white ring-opacity-40 text-sm font-medium opacity-100"
                src={logoUrl || ""}
                alt="network image"
                height={100}
                width={100}
              />
            );
          })}
        </div>
        <div className="w-fit flex justify-between space-x-4">
          <StreamThingButton
            innerText="Edit Members"
            clickFn={() => dispatch(setShowEditMembersModal(true))}
          />
        </div>
      </div>
      <ChannelRow streamUrl="https://www.twitch.tv/pobelter" user="Ryne" />
      <ChannelRow
        streamUrl="https://www.youtube.com/watch?v=V9Cb33efYEU&list=PLYqfXQ-ztmZLzp5veg5f3oWg9ZjaGG3kk&index=2"
        user="Ryne"
      />
    </div>
  );
};

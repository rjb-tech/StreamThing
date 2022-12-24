import { useAppDispatch } from "../redux/hooks";
import { setActiveStream, setShowGuide } from "../redux/slices/mainSlice";

interface ChannelProps {
  streamUrl: string;
  user: string;
}

export const ChannelRow = ({ streamUrl, user }: ChannelProps) => {
  const dispatch = useAppDispatch();
  const handleStreamClick = () => {
    dispatch(setActiveStream(streamUrl));
    dispatch(setShowGuide(false));
  };
  return (
    <div className="flex overscroll-y-contain overflow-y-scroll border-t-4">
      <section className="bg-black h-full w-1/5">
        <div className="bg-emerald-200 h-20 w-full">{user}</div>
      </section>
      <section className="bg-red-200 h-full w-full">
        <div
          onClick={handleStreamClick}
          className="bg-emerald-400 h-20 w-full"
        ></div>
      </section>
    </div>
  );
};

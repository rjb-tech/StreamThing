import ReactPlayer from "react-player";
import { useAppSelector } from "../redux/hooks";

export const TheaterView = () => {
  const { activeStream } = useAppSelector((state) => state.main);
  return (
    <>
      <div className="video-player h-screen w-screen flex items-center justify-center">
        <ReactPlayer url={activeStream} playing volume={1} muted={false} />
      </div>
    </>
  );
};

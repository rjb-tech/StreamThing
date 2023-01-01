import ReactPlayer from "react-player";
import { useAppSelector } from "../redux/hooks";

export const TheaterView = () => {
  const { activeStream } = useAppSelector((state) => state.ui);
  return (
    <>
      <div className="video-player h-screen w-screen flex items-center justify-center">
        <ReactPlayer
          url={activeStream}
          playing
          volume={1}
          muted={false}
          height={window.screen.availHeight - 192} // This number is (header height in px * 2)
          width={window.screen.availWidth}
        />
      </div>
    </>
  );
};

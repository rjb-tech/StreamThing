import ReactPlayer from "react-player";
import { useAppSelector } from "../redux/hooks";

export const TheaterView = () => {
  const { activeStream } = useAppSelector((state) => state.main);
  return (
    <>
      <div className="h-fit w-fit">
        <ReactPlayer
          url={activeStream}
          playing
          volume={1}
          muted={false}
          pip={false}
        />
      </div>
    </>
  );
};

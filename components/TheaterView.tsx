import ReactPlayer from "react-player";

export const TheaterView = () => {
  return (
    <>
      <div className="h-full w-full flex justify-center items-center">
        <ReactPlayer
          url="https://www.twitch.tv/pobelter"
          playing
          volume={1}
          muted={false}
          pip={false}
          width={1000}
          height={562}
        />
      </div>
    </>
  );
};

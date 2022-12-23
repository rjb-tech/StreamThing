import ReactPlayer from "react-player";

export const TheaterView = () => {
  return (
    <>
      <div className="h-fit w-fit">
        <ReactPlayer
          url="https://www.twitch.tv/pobelter"
          playing
          volume={1}
          muted={false}
          pip={false}
        />
      </div>
    </>
  );
};

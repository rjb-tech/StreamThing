export const ChannelRow = () => {
  return (
    <div className="flex overscroll-y-contain overflow-y-scroll border-t-4">
      <section className="bg-black h-full w-1/5">
        <div className="bg-emerald-200 h-20 w-full"></div>
      </section>
      <section className="bg-red-200 h-full w-full">
        <div className="bg-emerald-400 h-20 w-full"></div>
      </section>
    </div>
  );
};

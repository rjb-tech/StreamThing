import { ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";

interface UnauthenticatedHeaderProps {
  loginWithPopup: any;
}

export const UnauthenticatedHeader = ({
  loginWithPopup,
}: UnauthenticatedHeaderProps) => {
  return (
    <header className="sticky top-0 h-24 w-full p-4 bg-gradient-to-r from-[#006687] to-[#3C1E46] z-50">
      <div className="p-4 w-full h-full rounded-lg flex items-center justify-between">
        <span className="text-4xl text-white">StreamThing</span>
        <button
          onClick={() => loginWithPopup()}
          className="border border-white w-fit h-fit p-4 rounded-lg text-white hover:ring-4 hover:ring-slate-500 flex items-center justify-center"
        >
          <span className="pr-2">Login</span>
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

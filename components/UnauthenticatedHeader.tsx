import { ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";
import { useAppDispatch } from "../redux/hooks";
import { setShowAuthModal } from "../redux/slices/mainSlice";

interface UnauthenticatedHeaderProps {
  supabaseClient: any;
}

export const UnauthenticatedHeader = ({
  supabaseClient,
}: UnauthenticatedHeaderProps) => {
  const dispatch = useAppDispatch();
  return (
    <header className="fixed top-0 h-24 w-full p-4 bg-gradient-to-r from-[#006687] to-[#3C1E46] z-50">
      <div className="p-4 w-full h-full rounded-lg flex items-center justify-between">
        <span className="text-4xl text-white">StreamThing</span>
        <span className="w-28 flex justify-between">
          <button
            onClick={() => dispatch(setShowAuthModal(true))}
            className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            <span className="pr-2">Login</span>
            <ArrowLeftOnRectangleIcon className="w-6 h-6" />
          </button>
        </span>
      </div>
    </header>
  );
};

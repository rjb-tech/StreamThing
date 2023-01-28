import { ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";
import { useAppDispatch } from "../redux/hooks";
import { setShowAuthModal } from "../redux/slices/uiSlice";
import { StreamThingButton } from "./StreamThingButton";

interface UnauthenticatedHeaderProps {
  supabaseClient: any;
}

export const UnauthenticatedHeader = ({
  supabaseClient,
}: UnauthenticatedHeaderProps) => {
  const dispatch = useAppDispatch();
  return (
    <header className="fixed top-0 h-24 w-full p-4 bg-gradient-to-b from-[#EF436B]/[0.65] via-[#E05A00]/[0.15] via-[#182E63]/[0.8] via-[#EF436B]/[0.65] to-transparent z-50">
      <div className="p-4 w-full h-full rounded-lg flex items-center justify-center">
        <span className="text-4xl text-white">StreamThing</span>
        {/* <span className="w-28 flex justify-between">
          <StreamThingButton
            fullHeight
            innerText="Login"
            clickFn={() => dispatch(setShowAuthModal(true))}
          >
            <ArrowLeftOnRectangleIcon className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100" />
          </StreamThingButton>
        </span> */}
      </div>
    </header>
  );
};

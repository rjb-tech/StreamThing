import { useAuth0 } from "@auth0/auth0-react";
import { ReactNode } from "react";
import { StickyHeader } from "./StickyHeader";
import { Transition } from "@headlessui/react";
import { useAppSelector } from "../redux/hooks";
import { ChannelGuide } from "./ChannelGuide";

interface ProviderProps {
  children: ReactNode;
}

export const StreamThingProvider = ({ children }: ProviderProps) => {
  const { user, isLoading, isAuthenticated, loginWithRedirect } = useAuth0();
  const { showGuide } = useAppSelector((state) => state.main);
  return (
    <>
      <div className="h-screen w-screen">
        {!isLoading && (
          <>
            <Transition
              as="div"
              show={showGuide}
              enter="transition-all duration-500"
              enterFrom="absolute -top-3/4 opacity-0"
              enterTo="absolute top-0 h-fit w-full opacity-100"
              leave="transition-all duration-500"
              leaveFrom="h-fit w-full opacity-100"
              leaveTo="opacity-0"
            >
              <ChannelGuide />
            </Transition>
            <StickyHeader />
            {/* Make sure the top positioning of this matches the height of the header component */}
            <main className="h-full w-full overscroll-y-contain overflow-y-hidden flex items-center justify-center pt-24 bg-black">
              {children}
            </main>
          </>
        )}
      </div>
    </>
  );
};

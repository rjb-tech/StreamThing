import { useAuth0 } from "@auth0/auth0-react";
import { ReactNode } from "react";
import { StickyHeader } from "./StickyHeader";

interface ProviderProps {
  children: ReactNode;
}

export const StreamThingProvider = ({ children }: ProviderProps) => {
  const { user, isLoading, isAuthenticated, loginWithRedirect } = useAuth0();
  return (
    <>
      <div className="h-screen w-screen">
        <StickyHeader />
        {/* Make sure the top positioning of this matches the height of the header component */}
        <main className="fixed top-24 h-full w-full overscroll-contain">
          {children}
        </main>
      </div>
    </>
  );
};

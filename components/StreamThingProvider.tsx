import { useAuth0 } from "@auth0/auth0-react";
import { ReactNode } from "react";

interface ProviderProps {
  children: ReactNode;
}

export const StreamThingProvider = ({ children }: ProviderProps) => {
  const { user, isLoading, isAuthenticated, loginWithRedirect } = useAuth0();
  return (
    <div className="bg-emerald-500 h-screen w-screen">
      <header className="container h-24 w-full p-4 bg-yellow-100 flex items-center justify-between">
        <button
          id="network-info-dropdown"
          className="relative bg-pink-300 h-full w-16 rounded-full"
        ></button>
        <button
          id="userInfoDropdown"
          className="h-full w-32 bg-blue-300 rounded-md"
        ></button>
      </header>
      {children}
    </div>
  );
};

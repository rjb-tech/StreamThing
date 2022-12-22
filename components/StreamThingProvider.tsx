import { ReactNode } from "react";

interface ProviderProps {
  children: ReactNode;
}

export const StreamThingProvider = ({ children }: ProviderProps) => {
  return <div>{children}</div>;
};

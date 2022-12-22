import "../styles/globals.css";
import type { AppProps } from "next/app";
import { StreamThingProvider } from "../components/StreamThingProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StreamThingProvider>
      <Component {...pageProps} />
    </StreamThingProvider>
  );
}

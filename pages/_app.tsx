import "../styles/globals.css";
import type { AppProps } from "next/app";
import { StreamThingProvider } from "../components/StreamThingProvider";
import { Auth0Provider } from "@auth0/auth0-react";
import { Provider } from "react-redux";
import { store } from "../redux/store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Auth0Provider
        domain="stream-thing.us.auth0.com"
        clientId="cSOsosd0EQmMNRPHC7fZe2hwS1RL39NV"
        redirectUri="http://localhost:3000"
        cacheLocation="localstorage"
      >
        <StreamThingProvider>
          <Component {...pageProps} />
        </StreamThingProvider>
      </Auth0Provider>
    </Provider>
  );
}

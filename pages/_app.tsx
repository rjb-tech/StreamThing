import "../styles/globals.css";
import type { AppProps } from "next/app";
import { StreamThingProvider } from "../components/StreamThingProvider";
import { Provider } from "react-redux";
import { store } from "../redux/store";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  return (
    <Provider store={store}>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <StreamThingProvider>
          <Component {...pageProps} />
        </StreamThingProvider>
      </SessionContextProvider>
    </Provider>
  );
}

import { Inter } from "@next/font/google";
import { useAuth0 } from "@auth0/auth0-react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { LandingPage } from "../components/LandingPage";
import { TheaterView } from "../components/TheaterView";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();
  return session ? <TheaterView /> : <LandingPage />;
}

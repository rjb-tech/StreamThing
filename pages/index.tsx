import { Inter } from "@next/font/google";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { LandingPage } from "../components/LandingPage";
import { TheaterView } from "../components/TheaterView";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = useUser();

  return user ? <TheaterView /> : <LandingPage />;
}

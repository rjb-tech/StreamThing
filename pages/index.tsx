import { useSession } from "@supabase/auth-helpers-react";
import { LandingPage } from "../components/LandingPage";
import TheaterView from "../components/TheaterView";

export default function LoginPage() {
  const session = useSession();

  return session ? <TheaterView /> : <LandingPage />;
}

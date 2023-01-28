import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { LandingPage } from "../components/LandingPage";

export default function LoginPage() {
  return <LandingPage />;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return { props: {} };
  else
    return {
      redirect: { destination: "/theater", permanent: false },
    };
};

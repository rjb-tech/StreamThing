import { UnauthenticatedHeader } from "./UnauthenticatedHeader";
import { AuthenticatedHeader } from "./AuthenticatedHeader";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";

export const StickyHeader = () => {
  const user = useUser();
  const session = useSession();
  const supabase = useSupabaseClient();
  return session ? (
    <AuthenticatedHeader supabaseClient={supabase} user={user} />
  ) : (
    <UnauthenticatedHeader supabaseClient={supabase} />
  );
};

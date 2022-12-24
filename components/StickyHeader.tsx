import {
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { useAuth0 } from "@auth0/auth0-react";
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

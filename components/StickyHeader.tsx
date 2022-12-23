import {
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { UnauthenticatedHeader } from "./UnauthenticatedHeader";
import { AuthenticatedHeader } from "./AuthenticatedHeader";

export const StickyHeader = () => {
  const { isAuthenticated, loginWithPopup, user, logout } = useAuth0();
  return isAuthenticated ? (
    <AuthenticatedHeader user={user} logout={logout} />
  ) : (
    <UnauthenticatedHeader loginWithPopup={loginWithPopup} />
  );
};

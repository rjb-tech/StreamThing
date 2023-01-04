import { AccountModal } from "./AccountModal";
import { AddContentSourceModal } from "./AddContentSourceModal";
import { AddFriendModal } from "./AddFriendModal";
import { AuthModal } from "./AuthModal";

export const ModalProvider = () => {
  return (
    <>
      <AuthModal />
      <AccountModal />
      <AddFriendModal />
      <AddContentSourceModal />
    </>
  );
};

import { AccountModal } from "./AccountModal";
import { AddContentSourceModal } from "./AddContentSourceModal";
import { AddFriendModal } from "./AddFriendModal";
import { AuthModal } from "./AuthModal";
import { MyChannelModal } from "./MyChannelModal";

export const ModalProvider = () => {
  return (
    <>
      <AuthModal />
      <AccountModal />
      <MyChannelModal />
    </>
  );
};

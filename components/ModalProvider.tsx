import { AccountModal } from "./AccountModal";
import { AuthModal } from "./AuthModal";
import { MyNetworkModal } from "./MyNetworkModal";

export const ModalProvider = () => {
  return (
    <>
      <AuthModal />
      <AccountModal />
      <MyNetworkModal />
    </>
  );
};

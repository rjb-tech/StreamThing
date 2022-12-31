import { AccountModal } from "./AccountModal";
import { AuthModal } from "./AuthModal";

export const ModalProvider = () => {
  return (
    <>
      <AuthModal />
      <AccountModal />
    </>
  );
};

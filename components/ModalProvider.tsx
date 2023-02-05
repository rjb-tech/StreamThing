import { AccountModal } from "./AccountModal";
import { LogoutConfirmationModal } from "./LogoutConfirmationModal";
import { MyNetworkModal } from "./MyNetworkModal";

export const ModalProvider = () => {
  return (
    <div>
      <AccountModal />
      <MyNetworkModal />
      <LogoutConfirmationModal />
    </div>
  );
};

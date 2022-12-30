import { AccountModal } from "./AccountModal";
import { AuthModal } from "./AuthModal";
import { CreateNetworkModal } from "./CreateNetworkModal";
import { EditMembersModal } from "./EditMembersModal";
import { NetworkModal } from "./NetworkModal";

export const ModalProvider = () => {
  return (
    <>
      <AuthModal />
      <AccountModal />
      <CreateNetworkModal />
      <EditMembersModal />
      <NetworkModal />
    </>
  );
};

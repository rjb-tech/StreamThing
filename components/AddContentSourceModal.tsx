import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setShowAddContentSourceModal } from "../redux/slices/uiSlice";
import { BaseModal } from "./BaseModal";

export const AddContentSourceModal = () => {
  const dispatch = useAppDispatch();
  const { showAddContentSourceModal } = useAppSelector((state) => state.ui);
  function closeModal() {
    dispatch(setShowAddContentSourceModal(false));
  }
  return (
    <BaseModal
      showCondition={showAddContentSourceModal}
      closeModal={closeModal}
    >
      <div></div>
    </BaseModal>
  );
};

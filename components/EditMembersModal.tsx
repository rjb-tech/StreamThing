import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setShowEditMembersModal } from "../redux/slices/mainSlice";
import { BaseModal } from "./BaseModal";

export const EditMembersModal = () => {
  const dispatch = useAppDispatch();
  const { showEditMembersModal } = useAppSelector((state) => state.main);

  function closeModal() {
    dispatch(setShowEditMembersModal(false));
  }
  return (
    <BaseModal showCondition={showEditMembersModal} closeModal={closeModal}>
      <div className="w-fit text-center justify-items-center space-y-6"></div>
    </BaseModal>
  );
};

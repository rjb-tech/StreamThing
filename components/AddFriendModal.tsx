import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setShowAddFriendModal } from "../redux/slices/mainSlice";
import { BaseModal } from "./BaseModal";

export const AddFriendModal = () => {
  const dispatch = useAppDispatch();
  const { showAddFriendModal } = useAppSelector((state) => state.main);

  function closeModal() {
    dispatch(setShowAddFriendModal(false));
  }
  return (
    <BaseModal showCondition={showAddFriendModal} closeModal={closeModal}>
      <div></div>
    </BaseModal>
  );
};

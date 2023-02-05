import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setShowLogoutConfirmationModal } from "../redux/slices/uiSlice";
import { BaseModal } from "./BaseModal";
import { StreamThingButton } from "./StreamThingButton";

export const LogoutConfirmationModal = () => {
  const dispatch = useAppDispatch();
  const { showLogoutConfirmationModal } = useAppSelector((state) => state.ui);
  return (
    <BaseModal
      hideX
      wide
      showCondition={showLogoutConfirmationModal}
      closeModal={() =>
        dispatch(setShowLogoutConfirmationModal(!showLogoutConfirmationModal))
      }
    >
      <div className="w-full h-20 flex flex-col space-y-4 items-center">
        <p className="text-lg">Please confirm to logout</p>
        <StreamThingButton
          illuminate
          innerText="Skedaddle"
          fullHeight
          fullWidth
        />
      </div>
    </BaseModal>
  );
};

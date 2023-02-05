import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { resetAccount } from "../redux/slices/accountSlice";
import {
  resetUI,
  setShowLogoutConfirmationModal,
} from "../redux/slices/uiSlice";
import { BaseModal } from "./BaseModal";
import { StreamThingButton } from "./StreamThingButton";

export const LogoutConfirmationModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const supabaseClient = useSupabaseClient();
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
          clickFn={async () => {
            await supabaseClient.auth.signOut();
            dispatch(resetAccount());
            dispatch(resetUI());
            router.push("/");
          }}
        />
      </div>
    </BaseModal>
  );
};

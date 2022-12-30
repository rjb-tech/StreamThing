import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@supabase/auth-helpers-react";
import { useFormik } from "formik";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setShowCreateNetworkModal } from "../redux/slices/mainSlice";
import { BaseModal } from "./BaseModal";
import { createNetwork } from "./SupabaseHelpers";

export const CreateNetworkModal = () => {
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  const dispatch = useAppDispatch();
  const { showCreateNetworkModal } = useAppSelector((state) => state.main);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: async (values) => {
      if (user) {
        await createNetwork(user, values.name, supabaseClient, dispatch);
        formik.setFieldValue("name", "");
      }
    },
  });

  function closeModal() {
    dispatch(setShowCreateNetworkModal(false));
  }

  return (
    <BaseModal
      showCondition={showCreateNetworkModal}
      closeModal={closeModal}
      hideX
    >
      <div className="w-fit text-center justify-items-center space-y-6">
        <h3 className="text-lg">Create a New Network</h3>
        <form onSubmit={formik.handleSubmit}>
          <span className="space-y-6 text-left">
            <input
              name="name"
              placeholder="Network Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className="bg-transparent text-white border border-white rounded-md px-4 focus:ring focus:ring-white focus:ring-opacity-20 focus:outline-none"
            ></input>
            <span className="w-full flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              >
                Save Changes
              </button>
            </span>
          </span>
        </form>
      </div>
    </BaseModal>
  );
};

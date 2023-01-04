import { useFormik } from "formik";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setShowAddContentSourceModal } from "../redux/slices/uiSlice";
import { BaseModal } from "./BaseModal";
import { StreamThingButton } from "./StreamThingButton";
import { addContentSource } from "./SupabaseHelpers";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

export const AddContentSourceModal = () => {
  const user = useUser();
  const dispatch = useAppDispatch();
  const supabaseClient = useSupabaseClient();
  const { showAddContentSourceModal } = useAppSelector((state) => state.ui);

  const formik = useFormik({
    initialValues: {
      contentLink: "",
    },
    onSubmit: (values) => {
      if (user) {
        addContentSource(user.id, values.contentLink, supabaseClient);
        formik.resetForm();
      }
    },
    validate: (values) => {
      const errors: { contentLink?: string } = {};

      const validSource =
        values.contentLink.includes("https://youtube.com") ||
        values.contentLink.includes("https://www.youtube.com") ||
        values.contentLink.includes("https://twitch.tv") ||
        values.contentLink.includes("https://www.twitch.tv");

      if (!validSource)
        errors.contentLink = "Please enter a valid link from Twitch or Youtube";

      if (values.contentLink === "")
        errors.contentLink = "Content source cannot be empty";

      return errors;
    },
  });

  function closeModal() {
    dispatch(setShowAddContentSourceModal(false));
  }
  return (
    <BaseModal
      showCondition={showAddContentSourceModal}
      closeModal={closeModal}
    >
      <div className="w-fit justify-items-center space-y-6 p-2">
        <form onSubmit={formik.handleSubmit}>
          <span className="space-y-2 w-11/12">
            <label
              className={classNames("w-full flex justify-start", {
                "text-red-500": formik.errors.contentLink !== undefined,
              })}
            >
              {formik.errors.contentLink
                ? formik.errors.contentLink
                : "Content source for your channel"}
            </label>
            <input
              type="text"
              name="contentLink"
              value={formik.values.contentLink}
              onChange={formik.handleChange}
              placeholder="Youtube/Twitch Link"
              className="w-full text-black border border-white rounded-md px-4 focus:ring focus:ring-white focus:ring-opacity-20 focus:outline-none"
            />
            <span className="w-full flex justify-end pt-4">
              <StreamThingButton
                innerText="Add Content Source"
                fullWidth
                disabled={formik.errors.contentLink !== undefined}
              />
            </span>
          </span>
        </form>
      </div>
    </BaseModal>
  );
};

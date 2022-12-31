import classNames from "classnames";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setShowAccountModal } from "../redux/slices/mainSlice";
import Image from "next/image";
import { useFormik } from "formik";
import { ChangeEvent } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { uploadUserImage, updateUsername } from "./SupabaseHelpers";
import { BaseModal } from "./BaseModal";
import { StreamThingButton } from "./StreamThingButton";

export const AccountModal = () => {
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  const dispatch = useAppDispatch();
  const { showAccountModal } = useAppSelector((state) => state.main);
  const { username, avatarUrl } = useAppSelector((state) => state.account);
  const formik = useFormik({
    initialValues: {
      username: "",
    },
    onSubmit: (values) => {
      if (user) {
        updateUsername(user, values.username, supabaseClient, dispatch);
        formik.setFieldValue("username", "");
      }
    },
    validate: (values) => {
      const errors: { username?: string } = {};

      if (values.username === "") errors.username = "Username Required";
      if (values.username.length > 50)
        errors.username = "Must be less than 50 characters";

      return errors;
    },
  });

  function closeModal() {
    dispatch(setShowAccountModal(false));
    setTimeout(() => {
      formik.resetForm();
    }, 200);
  }

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target?.files;
    const file = files ? files[0] : null;
    const filename = file?.name;

    // Typescript made me do it
    if (file && filename && user) {
      const fileType: string = filename.substring(filename.length - 3);
      const uploadPath = `users/${user?.id}/avatar.${fileType}`;

      await uploadUserImage(file, uploadPath, user, supabaseClient, dispatch);
    }
  }

  return (
    <BaseModal showCondition={showAccountModal} closeModal={closeModal}>
      <div className="w-fit text-center justify-items-center space-y-6 p-2">
        <h3 className="text-lg">{`Hey ${username}`}</h3>
        <div className="w-full flex items-center justify-center">
          <Image
            className="relative rounded-full h-28 w-28"
            src={avatarUrl || ""}
            alt="user avatar"
            height={100}
            width={100}
          />
        </div>
        <label className="avatar-label relative">
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/png, image/jpeg, image/jpg, image/gif"
          ></input>
          <span className="avatar-file-text text-white font-medium text-sm">
            Change Avatar
          </span>
        </label>
        <form className="" onSubmit={formik.handleSubmit}>
          <span className="space-y-2 w-11/12">
            <label
              className={classNames("w-full flex justify-start", {
                "text-red-500": formik.errors.username !== undefined,
              })}
            >
              {formik.errors.username
                ? formik.errors.username
                : "Change Username"}
            </label>

            <input
              name="username"
              placeholder="New Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              className=" w-full text-black border border-white rounded-md px-4 focus:ring focus:ring-white focus:ring-opacity-20 focus:outline-none"
            />
            <span className="w-full flex items-center pt-4">
              <StreamThingButton
                innerText="Save Changes"
                fullWidth
                disabled={
                  formik.errors.username || formik.values.username === ""
                    ? true
                    : false
                }
              />
            </span>
          </span>
        </form>
      </div>
    </BaseModal>
  );
};

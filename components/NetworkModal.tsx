import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setShowNetworkModal } from "../redux/slices/mainSlice";
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
  const { showNetworkModal } = useAppSelector((state) => state.main);
  const { name, logoUrl } = useAppSelector((state) => state.network);
  const formik = useFormik({
    initialValues: {
      networkName: "",
    },
    onSubmit: (values) => {
      if (user) {
        updateUsername(user, values.networkName, supabaseClient, dispatch);
        formik.setFieldValue("networkName", "");
      }
    },
  });

  function closeModal() {
    dispatch(setShowNetworkModal(false));
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
    <BaseModal showCondition={showNetworkModal} closeModal={closeModal}>
      <div className="w-fit text-center justify-items-center space-y-6">
        <h3 className="text-lg">{`${name}`}</h3>
        <div className="w-full flex items-center justify-center">
          <Image
            className="relative rounded-full h-28 w-28"
            src={logoUrl || ""}
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
          <span className="space-y-2 text-left">
            <p>Change Username</p>
            <input
              name="networkName"
              placeholder="New Username"
              value={formik.values.networkName}
              onChange={formik.handleChange}
              className="bg-transparent text-white border border-white rounded-md px-4 focus:ring focus:ring-white focus:ring-opacity-20 focus:outline-none"
            ></input>
            <span className="w-full flex justify-end pt-4">
              <StreamThingButton innerText="Save Changes" />
            </span>
          </span>
        </form>
      </div>
    </BaseModal>
  );
};

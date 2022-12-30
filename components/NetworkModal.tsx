import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setShowNetworkModal } from "../redux/slices/mainSlice";
import Image from "next/image";
import { useFormik } from "formik";
import { ChangeEvent } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { uploadNetworkImage, updateNetworkName } from "./SupabaseHelpers";
import { BaseModal } from "./BaseModal";
import { StreamThingButton } from "./StreamThingButton";

export const NetworkModal = () => {
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  const dispatch = useAppDispatch();
  const { showNetworkModal } = useAppSelector((state) => state.main);
  const {
    name,
    logoUrl,
    id: networkId,
  } = useAppSelector((state) => state.network);
  const formik = useFormik({
    initialValues: {
      networkName: "",
    },
    onSubmit: (values) => {
      if (networkId)
        updateNetworkName(
          networkId,
          values.networkName,
          supabaseClient,
          dispatch
        );
      formik.setFieldValue("networkName", "");
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
      const fileType: string | undefined = filename.split(".").pop();
      const uploadPath = `networks/${networkId}/logo.${fileType}`;

      if (networkId)
        await uploadNetworkImage(
          networkId,
          file,
          uploadPath,
          supabaseClient,
          dispatch
        );
    }
  }

  return (
    <BaseModal showCondition={showNetworkModal} closeModal={closeModal}>
      <div className="w-fit text-center justify-items-center space-y-6">
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
            Change Logo
          </span>
        </label>
        <form className="" onSubmit={formik.handleSubmit}>
          <span className="space-y-2 text-left">
            <p>Change Network Name</p>
            <input
              name="networkName"
              value={formik.values.networkName}
              placeholder="New Network Name"
              onChange={formik.handleChange}
              className="bg-transparent text-white border border-white rounded-md px-4 focus:ring focus:ring-white focus:ring-opacity-20 focus:outline-none"
            ></input>
            <span className="w-full flex justify-between pt-4 space-x-2">
              <StreamThingButton
                innerText="Delete Network"
                buttonType="button"
              />
              <StreamThingButton innerText="Save Changes" buttonType="submit" />
            </span>
          </span>
        </form>
      </div>
    </BaseModal>
  );
};

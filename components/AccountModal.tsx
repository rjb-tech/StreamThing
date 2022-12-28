import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { Dialog, Transition } from "@headlessui/react";
import { setShowAccountModal } from "../redux/slices/mainSlice";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useFormik } from "formik";
import { ChangeEvent } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { uploadImage, updateUsername } from "./SupabaseHelpers";

export const AccountModal = () => {
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  const dispatch = useAppDispatch();
  const { showAccountModal } = useAppSelector((state) => state.main);
  const { username, avatarUrl, fullName } = useAppSelector(
    (state) => state.account
  );
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
  });

  function closeModal() {
    dispatch(setShowAccountModal(false));
  }

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target?.files;
    const file = files ? files[0] : null;
    const filename = file?.name;

    // Typescript made me do it
    if (file && filename && user) {
      const fileType: string = filename.substring(filename.length - 3);
      const uploadPath = `users/${user?.id}/avatar.${fileType}`;

      await uploadImage(file, uploadPath, user, supabaseClient, dispatch);
    }
  }

  return (
    <>
      <Transition as="div" show={showAccountModal}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as="div"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex flex-col justify-between items-center w-72 max-w-md h-fit transform overflow-hidden rounded-2xl bg-gray-700 p-6 text-left align-middle shadow-xl transition-all text-white">
                  <div className="w-full h-fit flex justify-end focus:border-none focus:ring-none focus:outline-none">
                    <button
                      onClick={() => dispatch(setShowAccountModal(false))}
                      className="focus:border-none focus:ring-none focus:outline-none"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="avatar-section w-fit text-center justify-items-center space-y-6">
                    <h3 className="text-lg">{`Hey ${username || fullName}`}</h3>
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
                      <span className="space-y-2 text-left">
                        <p>Change Username</p>
                        <input
                          name="username"
                          placeholder="New Username"
                          value={formik.values.username}
                          onChange={formik.handleChange}
                          className="bg-transparent text-white border border-white rounded-md px-4 focus:ring focus:ring-white focus:ring-opacity-20 focus:outline-none"
                        ></input>
                        <span className="w-full flex justify-end pt-4">
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

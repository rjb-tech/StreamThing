import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { Dialog, Transition } from "@headlessui/react";
import { setShowAccountModal } from "../redux/slices/mainSlice";
import { useSelector } from "react-redux";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/20/solid";

export const AccountModal = () => {
  const dispatch = useAppDispatch();
  const { showAccountModal } = useAppSelector((state) => state.main);
  const { username, avatarUrl } = useAppSelector((state) => state.account);

  const closeModal = () => {
    dispatch(setShowAccountModal(false));
  };
  return (
    <>
      <Transition as="div" show={showAccountModal}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          {/* <Transition.Child
            as="span"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 z-10" />
          </Transition.Child> */}
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
                <Dialog.Panel className="flex flex-col justify-between w-full max-w-md h-fit space-y-4 transform overflow-hidden rounded-2xl bg-gray-700 p-6 text-left align-middle shadow-xl transition-all text-white">
                  <button
                    onClick={() => dispatch(setShowAccountModal(false))}
                    className="w-full h-fit flex justify-end"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                  <div className="avatar-section w-fit text-center justify-items-center space-y-4">
                    <div className="w-40 flex items-center justify-center">
                      <Image
                        className="relative rounded-full h-16 w-16"
                        src={avatarUrl || ""}
                        alt="user avatar"
                        height={100}
                        width={100}
                      />
                    </div>
                    <button className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                      Edit Avatar
                    </button>
                  </div>
                  <p>Hey</p>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

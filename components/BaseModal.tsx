import { ReactNode } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface BaseModalProps {
  showCondition: boolean;
  closeModal(): void;
  children: ReactNode;
  hideX?: boolean;
}

export const BaseModal = ({
  showCondition,
  closeModal,
  children,
  hideX,
}: BaseModalProps) => {
  return (
    <>
      <Transition as="div" show={showCondition}>
        <Transition.Child
          as="div"
          enter="ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-40"
          leave="ease-in duration-100"
          leaveFrom="opacity-40"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black" />
        </Transition.Child>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as="div"
                enter="ease-out duration-300 transform-gpu"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200 transform-gpu"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex flex-col justify-between items-center w-72 max-w-md h-fit transform overflow-hidden rounded-2xl bg-gray-700 p-6 text-left align-middle shadow-xl transition-all text-white">
                  {!hideX && (
                    <div className="w-full h-fit flex justify-end focus:border-none focus:ring-none focus:outline-none">
                      <button
                        onClick={closeModal}
                        className="focus:border-none focus:ring-none focus:outline-none"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                  )}
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

import { Menu, Transition } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
  UserCircleIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import {
  setShowAccountModal,
  setShowCreateNetworkModal,
  setShowGuide,
} from "../redux/slices/mainSlice";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";

interface AuthenticatedHeaderProps {
  supabaseClient: any;
  user: User | null;
}

export const AuthenticatedHeader = ({
  supabaseClient,
  user,
}: AuthenticatedHeaderProps) => {
  const dispatch = useAppDispatch();
  const { showGuide, showNetworkMenu, showUserMenu, showAccountModal } =
    useAppSelector((state) => state.main);
  const { username, fullName } = useAppSelector((state) => state.account);
  const { logoUrl } = useAppSelector((state) => state.network);

  return (
    <header className="fixed top-0 h-24 w-full py-4 px-8 bg-gradient-to-r from-[#7180B9] to-[#171738] flex items-center justify-between z-50">
      <span className="flex justify-around items-center space-x-8">
        <Menu as="span" className="relative inline-block text-left">
          <div>
            <Menu.Button className="network-button inline-flex w-full h-full justify-center rounded-full bg-white bg-opacity-0 p-2 text-sm font-medium text-white hover:bg-opacity-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              <Image
                className="rounded-full h-20 w-20 bg-[#D6E5E3] ring-2 ring-white ring-opacity-40 text-sm font-medium opacity-100"
                src={logoUrl || ""}
                alt="network image"
                height={100}
                width={100}
              />
            </Menu.Button>
          </div>
          <Transition
            as="div"
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 mt-2 w-52 origin-center divide-y divide-gray-100 rounded-md bg-slate-500 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => dispatch(setShowCreateNetworkModal(true))}
                      className={`${
                        active ? "opacity-80 text-white" : "text-white"
                      } group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm`}
                    >
                      <PlusIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                      Create New Network
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        <button
          onClick={() => dispatch(setShowGuide(!showGuide))}
          className="guide-button inline-flex w-fit h-1/2 justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Guide
          <BookOpenIcon
            className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
            aria-hidden="true"
          />
        </button>
      </span>
      <span className="w-3/4 sm:w-1/3 lg:w-1/5 flex justify-end">
        <Menu as="span" className="relative inline-block text-left">
          <div>
            <Menu.Button className="user-button inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              <span>{username || fullName}</span>
              <ChevronDownIcon
                className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>
          <Transition
            as="div"
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-slate-500 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() =>
                        dispatch(setShowAccountModal(!showAccountModal))
                      }
                      className={`${
                        active ? "opacity-80 text-white" : "text-white"
                      } group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm`}
                    >
                      <UserCircleIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                      Account
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={async () => await supabaseClient.auth.signOut()}
                      className={`${
                        active ? "opacity-80 text-white" : "text-white"
                      } group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm`}
                    >
                      <ArrowRightOnRectangleIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </span>
    </header>
  );
};

import { Menu, Transition } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  TvIcon,
  UserPlusIcon,
} from "@heroicons/react/20/solid";
import {
  setShowAccountModal,
  setShowAddFriendModal,
  setShowGuide,
} from "../redux/slices/mainSlice";

import { StreamThingButton } from "./StreamThingButton";
import type { User } from "@supabase/supabase-js";

interface AuthenticatedHeaderProps {
  supabaseClient: any;
  user: User | null;
}

export const AuthenticatedHeader = ({
  supabaseClient,
  user,
}: AuthenticatedHeaderProps) => {
  const dispatch = useAppDispatch();
  const { showGuide, showAccountModal } = useAppSelector((state) => state.main);
  const { username, fullName } = useAppSelector((state) => state.account);

  return (
    <header className="fixed top-0 h-24 w-full py-4 px-8 bg-gradient-to-r from-[#006687] to-[#3C1E46] flex items-center justify-between z-50">
      <span className="text-4xl text-white">StreamThing</span>
      <span className="w-full flex justify-end space-x-4">
        <StreamThingButton
          clickFn={() => dispatch(setShowGuide(!showGuide))}
          innerText="Network"
        >
          <TvIcon
            className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
            aria-hidden="true"
          />
        </StreamThingButton>

        <Menu as="span" className="relative inline-block text-left">
          <div>
            <Menu.Button as="div">
              <StreamThingButton innerText={username || fullName}>
                <ChevronDownIcon
                  className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                  aria-hidden="true"
                />
              </StreamThingButton>
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
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-slate-500 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => dispatch(setShowAddFriendModal(true))}
                      className={`${
                        active ? "opacity-80 text-white" : "text-white"
                      } group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm`}
                    >
                      <UserPlusIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                      Add Friends
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => dispatch(setShowAccountModal(true))}
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

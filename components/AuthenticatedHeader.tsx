import { User } from "@auth0/auth0-react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/20/solid";

interface AuthenticatedHeaderProps {
  user: User | undefined;
  logout: any;
}

export const AuthenticatedHeader = ({
  user,
  logout,
}: AuthenticatedHeaderProps) => {
  return (
    <header className="sticky top-0 h-24 w-full p-4 bg-gradient-to-r from-[#006687] to-[#3C1E46] flex items-center justify-between z-50">
      <span className="text-4xl text-white">StreamThing</span>
      <Menu as="span" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <span>{user?.name}</span>
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
                    onClick={() => logout()}
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
    </header>
  );
};

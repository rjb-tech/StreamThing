import {
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const StickyHeader = () => {
  const { isAuthenticated, loginWithPopup, user } = useAuth0();
  return isAuthenticated ? (
    <header className="fixed top-0 h-24 w-full p-4 bg-slate-600 flex items-center justify-between z-50">
      <button
        id="network-info-dropdown-button"
        data-dropdown-toggle="network-info-dropdown"
        className="bg-pink-300 h-full w-16 rounded-xl"
      ></button>
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
        ></Transition>
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-violet-500 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  {active ? (
                    <ChevronDownIcon
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronDownIcon
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  )}
                  Edit
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    </header>
  ) : (
    <header className="fixed top-0 h-24 w-full p-4 bg-slate-600 z-50">
      <div className="p-4 w-full h-full rounded-lg flex items-center justify-between">
        <span className="text-4xl text-white">StreamThing</span>
        <button
          onClick={() => loginWithPopup()}
          className="border border-white w-fit h-fit p-4 rounded-lg text-white hover:ring-4 hover:ring-slate-500 flex items-center justify-center"
        >
          <span className="pr-2">Login</span>
          <ArrowRightOnRectangleIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

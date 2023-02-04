import { Menu, Transition } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  TvIcon,
  ArrowsRightLeftIcon,
  SignalIcon,
} from "@heroicons/react/20/solid";
import {
  resetUI,
  setMyNetworkSelectedIndex,
  setShowAccountModal,
  setShowMyNetworkModal,
} from "../redux/slices/uiSlice";

import { StreamThingButton } from "./StreamThingButton";
import { resetAccount } from "../redux/slices/accountSlice";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { getAndSetVideoFromContentSource } from "./SupabaseHelpers";
import Image from "next/image";
import Link from "next/link";

interface AuthenticatedHeaderProps {
  videoLoaded: boolean;
}

export const AuthenticatedHeader = ({
  videoLoaded,
}: AuthenticatedHeaderProps) => {
  const supabaseClient = useSupabaseClient();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showMyNetworkModal, contentSourceCurrentlyShowing } = useAppSelector(
    (state) => state.ui
  );
  const { username, activeContentSource, contentSources } = useAppSelector(
    (state) => state.account
  );

  return (
    <header
      className={`h-28 w-full py-4 px-8 flex items-center justify-between flex-none`}
    >
      <Image
        src="/stream-thing-logo.png"
        alt="StreamThing Logo"
        height={1100}
        width={250}
      />

      <span className="w-fit flex justify-end space-x-4">
        {/* <StreamThingButton innerText="" fullHeight>
          <BellAlertIcon className="h-5 w-5" />
          <div className="absolute ml-12 mb-8 bg-pink-400 rounded-full w-2 h-2" />
          <div className="absolute ml-12 mb-8 bg-pink-400 rounded-full w-2 h-2 animate-ping-slow" />
        </StreamThingButton> */}

        <div
          className={`h-fit w-fit duration-1000 ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <StreamThingButton
            innerText="Next Video"
            fullHeight
            clickFn={() =>
              getAndSetVideoFromContentSource(
                contentSourceCurrentlyShowing,
                supabaseClient,
                dispatch
              )
            }
          >
            <ArrowsRightLeftIcon className="h-5 w-5 ml-2" />
          </StreamThingButton>
        </div>

        <StreamThingButton
          // This is a little buggy rn if you click the button when the modal is already open
          // it just keeps reopening the modal right after closing it
          // The click out closes before the button click event triggers
          // so it's just a ui loop
          clickFn={() => {
            if (contentSources.length === 0)
              dispatch(setMyNetworkSelectedIndex(1));
            else dispatch(setMyNetworkSelectedIndex(0));

            dispatch(setShowMyNetworkModal(!showMyNetworkModal));
          }}
          innerText="Network"
          fullHeight
        >
          <TvIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
        </StreamThingButton>

        <Menu as="span" className="relative inline-block text-left">
          <div>
            <Menu.Button as="div">
              <StreamThingButton innerText={username} fullHeight>
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
                      onClick={() => dispatch(setShowAccountModal(true))}
                      className={`${
                        active ? "opacity-80 text-white" : "text-white"
                      } group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm`}
                    >
                      <UserIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                      Profile
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="https://discord.gg/mwPNM9ve"
                      target="_blank"
                      className={`${
                        active ? "opacity-80 text-white" : "text-white"
                      } group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm`}
                    >
                      <SignalIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                      Discord
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={async () => {
                        await supabaseClient.auth.signOut();
                        dispatch(resetAccount());
                        dispatch(resetUI());
                        router.push("/");
                      }}
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

import { Tab } from "@headlessui/react";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setMyNetworkSelectedIndex,
  setShowMyNetworkModal,
} from "../redux/slices/uiSlice";
import { BaseModal } from "./BaseModal";
import { ContentSourcesTab } from "./ContentSourcesTab";
import { ChannelsTab } from "./ChannelsTab";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";

export const MyNetworkModal = () => {
  const dispatch = useAppDispatch();
  const channelsTabTooltip = useRef<HTMLDivElement>(null);
  const contentTabTooltip = useRef<HTMLDivElement>(null);
  const { showMyNetworkModal, myNetworkSelectedIndex } = useAppSelector(
    (state) => state.ui
  );
  const { contentSources, following } = useAppSelector(
    (state) => state.account
  );

  const isChannelsTab = myNetworkSelectedIndex === 0;
  const isContentTab = myNetworkSelectedIndex === 1;

  function closeModal() {
    dispatch(setShowMyNetworkModal(false));
  }

  return (
    <BaseModal showCondition={showMyNetworkModal} closeModal={closeModal} wide>
      <div className="w-full">
        <Tab.Group
          selectedIndex={myNetworkSelectedIndex}
          onChange={(index) => {
            const hasSources = contentSources.length > 0;
            if (hasSources) dispatch(setMyNetworkSelectedIndex(index));
            else dispatch(setMyNetworkSelectedIndex(1));
          }}
        >
          <Tab.List className="flex space-x-8 rounded-xl bg-[#9A97D8]/[0.3] p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 transition-all",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              <div className="w-fit flex items-center justify-center space-x-4 mx-auto">
                <span
                  className={`transition-all ${
                    isChannelsTab ? "visible opacity-100" : "translate-x-4"
                  }`}
                >
                  {`Friends (${following.length + 1})`}
                </span>{" "}
                {/* 1 added here ^^ to count current user's channel too */}
                <span
                  className={`transition-all duration-100 ${
                    isChannelsTab ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <InformationCircleIcon
                    className="w-4 h-4 cursor-default"
                    onMouseOver={(e) => {
                      channelsTabTooltip.current?.classList.replace(
                        "opacity-0",
                        "opacity-100"
                      );
                    }}
                    onMouseLeave={(e) => {
                      channelsTabTooltip.current?.classList.replace(
                        "opacity-100",
                        "opacity-0"
                      );
                    }}
                  />
                  <div
                    ref={channelsTabTooltip}
                    className="absolute w-64 h-fit p-4 mt-4 bg-gray-900 rounded-md border-2 border-[#9A97D8]/[0.3] transition-all opacity-0 z-50"
                  >
                    <p className="relative w-full h-full text-start text-white">
                      Add friends to your network and see their channels here.
                    </p>
                  </div>
                </span>
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 transition-all",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              <div className="w-fit flex items-center justify-center space-x-4 mx-auto">
                <span
                  className={`transition-all ${
                    isContentTab ? "visible opacity-100" : "translate-x-4"
                  }`}
                >
                  {`Content (${contentSources.length})`}
                </span>{" "}
                {/* 1 added here ^^ to count current user's channel too */}
                <span
                  className={`transition-all duration-100 ${
                    isContentTab ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <InformationCircleIcon
                    className="w-4 h-4 cursor-pointer"
                    onMouseOver={(e) => {
                      contentTabTooltip.current?.classList.replace(
                        "opacity-0",
                        "opacity-100"
                      );
                    }}
                    onMouseLeave={(e) => {
                      contentTabTooltip.current?.classList.replace(
                        "opacity-100",
                        "opacity-0"
                      );
                    }}
                  />
                  <div
                    ref={contentTabTooltip}
                    className="absolute w-64 h-fit p-4 mt-4 bg-gray-900 rounded-md border-2 border-[#9A97D8]/[0.3] transition-all opacity-0"
                  >
                    <p className="relative w-full h-full text-start text-white">
                      Your active content source shuffles every hour, or when
                      you add a new source. You can also elevate and show any
                      content source at any time.
                    </p>
                  </div>
                </span>
              </div>
            </Tab>
          </Tab.List>
          <Tab.Panels className="h-fit w-full">
            <Tab.Panel className="content-source-tab flex items-center justify-center h-full w-full">
              <ChannelsTab />
            </Tab.Panel>
            <Tab.Panel className="content-source-tab flex items-center justify-center h-full w-full">
              <ContentSourcesTab />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </BaseModal>
  );
};

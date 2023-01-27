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

export const MyNetworkModal = () => {
  const dispatch = useAppDispatch();
  const { showMyNetworkModal, myNetworkSelectedIndex } = useAppSelector(
    (state) => state.ui
  );
  const { contentSources } = useAppSelector((state) => state.account);

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
              Channels
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
              Content
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

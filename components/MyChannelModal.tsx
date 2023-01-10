import { Tab } from "@headlessui/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import classNames from "classnames";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setShowMyChannelModal } from "../redux/slices/uiSlice";
import { BaseModal } from "./BaseModal";
import { ContentSourcesTab } from "./ContentSourcesTab";
import { getContentSources } from "./SupabaseHelpers";

export const MyChannelModal = () => {
  const user = useUser();
  const dispatch = useAppDispatch();
  const supabaseClient = useSupabaseClient();
  const { showMyChannelModal } = useAppSelector((state) => state.ui);

  const formik = useFormik({
    initialValues: {},
    onSubmit: (values) => {},
    validate: (values) => {},
  });

  function closeModal() {
    dispatch(setShowMyChannelModal(false));
  }

  return (
    <BaseModal showCondition={showMyChannelModal} closeModal={closeModal} wide>
      <div className="w-full">
        <Tab.Group>
          <Tab.List className="flex space-x-8 rounded-xl bg-blue-900/20 p-1">
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
              My Content
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
              Following
            </Tab>
          </Tab.List>
          <Tab.Panels className="h-fit min-h-[24rem] w-full">
            <Tab.Panel className="content-source-tab flex items-center justify-center h-full w-full">
              <ContentSourcesTab />
            </Tab.Panel>
            <Tab.Panel>There</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </BaseModal>
  );
};
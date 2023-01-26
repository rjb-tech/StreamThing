import { XMarkIcon, TvIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import classNames from "classnames";
import { useFormik } from "formik";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setActiveStream,
  setShowMyNetworkModal,
} from "../redux/slices/uiSlice";
import { StreamThingButton } from "./StreamThingButton";
import {
  getAndSetVideoFromContentSource,
  sendFollow,
  sendUnfollow,
} from "./SupabaseHelpers";

export const ChannelsTab = () => {
  const user = useUser();
  const dispatch = useAppDispatch();
  const supabaseClient = useSupabaseClient();
  const { following, username, avatarUrl, activeContentSource } =
    useAppSelector((state) => state.account);

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    onSubmit: (values) => {
      if (user && !formik.errors.username) {
        sendFollow(user.id, values.username, supabaseClient, dispatch);
        formik.resetForm();
      }
    },
    validate: (values) => {
      const errors: { username?: string } = {};

      if (values.username === "") errors.username = "Username Required";

      if (values.username.length > 50)
        errors.username = "Must be less than 50 characters";

      if (values.username.includes(" "))
        errors.username = "Usernames can't include spaces";

      if (values.username === username) errors.username = "Can't add yourself";

      return errors;
    },
  });

  return (
    <div className="h-full w-full">
      <div className="following w-full h-60 mx-auto border border-gray-600 my-4 p-4 rounded overflow-y-scroll space-y-4 bg-gray-600">
        <div
          className="w-full h-fit flex items-center py-2 space-x-6 bg-gray-500 rounded-lg shadow-md hover:shadow-lg hover:scale-[101%] transition-all"
          key={0}
        >
          <div
            onClick={() => {
              getAndSetVideoFromContentSource(
                activeContentSource,
                supabaseClient,
                dispatch
              );
            }}
            className="w-full flex items-center mx-2 cursor-pointer"
          >
            <Image
              className="rounded-full h-10 w-10"
              alt={`${username}`}
              width={100}
              height={100}
              src={avatarUrl || ""}
            />
            <span className="pl-4 flex flex-col">
              <div>{username}</div>
              <div className="flex space-x-3 items-center">
                <TvIcon className="h-4 w-4" />
                <span>
                  {activeContentSource
                    ? new URL(activeContentSource).pathname
                        .replace("/", "")
                        .replace("@", "")
                    : ""}
                </span>
              </div>
            </span>
          </div>
        </div>
        {following.map((channel, index) => {
          return (
            <div
              className="w-full h-fit flex items-center py-2 space-x-6 bg-gray-500 rounded-lg shadow-md hover:shadow-lg hover:scale-[101%] transition-all"
              key={index + 1}
            >
              <div
                onClick={() => {
                  getAndSetVideoFromContentSource(
                    channel.activeContentSource,
                    supabaseClient,
                    dispatch
                  );
                }}
                className="w-full flex items-center mx-2 cursor-pointer"
              >
                <Image
                  className="rounded-full h-10 w-10"
                  alt={`${channel.username}`}
                  width={100}
                  height={100}
                  src={channel.avatarUrl}
                />
                <span className="pl-4 flex flex-col">
                  <div>{channel.username}</div>
                  <div className="flex space-x-3 items-center">
                    <TvIcon className="h-4 w-4" />
                    <span>
                      {channel.activeContentSource
                        ? new URL(channel.activeContentSource).pathname
                            .replace("/", "")
                            .replace("@", "")
                        : "No active content"}
                    </span>
                  </div>
                </span>
              </div>
              <XMarkIcon
                className="h-7 w-7 pr-2 cursor-pointer"
                onClick={() => {
                  if (user)
                    sendUnfollow(user.id, channel.id, supabaseClient, dispatch);
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="follower-user h-2/6">
        <form onSubmit={formik.handleSubmit}>
          <span className="space-y-2 w-11/12">
            <label
              className={classNames("w-full flex justify-start", {
                "text-red-500": formik.errors.username !== undefined,
              })}
            >
              {formik.errors.username
                ? formik.errors.username
                : "Connect friends to your network"}
            </label>
            <input
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              placeholder="Username you want to follow"
              className="w-full text-black rounded px-4 focus:ring focus:ring-white focus:ring-opacity-30 focus:outline-none"
            />
            <span className="w-full flex justify-end pt-4 hidden">
              <StreamThingButton
                innerText="Connect"
                fullWidth
                fullHeight
                buttonType="submit"
                disabled={
                  formik.errors.username !== undefined ||
                  formik.values.username.length > 50
                }
              />
            </span>
          </span>
        </form>
      </div>
    </div>
  );
};

import { XMarkIcon } from "@heroicons/react/20/solid";
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
import { sendFollow, sendUnfollow } from "./SupabaseHelpers";

export const SocialTab = () => {
  const user = useUser();
  const dispatch = useAppDispatch();
  const supabaseClient = useSupabaseClient();
  const { following, followers, username } = useAppSelector(
    (state) => state.account
  );

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
      <div className="following w-full h-60 mx-auto border border-gray-600 my-4 py-2 px-4 rounded overflow-y-scroll space-y-4 bg-gray-600">
        {following.map((channel, index) => {
          return (
            <div
              className="w-full h-fit flex items-center py-2 space-x-6 bg-gray-500 rounded-lg shadow-xl"
              key={index}
            >
              <div
                onClick={() => {
                  dispatch(setActiveStream("https://twitch.tv/pobelter"));
                  dispatch(setShowMyNetworkModal(false));
                }}
                className="w-full flex items-center mx-2 cursor-pointer"
              >
                <Image
                  className="rounded-full h-8 w-8"
                  alt={`${channel.username}`}
                  width={100}
                  height={100}
                  src={channel.avatarUrl}
                />
                <span className="pl-4">{channel.username}</span>
              </div>
              <XMarkIcon
                className="h-6 w-6 pr-2 cursor-pointer"
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
              className="w-full text-black border border-white rounded-full px-4 focus:ring focus:ring-white focus:ring-opacity-20 focus:outline-none"
            />
            <span className="w-full flex justify-end pt-4">
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

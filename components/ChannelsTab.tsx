import { Switch } from "@headlessui/react";
import {
  InformationCircleIcon,
  PlayIcon,
  SparklesIcon,
} from "@heroicons/react/20/solid";
import { XMarkIcon, TvIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import classNames from "classnames";
import { useFormik } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setActiveContentSource,
  setChannelCurrentlyViewing,
} from "../redux/slices/accountSlice";
import {
  setContentSourceCurrentlyShowing,
  setMinimizeHeader,
  setShowMyNetworkModal,
} from "../redux/slices/uiSlice";
import { StreamThingButton } from "./StreamThingButton";
import {
  getAndSetVideoFromContentSource,
  getAndSetShuffleModeVideo,
  sendFollow,
  sendUnfollow,
  toggleShuffleMode,
} from "./SupabaseHelpers";

export const ChannelsTab = () => {
  const user = useUser();
  const dispatch = useAppDispatch();
  const supabaseClient = useSupabaseClient();
  const [shuffleTooltipHovered, setShuffleTooltipHovered] =
    useState<boolean>(false);
  const { contentSourceCurrentlyShowing } = useAppSelector((state) => state.ui);
  const {
    following,
    username,
    avatarUrl,
    activeContentSource,
    channelCurrentlyViewing,
    shuffleMode,
  } = useAppSelector((state) => state.account);

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

  function formatActiveContentSource(contentSource: string) {
    if (contentSource === "shuffle_mode") return "Shuffle Mode";

    return contentSource !== null
      ? new URL(contentSource).pathname.replace("/", "").replace("@", "")
      : "No active content";
  }

  function handleMyChannelClick() {
    dispatch(setMinimizeHeader(true));
    dispatch(setChannelCurrentlyViewing(user?.id || ""));

    if (activeContentSource === "shuffle_mode") {
      dispatch(setContentSourceCurrentlyShowing("shuffle_mode"));
      getAndSetShuffleModeVideo(user?.id || "", supabaseClient, dispatch);
    } else {
      getAndSetVideoFromContentSource(
        activeContentSource,
        supabaseClient,
        dispatch
      );
    }

    dispatch(setShowMyNetworkModal(false));
  }

  function handleFriendChannelClick(
    channelId: string,
    channelContentSource: string
  ) {
    dispatch(setMinimizeHeader(true));
    dispatch(setChannelCurrentlyViewing(channelId));

    if (channelContentSource === "shuffle_mode") {
      dispatch(setContentSourceCurrentlyShowing("shuffle_mode"));
      getAndSetShuffleModeVideo(channelId, supabaseClient, dispatch);
    } else {
      getAndSetVideoFromContentSource(
        channelContentSource,
        supabaseClient,
        dispatch
      );
    }

    dispatch(setShowMyNetworkModal(false));
  }

  useEffect(() => {
    if (shuffleMode === true)
      dispatch(setContentSourceCurrentlyShowing("shuffle_mode"));
    else {
      if (channelCurrentlyViewing === user?.id)
        dispatch(setContentSourceCurrentlyShowing(activeContentSource));
      else {
        const channelToUse = following.filter(
          (channel) => channel.id === channelCurrentlyViewing
        )[0];
        dispatch(
          setContentSourceCurrentlyShowing(channelToUse?.activeContentSource)
        );
      }
    }
  }, [shuffleMode]);

  useEffect(() => {
    const channelQueried = following.filter(
      (channel) => channel.id === channelCurrentlyViewing
    )[0];

    if (channelQueried)
      dispatch(
        setContentSourceCurrentlyShowing(channelQueried.activeContentSource)
      );
  }, [following]);

  return (
    <div className="h-full w-full">
      <div className="scroll-area following w-full h-60 mx-auto border border-gray-600 my-4 p-4 rounded overflow-x-visible overflow-y-scroll space-y-4 bg-gray-600">
        <div
          className={`w-full h-fit flex items-center py-2 space-x-6 bg-gray-500 rounded-lg shadow-md hover:shadow-xl hover:overflow-visible transition-all hover:z-40 ${
            user?.id === channelCurrentlyViewing
              ? "border-2 border-[#EDAE49]"
              : ""
          }`}
          key={0}
        >
          <div className="w-full flex items-center justify-between mx-2 cursor-pointer">
            <span
              className="w-full flex items-center"
              onClick={() => {
                if (
                  channelCurrentlyViewing !== user?.id ||
                  contentSourceCurrentlyShowing !== activeContentSource
                ) {
                  handleMyChannelClick();
                }
              }}
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
                <div
                  className="flex w-fit space-x-3 items-center"
                  title={`${username}'s active content source`}
                >
                  <TvIcon className="h-4 w-4" />
                  <span>{formatActiveContentSource(activeContentSource)}</span>
                </div>
              </span>
            </span>
            <span className="w-fit flex justify-end items-center space-x-2">
              <div>
                <InformationCircleIcon
                  onMouseEnter={() => setShuffleTooltipHovered(true)}
                  onMouseLeave={() => setShuffleTooltipHovered(false)}
                  className="w-4 h-4 cursor-default"
                />
                <div
                  className={`absolute w-64 h-fit p-4 mt-4 bg-gray-900 rounded-md border-2 border-[#9A97D8]/[0.3] transition-all duration-200 ${
                    shuffleTooltipHovered
                      ? "opacity-100 translate-y-0 visible"
                      : "opacity-0 -translate-y-2 invisible"
                  }`}
                >
                  <p className="relative w-full h-full text-start text-white">
                    {shuffleMode
                      ? "Your channel is in shuffle mode and showing random videos from all your added content sources. Toggle to switch to standard mode."
                      : "Your channel is in standard mode and showing random videos only from the currently active content source. Toggle to switch to shuffle mode."}
                  </p>
                </div>
              </div>

              <Switch
                checked={shuffleMode}
                onChange={() => {
                  if (user)
                    toggleShuffleMode(
                      user.id,
                      shuffleMode,
                      supabaseClient,
                      dispatch
                    );
                }}
                className={`${
                  shuffleMode ? "bg-[#EF436B]/[0.5]" : "bg-[#182E63]/[0.5]"
                } relative inline-flex h-6 w-11 items-center transition-all rounded-full`}
              >
                {shuffleMode ? (
                  <span className="absolute left-0">
                    <SparklesIcon className="h-3 w-3 ml-1" />
                  </span>
                ) : (
                  <span className="absolute right-0">
                    <PlayIcon className="h-3 w-3 mr-1" />
                  </span>
                )}
                <span
                  className={`${
                    shuffleMode ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-all`}
                />
              </Switch>
            </span>
          </div>
        </div>
        {following.map((channel, index) => {
          const isActiveChannel = channel.id === channelCurrentlyViewing;
          return (
            <div
              className={`w-full h-fit flex items-center py-2 space-x-6 bg-gray-500 rounded-lg shadow-md hover:shadow-xl transition-all ${
                isActiveChannel ? "border-2 border-[#EDAE49]" : ""
              }`}
              key={index + 1}
            >
              <div
                onClick={() => {
                  if (
                    channelCurrentlyViewing !== channel.id ||
                    contentSourceCurrentlyShowing !==
                      channel.activeContentSource
                  ) {
                    handleFriendChannelClick(
                      channel.id,
                      channel.activeContentSource
                    );
                  }
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
                  <div
                    className="flex space-x-3 items-center"
                    title={`${channel.username}'s active content source`}
                  >
                    <TvIcon className="h-4 w-4" />
                    <span>
                      {formatActiveContentSource(channel.activeContentSource)}
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
                : "Add friends to your network"}
            </label>
            <input
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              placeholder="Username"
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

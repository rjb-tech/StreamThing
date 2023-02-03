import { ChevronDoubleUpIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import classNames from "classnames";
import { useFormik } from "formik";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { StreamThingButton } from "./StreamThingButton";
import {
  addContentSource,
  removeContentSource,
  updateActiveContentSource,
} from "./SupabaseHelpers";
import Image from "next/image";

export const ContentSourcesTab = () => {
  const user = useUser();
  const dispatch = useAppDispatch();
  const supabaseClient = useSupabaseClient();
  const { contentSources, activeContentSource } = useAppSelector(
    (state) => state.account
  );
  const hasSources = contentSources.length > 0;
  const formik = useFormik({
    initialValues: {
      contentLink: "",
    },
    onSubmit: (values) => {
      if (user) {
        const channelName = new URL(values.contentLink).pathname.split("/")[1];
        const sanitizedChannelLink = `https://www.youtube.com/${channelName}`;

        addContentSource(
          user.id,
          sanitizedChannelLink,
          supabaseClient,
          dispatch
        );

        formik.resetForm();
      }
    },
    validate: (values) => {
      const errors: { contentLink?: string } = {};

      const validSource =
        values.contentLink.includes("https://youtube.com") ||
        values.contentLink.includes("https://www.youtube.com");
      // values.contentLink.includes("https://twitch.tv") ||
      // values.contentLink.includes("https://www.twitch.tv");

      const linksToSingleVideo = values.contentLink.includes("/watch?v=");

      if (!validSource || linksToSingleVideo)
        errors.contentLink = "Please enter a valid Youtube channel link";

      if (values.contentLink === "")
        errors.contentLink = "Content source cannot be empty";

      if (values.contentLink.includes(" "))
        errors.contentLink = "Link can't include spaces";

      // Flesh this out a little bit
      // Cast into URL object at the top and use that to variable for checking protocol, etc.
      if (!values.contentLink.includes("https://"))
        errors.contentLink = "Link must contain https:// protocol";

      if (values.contentLink.includes('"'))
        errors.contentLink = 'Invalid character: "';

      return errors;
    },
  });

  return (
    <div className="h-fit w-full">
      <div className="content-sources w-full h-60 mx-auto border border-gray-600 my-4 p-4 rounded overflow-y-scroll space-y-4 bg-gray-600 scroll-smooth">
        {[...contentSources].reverse().map((sourceLink, index) => {
          const source = new URL(sourceLink);
          const isFromYoutube = source.host.includes("youtube.com");
          const isFromTwitch = source.host.includes("twitch.tv");

          const isActiveSource = activeContentSource === sourceLink;

          return (
            <div
              className={classNames(
                "w-full h-fit flex items-center py-2 space-x-6 bg-gray-500 rounded-lg shadow-md hover:shadow-lg hover:scale-[101%] transition-all",
                { "border-2 border-[#EDAE49]": isActiveSource }
              )}
              key={index}
            >
              {isFromTwitch && (
                <Link
                  className="flex items-center w-full"
                  href={source}
                  target="_blank"
                >
                  <div className="h-8 w-8 flex items-center overflow-visible flex-none">
                    <Image
                      className="pl-2"
                      alt="Twitch logo"
                      width={734}
                      height={518}
                      src="/TwitchGlitchPurple.png"
                    />
                  </div>
                  <span className="pl-4">
                    {source.pathname.replace("/", "")}
                  </span>
                </Link>
              )}
              {isFromYoutube && (
                <Link
                  className="flex items-center w-full"
                  href={source}
                  target="_blank"
                >
                  <div className="h-8 w-8 flex items-center overflow-visible flex-none">
                    <Image
                      className="pl-2"
                      alt="Youtube logo"
                      width={734}
                      height={518}
                      src="/yt_icon_rgb.png"
                    />
                  </div>
                  <span className="pl-4">
                    {source.pathname
                      .replace("/", "")
                      .replace("@", "")
                      .replace("/videos", "")}
                  </span>
                </Link>
              )}
              <span className="flex">
                {activeContentSource !== sourceLink && (
                  <ChevronDoubleUpIcon
                    title="Elevate to active source"
                    className="h-7 w-7 pr-2 cursor-pointer"
                    onClick={() => {
                      if (user)
                        updateActiveContentSource(
                          user.id,
                          sourceLink,
                          supabaseClient,
                          dispatch
                        );
                    }}
                  />
                )}
                <XMarkIcon
                  title="Remove content source"
                  className="h-7 w-7 pr-2 cursor-pointer"
                  onClick={() => {
                    if (user)
                      removeContentSource(
                        user?.id,
                        source.href,
                        supabaseClient,
                        dispatch
                      );
                  }}
                />
              </span>
            </div>
          );
        })}
        {!hasSources && user && (
          <span className="w-full flex justify-center animate-bounce pt-8">
            Add some content sources to get started!
          </span>
        )}
      </div>
      <div className="add-content-source h-2/6">
        <form onSubmit={formik.handleSubmit}>
          <span className="space-y-2 w-11/12">
            <label
              className={classNames("w-full flex justify-start", {
                "text-red-500": formik.errors.contentLink !== undefined,
              })}
            >
              {formik.errors.contentLink
                ? formik.errors.contentLink
                : "Add new content source to your channel"}
            </label>
            <input
              type="text"
              name="contentLink"
              value={formik.values.contentLink}
              onChange={formik.handleChange}
              placeholder="Youtube channel link"
              className="w-full text-black rounded px-4 focus:ring focus:ring-white focus:ring-opacity-30 focus:outline-none"
            />
            <span className="w-full flex justify-end pt-4 hidden">
              <StreamThingButton
                innerText="Submit"
                buttonType="submit"
                fullWidth
                fullHeight
                disabled={formik.errors.contentLink !== undefined}
              />
            </span>
          </span>
        </form>
      </div>
    </div>
  );
};

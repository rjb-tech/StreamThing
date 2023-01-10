import { XMarkIcon } from "@heroicons/react/20/solid";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import classNames from "classnames";
import { useFormik } from "formik";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { StreamThingButton } from "./StreamThingButton";
import { addContentSource, removeContentSource } from "./SupabaseHelpers";
import twitchLogo from "../images/TwitchGlitchPurple.png";
import youtubeLogo from "../images/yt_icon_rgb.png";
import Image from "next/image";

export const ContentSourcesTab = () => {
  const user = useUser();
  const dispatch = useAppDispatch();
  const supabaseClient = useSupabaseClient();
  const { contentSources } = useAppSelector((state) => state.account);
  const formik = useFormik({
    initialValues: {
      contentLink: "",
    },
    onSubmit: (values) => {
      if (user) {
        addContentSource(user.id, values.contentLink, supabaseClient, dispatch);
        formik.resetForm();
      }
    },
    validate: (values) => {
      const errors: { contentLink?: string } = {};

      const validSource =
        values.contentLink.includes("https://youtube.com") ||
        values.contentLink.includes("https://www.youtube.com") ||
        values.contentLink.includes("https://twitch.tv") ||
        values.contentLink.includes("https://www.twitch.tv");

      const linksToSingleVideo = values.contentLink.includes("/watch?v=");

      if (!validSource || linksToSingleVideo)
        errors.contentLink =
          "Please enter a valid channel link from Twitch or Youtube";

      if (values.contentLink === "")
        errors.contentLink = "Content source cannot be empty";

      return errors;
    },
  });

  return (
    <div className="h-full w-full">
      <div className="content-sources w-full h-60 mx-auto border-2 my-4 py-2 px-4 rounded-xl overflow-y-scroll space-y-4">
        {contentSources.map((source, index) => {
          const isFromYoutube = source.host.includes("youtube.com");

          const isFromTwitch = source.host.includes("twitch.tv");

          return (
            <div className="w-full h-6 flex my-2 space-x-4" key={index}>
              <XMarkIcon
                className="h-6 w-6 cursor-pointer"
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
              {isFromTwitch && (
                <Link href={source} target="_blank">
                  <div className="h-6 w-6 flex items-center overflow-visible flex-none">
                    <Image
                      alt="Twitch logo"
                      width={734}
                      height={518}
                      src={twitchLogo}
                    />
                    <span className="pl-4">
                      {source.pathname.replace("/", "")}
                    </span>
                  </div>
                </Link>
              )}
              {isFromYoutube && (
                <Link href={source} target="_blank">
                  <div className="h-6 w-6 flex items-center overflow-visible flex-none">
                    <Image
                      alt="Youtube logo"
                      width={734}
                      height={518}
                      src={youtubeLogo}
                    />
                    <span className="pl-4">
                      {source.pathname.replace("/", "").replace("@", "")}
                    </span>
                  </div>
                </Link>
              )}
            </div>
          );
        })}
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
                : "Add new content source"}
            </label>
            <input
              type="text"
              name="contentLink"
              value={formik.values.contentLink}
              onChange={formik.handleChange}
              placeholder="Paste Link to Youtube or Twitch Channel"
              className="w-full text-black border border-white rounded-md px-4 focus:ring focus:ring-white focus:ring-opacity-20 focus:outline-none"
            />
            <span className="w-full flex justify-end pt-4">
              <StreamThingButton
                innerText="Submit"
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

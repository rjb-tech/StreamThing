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
  const { contentSourceBeingAdded } = useAppSelector((state) => state.ui);
  const { contentSources } = useAppSelector((state) => state.account);
  const contentSourcesCopy = [...contentSources];
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

          return (
            <div
              className="w-full h-fit flex items-center py-2 space-x-6 bg-gray-500 rounded-lg shadow-md hover:shadow-lg hover:scale-[101%] transition-all"
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
                      src={twitchLogo}
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
                      src={youtubeLogo}
                    />
                  </div>
                  <span className="pl-4">
                    {source.pathname.replace("/", "").replace("@", "")}
                  </span>
                </Link>
              )}
              <XMarkIcon
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
                : "Add new content source to your channel"}
            </label>
            <input
              type="text"
              name="contentLink"
              value={formik.values.contentLink}
              onChange={formik.handleChange}
              placeholder="Youtube or Twitch channel link"
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

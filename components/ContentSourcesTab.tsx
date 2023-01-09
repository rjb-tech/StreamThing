import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import classNames from "classnames";
import { useFormik } from "formik";
import { StreamThingButton } from "./StreamThingButton";
import { addContentSource } from "./SupabaseHelpers";

export const ContentSourcesTab = () => {
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  const formik = useFormik({
    initialValues: {
      contentLink: "",
    },
    onSubmit: (values) => {
      if (user) {
        addContentSource(user.id, values.contentLink, supabaseClient);
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

      if (!validSource)
        errors.contentLink = "Please enter a valid link from Twitch or Youtube";

      if (values.contentLink === "")
        errors.contentLink = "Content source cannot be empty";

      return errors;
    },
  });
  return (
    <div className="h-full w-full">
      <div className="content-sources w-full h-60 mx-auto border-2 my-4 rounded-xl"></div>
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
              placeholder="Paste Youtube or Twitch Link"
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

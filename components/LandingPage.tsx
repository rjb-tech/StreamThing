import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { StreamThingButton } from "./StreamThingButton";

export const LandingPage = () => {
  const supabase = useSupabaseClient();

  const [linkSent, setLinkSent] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: { email: "" },
    onSubmit: async (values) => {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: window.location.origin,
          shouldCreateUser: false,
        },
      });

      if (error)
        toast.error(`No account associated with ${values.email}`, {
          position: toast.POSITION.TOP_CENTER,
        });
      else setLinkSent(true);
    },
    validate: (values) => {},
  });

  return (
    <>
      <div className="zippy-dee-doo h-screen w-screen flex flex-col transform-gpu">
        <div className="stars absolute h-screen w-screen transform-gpu">
          <div id="stars" />
          <div id="stars2" />
          <div id="stars3" />
        </div>
        <div className="login-view h-full w-full text-white flex items-center transform-gpu">
          <div className="w-screen h-screen mx-auto relative rounded-md flex flex-col space-y-6 text-center z-50 bg-gradient-to-b from-[#EF436B]/[0.2] via-[#182E63]/[0.3] to-transparent">
            <span className="h-full w-full flex flex-col justify-center items-center space-y-4 ">
              <Image
                src="/stream-thing-landing-page-logo.png"
                alt="StreamThing Landing Page Logo"
                height={1100}
                width={400}
              />
              {linkSent === false ? (
                <form className="space-y-6" onSubmit={formik.handleSubmit}>
                  <input
                    name="email"
                    placeholder="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    className=" w-full text-black border border-white rounded-md px-4 focus:ring focus:ring-white focus:ring-opacity-20 focus:outline-none"
                  />
                  <StreamThingButton innerText="Login" fullWidth illuminate />
                </form>
              ) : (
                <div className="h-16 animate-bounce">
                  Check your email! (make sure to expand the message)
                </div>
              )}
            </span>
          </div>
        </div>
      </div>
      <Link
        href="https://twitter.com/rjb_tech"
        target="_blank"
        className="zippy-dee-doo h-fit w-fit absolute bottom-0 text-white mx-auto pb-4"
      >
        Made by Ryne :)
      </Link>
    </>
  );
};

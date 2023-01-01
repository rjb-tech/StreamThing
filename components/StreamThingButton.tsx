import { ReactNode } from "react";
import classNames from "classnames";

interface StreamThingButtonProps {
  innerText: string | undefined;
  children?: ReactNode; // This is intended for icons from hero icons
  clickFn?(): void;
  buttonType?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  fullWidth?: boolean;
  ping?: boolean;
}

export const StreamThingButton = ({
  innerText,
  clickFn,
  children,
  buttonType = undefined,
  disabled = false,
  fullWidth = false,
  ping = false,
}: StreamThingButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={clickFn}
      type={buttonType}
      className={classNames(
        "inline-flex h-1/2 justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-opacity-30 hover:scale-105 active:scale-100 duration-250 disabled:bg-opacity-10 disabled:text-gray-800",
        {
          "w-fit": !fullWidth,
          "w-full": fullWidth,
        }
      )}
    >
      {ping && (
        <>
          <div className="bg-pink-400 rounded-full w-2 h-2 absolute -right-0.5 -top-0.5 animate-ping-slow" />
          <div className="bg-pink-400 rounded-full w-2 h-2 absolute -right-0.5 -top-0.5" />
        </>
      )}
      {innerText}
      {children}
    </button>
  );
};

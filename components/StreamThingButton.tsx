import { ReactNode } from "react";
import classNames from "classnames";

interface StreamThingButtonProps {
  innerText: string | undefined;
  children?: ReactNode; // This is intended for icons from hero icons
  clickFn?(): void;
  buttonType?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  animateOnHover?: boolean;
}

export const StreamThingButton = ({
  innerText,
  clickFn,
  children,
  buttonType = undefined,
  disabled = false,
  fullWidth = false,
  fullHeight = false,
  animateOnHover = false,
}: StreamThingButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={clickFn}
      type={buttonType}
      className={classNames(
        "inline-flex h-1/2 justify-center items-center rounded-md bg-black bg-opacity-20 px-4 text-sm font-medium text-white transition-all hover:bg-opacity-30 duration-250",
        {
          "w-fit": !fullWidth,
          "w-full": fullWidth,
          "py-2": fullHeight,
          "py-1": !fullHeight,
          "disabled:bg-opacity-10 disabled:text-gray-800 disabled:hover:scale-100 hover:scale-105 active:scale-100":
            animateOnHover,
        }
      )}
    >
      {innerText}
      {children}
    </button>
  );
};

import { ReactNode } from "react";
import classNames from "classnames";

interface StreamThingButtonProps {
  innerText: string | undefined;
  children?: ReactNode; // This is intended for icons from hero icons
  clickFn?(e?: any): void;
  buttonType?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  animateOnHover?: boolean;
  roundedFull?: boolean;
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
  roundedFull = false,
}: StreamThingButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={clickFn}
      type={buttonType}
      className={classNames(
        "inline-flex h-1/2 justify-center items-center bg-black bg-opacity-20 px-4 text-sm font-medium text-white transition-all hover:bg-opacity-30 duration-300 hover:shadow-lg hover:shadow-[#9A97D8]/[0.3]",
        {
          "w-fit": !fullWidth,
          "w-full": fullWidth,
          "py-2": fullHeight,
          "py-1": !fullHeight,
          "rounded-md": !roundedFull,
          "rounded-full": roundedFull,
        }
      )}
    >
      {innerText}
      {children}
    </button>
  );
};

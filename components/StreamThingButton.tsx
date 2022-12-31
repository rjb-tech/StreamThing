import { ReactNode } from "react";
import classNames from "classnames";

interface StreamThingButtonProps {
  innerText: string | undefined;
  children?: ReactNode; // This is intended for icons from hero icons
  clickFn?(): void;
  buttonType?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
}

export const StreamThingButton = ({
  innerText,
  clickFn,
  children,
  buttonType = undefined,
  disabled = false,
}: StreamThingButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={clickFn}
      type={buttonType}
      className={classNames(
        "inline-flex w-fit h-1/2 justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white transition-all duration-250",
        {
          "hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75":
            !disabled,
          "bg-opacity-10 text-gray-800": disabled,
        }
      )}
    >
      {innerText}
      {children}
    </button>
  );
};

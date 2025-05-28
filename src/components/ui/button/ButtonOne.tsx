import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  customActive?: boolean;
  activeValue?: boolean;
}

export const ButtonOne = ({
  children,
  customActive = false,
  activeValue,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={`${props.className} ${
        !customActive
          ? "focus:bg-[#056d66] bg-[#0aa096]"
          : activeValue
          ? "bg-[#056d66]"
          : "bg-[#0aa096]"
      } rounded-sm px-5 py-2 w-full cursor-pointer text-white`}
    >
      {children}
    </button>
  );
};

import { useGame } from "@/context/GameContext";
import { GameFiltersEnum, GameKanaTypeEnum, GameTypeEnum } from "@/interfaces";
import { ReactNode } from "react";
import { ButtonOne } from "./ButtonOne";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  value?: GameTypeEnum | GameKanaTypeEnum;
  mode: GameFiltersEnum;
}

export const ButtonMenu = ({
  children,
  mode,
  title,
  value,
  onClick,
  ...props
}: ButtonProps) => {
  const { buttonClicked, updateButtonClicked } = useGame();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (mode === GameFiltersEnum.START_BUTTON) return;

    updateButtonClicked({ mode, value: title!, selectModeValue: value! });
  };

  const coincidence =
    buttonClicked?.type === title || buttonClicked?.kanaType == title;

  return (
    <ButtonOne
      {...props}
      onClick={handleClick}
      customActive={mode !== GameFiltersEnum.START_BUTTON}
      activeValue={coincidence}
    >
      {children}
    </ButtonOne>
  );
};

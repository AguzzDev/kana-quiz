import { useGame } from "@/context/GameContext";
import {
  GameFiltersEnum,
  GameKanaTypeEnum,
  GameModeEnum,
  GameTypeEnum,
} from "@/interfaces";
import { ButtonOne } from "./ButtonOne";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: GameTypeEnum | GameKanaTypeEnum | GameModeEnum;
  mode: GameFiltersEnum;
}

export const ButtonMenu = ({
  children,
  mode,
  value,
  onClick,
  ...props
}: ButtonProps) => {
  const { selectMode, updateSelectMode } = useGame();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (mode === GameFiltersEnum.START_BUTTON) return;
    updateSelectMode({ mode, value: value!, selectModeValue: value! });
  };

  const coincidence =
    selectMode?.mode === value ||
    selectMode?.type === value ||
    selectMode?.kanaType == value;

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

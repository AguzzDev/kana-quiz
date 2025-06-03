"use client";
import { useGame } from "@/context/GameContext";
import {
  GameFiltersEnum,
  GameKanaTypeEnum,
  GameModeEnum,
  GameTypeEnum,
} from "@/interfaces";
import { sleep } from "@/utils/sleep";
import { useState } from "react";
import { ButtonMenu } from "../ui/button/ButtonMenu";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  mode: GameFiltersEnum;
  title: string;
  value: GameTypeEnum | GameKanaTypeEnum | GameModeEnum;
}

export const Default = () => {
  const [err, setErr] = useState<string | null>(null);

  const { startGame, selectMode } = useGame();

  const newError = async (title: string) => {
    setErr(title);
    await sleep(5000);
    setErr(null);
    return;
  };

  const handleClick = async () => {
    if (!selectMode?.type && !selectMode?.kanaType) {
      return newError("Select syllabary and group");
    } else if (!selectMode?.kanaType) {
      return newError("Select a group");
    } else if (!selectMode?.type) {
      return newError("Select a syllabary");
    }

    startGame(selectMode);
  };

  const Button = ({ mode, title, value, ...props }: ButtonProps) => (
    <ButtonMenu mode={mode} value={value} {...props}>
      {title}
    </ButtonMenu>
  );

  return (
    <>
      <div
        data-id="default-view"
        className="flex flex-1 flex-col justify-center space-y-3"
      >
        <h4>Game Modes</h4>
        <div className="grid grid-cols-3 gap-x-2 sm:gap-x-5 space-y-3">
          <Button
            mode={GameFiltersEnum.MODE}
            title={GameModeEnum.CLASSIC}
            value={GameModeEnum.CLASSIC}
            data-id="button-mode-1"
          />
          <Button
            mode={GameFiltersEnum.MODE}
            title={GameModeEnum.NO_ERRORS}
            value={GameModeEnum.NO_ERRORS}
            data-id="button-mode-2"
          />
          <Button
            mode={GameFiltersEnum.MODE}
            title={GameModeEnum.TIMED}
            value={GameModeEnum.TIMED}
            data-id="button-mode-3"
          />
          <Button
            className="col-span-3"
            mode={GameFiltersEnum.MODE}
            title={GameModeEnum.NO_ERRORS_AND_TIMED}
            value={GameModeEnum.NO_ERRORS_AND_TIMED}
            data-id="button-mode-4"
          />
        </div>

        <h4>Which syllabary do you want to practice?</h4>
        <div className="flex-col space-y-3 sm:grid grid-cols-2 gap-x-10 text-center">
          <Button
            mode={GameFiltersEnum.TYPE}
            title="Practice Hiragana"
            value={GameTypeEnum.HIRAGANA}
            data-id="button-type-1"
          />
          <Button
            mode={GameFiltersEnum.TYPE}
            title="Practice Katakana"
            value={GameTypeEnum.KATAKANA}
            data-id="button-type-2"
          />

          <div className="col-span-2">
            <Button
              mode={GameFiltersEnum.TYPE}
              title="Practice All"
              value={GameTypeEnum.ALL}
              data-id="button-type-3"
            />
          </div>
        </div>

        <h4>Which group do you want to practice?</h4>
        <div className="flex-col space-y-3 sm:grid grid-cols-3 gap-x-10 text-center">
          <Button
            mode={GameFiltersEnum.KANATYPE}
            title="All Main Kana"
            value={GameKanaTypeEnum.MAIN}
            data-id="button-kanaType-1"
          />
          <Button
            mode={GameFiltersEnum.KANATYPE}
            title="All Dakuten Kana"
            value={GameKanaTypeEnum.DAKUTEN}
            data-id="button-kanaType-2"
          />
          <Button
            mode={GameFiltersEnum.KANATYPE}
            title="All Combination Kana"
            value={GameKanaTypeEnum.YOUON}
            data-id="button-kanaType-3"
          />

          <div className="col-span-3">
            <Button
              mode={GameFiltersEnum.KANATYPE}
              title="All Kana"
              value={GameKanaTypeEnum.ALL}
              data-id="button-kanaType-4"
            />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          {err && (
            <p data-id="error" className="text-sm text-red-800 pt-2">
              {err}
            </p>
          )}

          <div className="flex-1 flex flex-col justify-end">
            <ButtonMenu
              className="py-4"
              mode={GameFiltersEnum.START_BUTTON}
              onClick={handleClick}
              data-id="button-start"
            >
              Start Quiz
            </ButtonMenu>
          </div>
        </div>
      </div>
    </>
  );
};

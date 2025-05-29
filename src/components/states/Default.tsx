"use client";
import { useGame } from "@/context/GameContext";
import { GameFiltersEnum, GameKanaTypeEnum, GameTypeEnum } from "@/interfaces";
import { sleep } from "@/utils/sleep";
import { useState } from "react";
import { ButtonMenu } from "../ui/button/ButtonMenu";

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
    if (!selectMode) {
      return newError("Select syllabary and group");
    } else if (!selectMode?.kanaType) {
      return newError("Select a group");
    } else if (!selectMode?.type) {
      return newError("Select a syllabary");
    }

    startGame(selectMode!);
  };

  const Button = ({
    mode,
    title,
    value,
  }: {
    mode: GameFiltersEnum;
    title: string;
    value: GameTypeEnum | GameKanaTypeEnum;
  }) => (
    <ButtonMenu mode={mode} title={title} value={value}>
      {title}
    </ButtonMenu>
  );

  return (
    <>
      <div className="flex flex-1 flex-col justify-center space-y-5">
        <h3>Which syllabary do you want to practice?</h3>
        <div className="flex-col space-y-5 sm:grid grid-cols-2 gap-x-10 text-center">
          <Button
            mode={GameFiltersEnum.TYPE}
            title="Practice Hiragana"
            value={GameTypeEnum.HIRAGANA}
          />
          <Button
            mode={GameFiltersEnum.TYPE}
            title="Practice Katakana"
            value={GameTypeEnum.KATAKANA}
          />

          <div className="col-span-2">
            <Button
              mode={GameFiltersEnum.TYPE}
              title="Practice All"
              value={GameTypeEnum.ALL}
            />
          </div>
        </div>

        <h3>Which group do you want to practice?</h3>
        <div className="flex-col space-y-5 sm:grid grid-cols-3 gap-x-10 text-center">
          <Button
            mode={GameFiltersEnum.KANATYPE}
            title="All Main Kana"
            value={GameKanaTypeEnum.MAIN}
          />
          <Button
            mode={GameFiltersEnum.KANATYPE}
            title="All Dakuten Kana"
            value={GameKanaTypeEnum.DAKUTEN}
          />
          <Button
            mode={GameFiltersEnum.KANATYPE}
            title="All Combination Kana"
            value={GameKanaTypeEnum.YOUON}
          />

          <div className="col-span-3">
            <Button
              mode={GameFiltersEnum.KANATYPE}
              title="All Kana"
              value={GameKanaTypeEnum.ALL}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        {err && <p className="text-sm text-red-800 pt-2">{err}</p>}

        <div className="flex-1 flex flex-col justify-end">
          <ButtonMenu
            className="py-4"
            mode={GameFiltersEnum.START_BUTTON}
            onClick={handleClick}
          >
            Start Quiz
          </ButtonMenu>
        </div>
      </div>
    </>
  );
};

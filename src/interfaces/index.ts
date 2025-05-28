import { GameRepository } from "@/services/GameService";
import { NextPage } from "next";
import { Dispatch, SetStateAction } from "react";

export interface QuizInterface {
  romaji: string;
  kana: string;
}
export type AnswerType = Map<number, boolean>;
export type InputsType = { el: HTMLInputElement | null; status: boolean }[];
export interface GameContextInterface {
  state: GameStatesEnum;
  game: GameRepository | null;
  answers: AnswerType;
  inputs: InputsType;
  selectMode: StartGameProps | null;
  buttonClicked: ButtonClickedInterface | null;
  updateCurrent: (i: number) => void;
  updateInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateButtonClicked: (args: UpdateButtonClickedProps) => void;
  handleSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  startGame: (args?: StartGameProps) => void;
  goHome: () => void;
  endGame: () => void;
}
export type ButtonClickedInterface = {
  [key: string]: string;
};

export type PageStatesProps = NextPage<{
  updateState: Dispatch<SetStateAction<GameStatesEnum>>;
}>;
export interface StartGameProps {
  type?: GameTypeEnum;
  kanaType?: GameKanaTypeEnum;
}
export type UpdateButtonClickedProps = {
  mode: GameFiltersEnum;
  value: string;
  selectModeValue: GameTypeEnum | GameKanaTypeEnum;
};

export enum GameStatesEnum {
  DEFAULT = "DEFAULT",
  GAME = "GAME",
  RESULTS = "RESULTS",
}
export enum GameTypeEnum {
  ALL = "ALL",
  KATAKANA = "KATAKANA",
  HIRAGANA = "HIRAGANA",
}
export enum GameKanaTypeEnum {
  ALL = "ALL",
  MAIN = "MAIN",
  DAKUTEN = "DAKUTEN",
  YOUON = "YOUON",
}
export enum GameSumTypeEnum {
  VALID = "VALID",
  ERROR = "ERROR",
}
export enum GameFiltersEnum {
  TYPE = "type",
  KANATYPE = "kanaType",
  START_BUTTON = "startButton",
}

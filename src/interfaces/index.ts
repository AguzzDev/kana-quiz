import { GameRepository } from "@/services/game/GameService";
import { TimerRepository } from "@/services/timer/TimerService";
import { NextPage } from "next";
import { Dispatch, SetStateAction } from "react";

declare global {
  interface Window {
    CYPRESS_TEST?: boolean;
    game: GameRepository
  }
}

export interface QuizInterface {
  romaji: string;
  kana: string;
}
export interface ErrorListInterface extends QuizInterface {
  you: string;
}
export type AnswerType = Map<number, boolean>;
export type InputsType = { el: HTMLInputElement | null; status: boolean }[];
export interface GameContextInterface {
  state: GameStatesEnum;
  game: GameRepository | null;
  answers: AnswerType;
  inputs: InputsType;
  selectMode: SelectModeInterface;
  updateCurrent: (i: number) => void;
  updateInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateSelectMode: (args: UpdateSelectModeProps) => void;
  handleSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  startGame: (args?: SelectModeInterface) => void;
  goHome: () => void;
  endGame: () => void;
}
export interface GameRepositoryInterface {
  quiz: QuizInterface[];
  errorsList: ErrorListInterface[];
  current: number;
  errors: number;
  valids: number;
  answers: Map<number, boolean>;
  options: {
    mode: GameModeEnum;
    type: GameTypeEnum;
    kanaType: GameKanaTypeEnum;
  };
  inputs: { el: HTMLInputElement | null; status: boolean }[];
  timer: TimerRepository;
  onEndGameEvent?: () => void;
}
export type SelectModeInterface = {
  mode: GameModeEnum | null;
  type: GameTypeEnum | null;
  kanaType: GameKanaTypeEnum | null;
};

export type PageStatesProps = NextPage<{
  updateState: Dispatch<SetStateAction<GameStatesEnum>>;
}>;
export interface StartGameProps {
  mode?: GameModeEnum;
  type?: GameTypeEnum;
  kanaType?: GameKanaTypeEnum;
}
export type UpdateSelectModeProps = {
  mode: GameFiltersEnum;
  value: string;
  selectModeValue: GameTypeEnum | GameKanaTypeEnum | GameModeEnum;
};

export enum GameStatesEnum {
  DEFAULT = "DEFAULT",
  GAME = "GAME",
  RESULTS = "RESULTS",
}
export enum GameModeEnum {
  CLASSIC = "Classic",
  NO_ERRORS = "No errors",
  TIMED = "With time (5min)",
}
export enum GameTypeEnum {
  ALL = "All syllabaries",
  KATAKANA = "Katakana",
  HIRAGANA = "Hiragana",
}
export enum GameKanaTypeEnum {
  ALL = "All groups",
  MAIN = "Main",
  DAKUTEN = "Dakuten",
  YOUON = "Combinations",
}
export enum GameSumTypeEnum {
  VALID = "VALID",
  ERROR = "ERROR",
}
export enum GameFiltersEnum {
  MODE = "mode",
  TYPE = "type",
  KANATYPE = "kanaType",
  START_BUTTON = "startButton",
}

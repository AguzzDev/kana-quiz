"use client";
import {
  GameStatesEnum,
  GameSumTypeEnum,
  GameContextInterface,
  StartGameProps,
  UpdateButtonClickedProps,
  GameFiltersEnum,
  GameTypeEnum,
  GameKanaTypeEnum,
} from "@/interfaces";
import { GameRepository } from "@/services/GameService";
import { createContext, useContext, useRef, useState } from "react";

export const GameContext = createContext<GameContextInterface | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [buttonClicked, setButtonClicked] =
    useState<GameContextInterface["buttonClicked"]>(null);
  const [input, setInput] = useState<string>("");
  const [game, setGame] = useState<GameContextInterface["game"]>(null);
  const [state, setState] = useState<GameContextInterface["state"]>(
    GameStatesEnum.DEFAULT
  );
  const [selectMode, setSelectMode] =
    useState<GameContextInterface["selectMode"]>(null);
  const [, forceRender] = useState(0);
  const inputsRef = useRef<GameContextInterface["inputs"]>([]);
  const answersRef = useRef<GameContextInterface["answers"]>(new Map());

  const forceReRender = () => {
    forceRender((x) => x + 1);
  };

  const goHome = () => {
    setState(GameStatesEnum.DEFAULT);
    setButtonClicked(null);
    setSelectMode(null);
  };

  const updateButtonClicked = ({
    mode,
    value,
    selectModeValue,
  }: UpdateButtonClickedProps) => {
    setButtonClicked((prev) => ({ ...prev, [mode]: value }));
    if (!selectModeValue) return;

    setSelectMode((prev) => {
      if (mode === GameFiltersEnum.TYPE) {
        return {
          ...prev,
          type: selectModeValue as GameTypeEnum,
        };
      } else {
        return {
          ...prev,
          kanaType: selectModeValue as GameKanaTypeEnum,
        };
      }
    });
  };

  const startGame = (args?: StartGameProps) => {
    const typeValues = args?.type ?? selectMode!.type!;
    const kanaTypeValues = args?.kanaType ?? selectMode!.kanaType!;

    const game = new GameRepository(typeValues, kanaTypeValues);
    setGame(game);

    inputsRef.current = game.inputs;
    answersRef.current = game.answers;

    setState(GameStatesEnum.GAME);
  };

  const endGame = async () => {
    setState(GameStatesEnum.RESULTS);
    game!.endGame();
  };

  const move = () => {
    if (!game) return;

    const checkFinish = game.checkFinish();
    if (checkFinish) return endGame();

    const to = game.current + 1;
    const lastElement = to === game.quiz.length;
    const inputStatus = game.checkIfNextElementIsValid();

    if (inputStatus || lastElement) {
      const findFirstNotCompleted = game.findFirstInputError();
      game.updateCurrent(findFirstNotCompleted);
      inputsRef.current[findFirstNotCompleted].el?.focus();
      return;
    }

    game.updateCurrent(to);
    inputsRef.current[to].el!.focus();
  };

  const submitAnswer = () => {
    if (!game) return;
    const answer = game.checkAnswer(input);
    game.updateInputs(answer);
    game.updateAnswers(answer);

    if (!answer) {
      game.updateValidsOrErrors(GameSumTypeEnum.ERROR);
    } else {
      game.updateValidsOrErrors(GameSumTypeEnum.VALID);
    }
  };

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !game) return;
    e.preventDefault();
    const isValid = game.isThisElementValid();
    if (isValid) return move();

    submitAnswer();
    clearInput();
    move();
    forceReRender();
  };

  const updateCurrent = (i: number) => {
    game!.updateCurrent(i);
    forceReRender();
    clearInput();
  };

  const updateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const clearInput = () => {
    setInput("");
  };

  return (
    <GameContext.Provider
      value={{
        state,
        game,
        inputs: inputsRef.current,
        answers: answersRef.current,
        selectMode,
        buttonClicked,
        updateCurrent,
        updateInput,
        updateButtonClicked,
        handleSubmit,
        startGame,
        endGame,
        goHome,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);

  if (!context)
    throw new Error("useGameContext must be used within GameProvider");
  return context;
};

"use client";
import {
  GameStatesEnum,
  GameContextInterface,
  GameModeEnum,
  GameTypeEnum,
  GameKanaTypeEnum,
  UpdateSelectModeProps,
  SelectModeInterface,
} from "@/interfaces";
import { GameModeFactory } from "@/services/game/GameService";
import { createContext, useContext, useEffect, useRef, useState } from "react";

export const GameContext = createContext<GameContextInterface | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [input, setInput] = useState<string>("");
  const [game, setGame] = useState<GameContextInterface["game"]>(null);
  const [state, setState] = useState<GameContextInterface["state"]>(
    GameStatesEnum.DEFAULT
  );
  const [selectMode, setSelectMode] = useState<
    GameContextInterface["selectMode"]
  >({ mode: GameModeEnum.CLASSIC, type: null, kanaType: null });
  const inputsRef = useRef<GameContextInterface["inputs"]>([]);
  const answersRef = useRef<GameContextInterface["answers"]>(new Map());

  const goHome = () => {
    setState(GameStatesEnum.DEFAULT);
    setSelectMode({ mode: GameModeEnum.CLASSIC, type: null, kanaType: null });
  };

  const updateSelectMode = ({
    mode,
    value,
    selectModeValue,
  }: UpdateSelectModeProps) => {
    setSelectMode((prev) => ({ ...prev, [mode]: value }));
    if (!selectModeValue) return;
  };

  const startGame = (args?: SelectModeInterface) => {
    const modeValues = args?.mode ?? selectMode!.mode;
    const typeValues = args?.type ?? selectMode!.type!;
    const kanaTypeValues = args?.kanaType ?? selectMode!.kanaType!;

    const game = GameModeFactory.create(
      modeValues as GameModeEnum,
      typeValues as GameTypeEnum,
      kanaTypeValues as GameKanaTypeEnum
    );
    setGame(game);

    inputsRef.current = game.inputs;
    answersRef.current = game.answers;

    setState(GameStatesEnum.GAME);
  };

  const endGame = async (auto = false) => {
    if (!auto) game!.endGame();

    setState(GameStatesEnum.RESULTS);
  };

  const move = () => {
    if (!game) return;
    const moveTo = game!.move();
    if (moveTo === undefined) return;
    inputsRef.current[moveTo].el!.focus();
  };

  const submitAnswer = () => {
    if (!game) return;
    game.checkAnswer(input);
  };

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !game || input.length === 0) return;
    e.preventDefault();
    const isValid = game.isThisElementValid();
    if (isValid) return move();

    clearInput();
    submitAnswer();
    move();
  };

  const updateCurrent = (i: number) => {
    clearInput();
    game!.updateCurrent(i);
  };

  const updateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const clearInput = () => {
    inputsRef.current[game!.current].el!.value = "";
    setInput("");
  };

  useEffect(() => {
    if (!game) return;

    game.onEndGameEvent = () => {
      endGame(true);
    };
  }, [game]);

  return (
    <GameContext.Provider
      value={{
        state,
        game,
        inputs: inputsRef.current,
        answers: answersRef.current,
        selectMode,
        updateCurrent,
        updateInput,
        updateSelectMode,
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

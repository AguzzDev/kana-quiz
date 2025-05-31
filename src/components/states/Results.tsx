"use client";

import { useGame } from "@/context/GameContext";
import { ButtonOne } from "../ui/button/ButtonOne";
import { getPercentage } from "@/utils/getPercentage";
import { ErrorListInterface } from "@/interfaces";

export const Results = () => {
  const { game, startGame, goHome } = useGame();

  return (
    <>
      <h2>Results</h2>

      <div>
        <p data-id="game-mode">
          Game mode: {game?.options.mode} & {game?.options.type} &{" "}
          {game?.options.kanaType}
        </p>
        <p data-id="overall-correct">
          Overall Correct: {game!.valids}/{game!.quiz.length}{" "}
          {getPercentage(game!.valids, game!.quiz.length)}
        </p>
        <p data-id="time">Time: {game!.timer.time}</p>
        <p data-id="errors">Errors: {game!.errors}</p>

        <div className="flex items-center space-x-10 mt-2">
          {game!.errorsList!.map((d: ErrorListInterface, i: number) => (
            <div key={i} className="text-center">
              <h3>{d.kana}</h3>
              <h3>{d.romaji}</h3>
              <p>You: {d.you}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-end flex-1 space-y-3">
        <ButtonOne data-id="button-play-again" onClick={() => startGame()}>
          Play again
        </ButtonOne>
        <ButtonOne data-id="button-go-home" onClick={goHome}>
          Back to home
        </ButtonOne>
      </div>
    </>
  );
};

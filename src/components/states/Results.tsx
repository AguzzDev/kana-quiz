"use client";

import { useGame } from "@/context/GameContext";
import { ButtonOne } from "../ui/button/ButtonOne";
import { getPercentage } from "@/utils/getPercentage";

export const Results = () => {
  const { game, startGame, goHome } = useGame();

  return (
    <>
      <h2>Results</h2>

      <div>
        <p>
          Overall Correct: {game!.valids}/{game!.quiz.length}{" "}
          {getPercentage(game!.valids, game!.quiz.length)}
        </p>
        <p>Time: {game!.timer}</p>
        <p>Errors: {game!.errors}</p>
      </div>

      <div className="flex flex-col justify-end flex-1 space-y-3">
        <ButtonOne onClick={() => startGame()}>Play again</ButtonOne>
        <ButtonOne onClick={goHome}>Back to home</ButtonOne>
      </div>
    </>
  );
};

"use client";

import { useGame } from "@/context/GameContext";
import { ButtonOne } from "../ui/button/ButtonOne";
import { QuizInterface } from "@/interfaces";

export const Game = () => {
  const {
    game,
    answers,
    inputs,
    handleSubmit,
    updateCurrent,
    updateInput,
    endGame,
  } = useGame();

  const quiz = game!.getQuiz();
  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-6">
        {quiz.map((d: QuizInterface, i: number) => (
          <div
            key={i}
            className={`${
              answers.get(i) === true
                ? "bg-[#056d66]/50"
                : answers?.get(i) === false
                ? "bg-red-400/50"
                : ""
            } overflow-hidden rounded-lg text-center`}
          >
            <p className="py-2 text-2xl">{d.kana}</p>

            {answers.get(i) ? (
              <p className="h-10"></p>
            ) : (
              <input
                ref={(el) => {
                  const prev = inputs[i];
                  inputs[i] = {
                    el,
                    status: prev?.status ?? false,
                  };
                }}
                autoFocus={game!.current === i}
                type="text"
                className="p-2"
                onChange={(e) => updateInput(e)}
                onClick={() => {
                  updateCurrent(i);
                }}
                onKeyDown={(e) => handleSubmit(e)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="w-full sm:w-2/4 mx-auto my-4">
        <ButtonOne onClick={() => endGame()}>Finish Quiz</ButtonOne>
      </div>
    </>
  );
};

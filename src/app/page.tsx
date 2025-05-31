"use client";

import { Default } from "@/components/states/Default";
import { Game } from "@/components/states/Game";
import { Results } from "@/components/states/Results";
import { useGame } from "@/context/GameContext";
import { GameStatesEnum } from "@/interfaces";
import { useEffect, useState } from "react";

export default function Home() {
  const { state, game } = useGame();
  const [timer, setTimer] = useState("00:00");

  let body;

  if (state === GameStatesEnum.DEFAULT) {
    body = <Default />;
  } else if (state === GameStatesEnum.GAME) {
    body = <Game />;
  } else if (state === GameStatesEnum.RESULTS) {
    body = <Results />;
  }

  useEffect(() => {
    if (!game) return;

    game.timer.onGetTimerEvent = () => {
      setTimer(game.timer.time);
    };

    return () => {
      setTimer("00:00");
    };
  }, [game]);

  return (
    <section className="flex flex-col h-full">
      <h1>Kana Quiz</h1>
      {state == GameStatesEnum.GAME && game?.options && (
        <div className="flex items-center justify-between">
          <h4 data-id="game-mode" className="text-center py-2">
            {game?.options.mode} & {game?.options.type} &{" "}
            {game?.options.kanaType}
          </h4>

          <h4>{timer}</h4>
        </div>
      )}

      <div className="flex flex-col flex-1 mt-2 pr-2 overflow-y-auto overflow-x-hidden">
        {body}
      </div>
    </section>
  );
}

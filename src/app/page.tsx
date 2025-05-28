"use client";

import { Default } from "@/components/states/Default";
import { Game } from "@/components/states/Game";
import { Results } from "@/components/states/Results";
import { useGame } from "@/context/GameContext";
import { GameStatesEnum } from "@/interfaces";

export default function Home() {
  const { state } = useGame();

  let body;

  if (state === GameStatesEnum.DEFAULT) {
    body = <Default />;
  } else if (state === GameStatesEnum.GAME) {
    body = <Game />;
  } else if (state === GameStatesEnum.RESULTS) {
    body = <Results />;
  }

  return (
    <section className="flex flex-col h-full">
      <h1>Kana Quiz</h1>

      <div className="flex flex-col flex-1 mt-2 pr-2 overflow-y-auto">
        {body}
      </div>
    </section>
  );
}

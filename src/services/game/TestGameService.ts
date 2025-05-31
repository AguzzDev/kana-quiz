import { GameModeEnum, GameTypeEnum, GameKanaTypeEnum } from "@/interfaces";
import { GameRepository } from "./GameService";

export class TestGameModeFactory {
  static create(
    mode: GameModeEnum,
    type: GameTypeEnum,
    kanaType: GameKanaTypeEnum
  ): TestGameRepository {
    switch (mode) {
      case GameModeEnum.NO_ERRORS:
        return new TestNoErrorsModeRepository(mode, type, kanaType);
      case GameModeEnum.TIMED:
        return new TestTimedModeRepository(mode, type, kanaType);
      default:
        return new TestGameRepository(mode, type, kanaType);
    }
  }
}

export class TestGameRepository extends GameRepository {
  constructor(
    mode: GameModeEnum,
    type: GameTypeEnum,
    kanaType: GameKanaTypeEnum
  ) {
    super(mode, type, kanaType, true);
  }
}

class TestNoErrorsModeRepository extends TestGameRepository {
  override checkAnswer(input: string): boolean {
    const correct = super.checkAnswer(input);
    if (!correct) {
      this.endGame();
    }
    return correct;
  }
}

class TestTimedModeRepository extends TestGameRepository {
  private timerId?: number;

  constructor(
    mode: GameModeEnum,
    type: GameTypeEnum,
    kanaType: GameKanaTypeEnum
  ) {
    super(mode, type, kanaType);

    this.timerId = window.setTimeout(() => {
      this.endGame();
    }, 30000);
  }

  override endGame() {
    super.endGame();

    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = undefined;
    }
  }
}

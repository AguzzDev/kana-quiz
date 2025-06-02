import { GameModeEnum, GameTypeEnum, GameKanaTypeEnum } from "@/interfaces";
import { GameRepository } from "./GameService";

export class TestGameModeFactory {
  static create(
    mode: GameModeEnum,
    type: GameTypeEnum,
    kanaType: GameKanaTypeEnum
  ): GameRepository {
    switch (mode) {
      case GameModeEnum.NO_ERRORS:
        return new NoErrorsModeRepository(mode, type, kanaType);
      case GameModeEnum.TIMED:
        return new TimedModeRepository(mode, type, kanaType);
      case GameModeEnum.NO_ERRORS_AND_TIMED:
        return new NoErrorsWithTimedModeRepository(mode, type, kanaType);
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

class NoErrorsModeRepository extends TestGameRepository {
  override checkAnswer(input: string): boolean {
    const correct = super.checkAnswer(input);
    if (!correct) {
      this.endGame();
    }
    return correct;
  }
}

class TimedModeRepository extends TestGameRepository {
  private timerId?: number;

  constructor(
    mode: GameModeEnum,
    type: GameTypeEnum,
    kanaType: GameKanaTypeEnum
  ) {
    super(mode, type, kanaType);

    this.timerId = window.setTimeout(() => {
      this.endGame();
    }, 10000);
  }

  override endGame() {
    super.endGame();

    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = undefined;
    }
  }
}

class NoErrorsWithTimedModeRepository extends TestGameRepository {
  private timerId?: number;

  constructor(
    mode: GameModeEnum,
    type: GameTypeEnum,
    kanaType: GameKanaTypeEnum
  ) {
    super(mode, type, kanaType);

    this.timerId = window.setTimeout(() => {
      this.endGame();
    }, 10000);
  }

  override checkAnswer(input: string): boolean {
    const correct = super.checkAnswer(input);
    if (!correct) {
      this.endGame();
    }
    return correct;
  }

  override endGame() {
    super.endGame();

    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = undefined;
    }
  }
}

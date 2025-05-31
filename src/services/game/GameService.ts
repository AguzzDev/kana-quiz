import {
  GameTypeEnum,
  GameSumTypeEnum,
  QuizInterface,
  GameKanaTypeEnum,
  GameModeEnum,
  GameRepositoryInterface,
  ErrorListInterface,
} from "@/interfaces";
import {
  hiraganaMainKanaData,
  hiraganaDakutenKanaData,
  hiraganaYouonKanaData,
  katakanaMainKanaData,
  katakanaDakutenKanaData,
  katakanaYouonKanaData,
  allHiraganaData,
  allKatakanaData,
  allKanasData,
} from "@/lib/data";
import { TimerRepository } from "../timer/TimerService";

class GameModeSylAndGroupFactory {
  static create(type: GameTypeEnum, kanaType: GameKanaTypeEnum) {
    switch (type) {
      case GameTypeEnum.HIRAGANA:
        if (kanaType === GameKanaTypeEnum.MAIN) {
          return hiraganaMainKanaData;
        } else if (kanaType === GameKanaTypeEnum.DAKUTEN) {
          return hiraganaDakutenKanaData;
        } else if (kanaType === GameKanaTypeEnum.YOUON) {
          return hiraganaYouonKanaData;
        } else {
          return allHiraganaData;
        }
      case GameTypeEnum.KATAKANA:
        if (kanaType === GameKanaTypeEnum.MAIN) {
          return katakanaMainKanaData;
        } else if (kanaType === GameKanaTypeEnum.DAKUTEN) {
          return katakanaDakutenKanaData;
        } else if (kanaType === GameKanaTypeEnum.YOUON) {
          return katakanaYouonKanaData;
        } else {
          return allKatakanaData;
        }
      case GameTypeEnum.ALL:
        if (kanaType === GameKanaTypeEnum.MAIN) {
          return [...hiraganaMainKanaData, ...katakanaMainKanaData];
        } else if (kanaType === GameKanaTypeEnum.DAKUTEN) {
          return [...hiraganaDakutenKanaData, ...katakanaDakutenKanaData];
        } else if (kanaType === GameKanaTypeEnum.YOUON) {
          return [...hiraganaYouonKanaData, ...katakanaYouonKanaData];
        } else {
          return allKanasData;
        }
      default:
        return [];
    }
  }
}

export class GameModeFactory {
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
      default:
        return new GameRepository(mode, type, kanaType);
    }
  }
}

export class GameRepository implements GameRepositoryInterface {
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

  constructor(
    mode: GameModeEnum,
    type: GameTypeEnum,
    kanaType: GameKanaTypeEnum,
    isTest: boolean = false
  ) {
    const raw = GameModeSylAndGroupFactory.create(type, kanaType);
    const timer = new TimerRepository();
    timer.start();

    this.errorsList = [];
    this.options = {
      mode,
      type,
      kanaType,
    };
    this.quiz = isTest ? raw : this.shuffle(raw);
    this.current = 0;
    this.errors = 0;
    this.valids = 0;
    this.answers = new Map<number, boolean>();
    this.inputs = [];
    this.timer = timer;
  }

  endGame() {
    this.timer.stop();
    this.timer.getTime();
    this.onEndGame();
  }

  private shuffle(array: QuizInterface[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  getQuiz() {
    return this.quiz;
  }

  checkAnswer(input: string) {
    const quiz = this.quiz[this.current];
    const response = quiz.romaji == input.toLowerCase();

    if (!response) {
      this.errorsList.push({ ...quiz, you: input.toLowerCase() });
    }
    this.updateInputs(response);
    this.updateAnswers(response);
    this.updateValidsOrErrors(
      response ? GameSumTypeEnum.VALID : GameSumTypeEnum.ERROR
    );

    return response;
  }

  updateCurrent(number: number) {
    this.current = number;
  }

  updateValidsOrErrors(type: GameSumTypeEnum) {
    if (type == GameSumTypeEnum.VALID) {
      this.valids++;
    } else {
      this.errors++;
    }
  }

  updateAnswers(answer: boolean) {
    this.answers.set(this.current, answer);
  }

  updateInputs(answer: boolean) {
    const input = this.inputs[this.current];
    const updated = {
      ...input,
      status: answer,
    };

    this.inputs[this.current] = updated;
  }

  checkIfNextElementIsValid() {
    const input = this.inputs[this.current + 1]?.status;
    return input == true;
  }

  checkFinish() {
    return this.inputs.every((v) => v.status === true);
  }

  findFirstInputError() {
    return this.inputs.findIndex((v) => v.status === false);
  }

  isThisElementValid() {
    return this.answers.get(this.current);
  }

  move() {
    const checkFinish = this.checkFinish();
    if (checkFinish) {
      this.endGame();
      return;
    }

    let to = this.current + 1;
    const lastElement = to === this.quiz.length;
    const inputStatus = this.checkIfNextElementIsValid();

    if (inputStatus || lastElement) {
      const findFirstNotCompleted = this.findFirstInputError();
      to = findFirstNotCompleted;
    }

    this.updateCurrent(to);
    return to;
  }

  protected onEndGame() {
    if (this.onEndGameEvent) {
      this.onEndGameEvent();
    }
  }
}

class NoErrorsModeRepository extends GameRepository {
  override checkAnswer(input: string): boolean {
    const correct = super.checkAnswer(input);
    if (!correct) {
      this.endGame();
    }
    return correct;
  }
}

class TimedModeRepository extends GameRepository {
  private timerId?: number;

  constructor(
    mode: GameModeEnum,
    type: GameTypeEnum,
    kanaType: GameKanaTypeEnum
  ) {
    super(mode, type, kanaType);

    this.timerId = window.setTimeout(() => {
      this.endGame();
    }, 5 * 60 * 1000);
  }

  override endGame() {
    super.endGame();

    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = undefined;
    }
  }
}

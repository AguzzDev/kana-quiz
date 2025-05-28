import {
  GameTypeEnum,
  GameSumTypeEnum,
  QuizInterface,
  GameKanaTypeEnum,
} from "@/interfaces";
import {
  hiraganaMainKanaData,
  hiraganaDakutenKanaData,
  hiraganaYouonKanaData,
  katakanaMainKanaData,
  katakanaDakutenKanaData,
  katakanaYouonKanaData,
} from "@/lib/data";

export class TimerRepository {
  time: number = 0;
  private intervalId: number | null = null;

  start() {
    if (this.intervalId !== null) return;
    this.intervalId = window.setInterval(() => {
      this.time++;
    }, 1000);
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getTime() {
    return this.time > 60
      ? `${(this.time / 60).toFixed(2)} minutes`
      : `${this.time} seconds`;
  }
}

class GameModeFactory {
  static create(type: GameTypeEnum, kanaType: GameKanaTypeEnum) {
    const allHiragana = [
      ...hiraganaMainKanaData,
      ...hiraganaDakutenKanaData,
      ...hiraganaYouonKanaData,
    ];
    const allKatakana = [
      ...katakanaMainKanaData,
      ...katakanaDakutenKanaData,
      ...katakanaYouonKanaData,
    ];

    switch (type) {
      case GameTypeEnum.HIRAGANA:
        if (kanaType === GameKanaTypeEnum.MAIN) {
          return hiraganaMainKanaData;
        } else if (kanaType === GameKanaTypeEnum.DAKUTEN) {
          return hiraganaDakutenKanaData;
        } else if (kanaType === GameKanaTypeEnum.YOUON) {
          return hiraganaYouonKanaData;
        } else {
          return allHiragana;
        }
      case GameTypeEnum.KATAKANA:
        if (kanaType === GameKanaTypeEnum.MAIN) {
          return katakanaMainKanaData;
        } else if (kanaType === GameKanaTypeEnum.DAKUTEN) {
          return katakanaDakutenKanaData;
        } else if (kanaType === GameKanaTypeEnum.YOUON) {
          return katakanaYouonKanaData;
        } else {
          return allKatakana;
        }
      case GameTypeEnum.ALL:
        if (kanaType === GameKanaTypeEnum.MAIN) {
          return [...hiraganaMainKanaData, ...katakanaMainKanaData];
        } else if (kanaType === GameKanaTypeEnum.DAKUTEN) {
          return [...hiraganaDakutenKanaData, ...katakanaDakutenKanaData];
        } else if (kanaType === GameKanaTypeEnum.YOUON) {
          return [...hiraganaYouonKanaData, ...katakanaYouonKanaData];
        } else {
          return [...allHiragana, ...allKatakana];
        }
      default:
        return [];
    }
  }
}

export class GameRepository {
  quiz: QuizInterface[];
  current: number;
  errors: number;
  valids: number;
  answers: Map<number, boolean>;
  inputs: { el: HTMLInputElement | null; status: boolean }[];
  private internalTimer: TimerRepository;
  timer: string;

  constructor(type: GameTypeEnum, kanaType: GameKanaTypeEnum) {
    const raw = GameModeFactory.create(type, kanaType);
    const timer = new TimerRepository();
    timer.start();

    this.quiz = this.shuffle(raw);
    this.current = 0;
    this.errors = 0;
    this.valids = 0;
    this.answers = new Map<number, boolean>();
    this.inputs = [];
    this.internalTimer = timer;
    this.timer = this.internalTimer.getTime();
  }

  endGame() {
    this.internalTimer.stop();
    this.timer = this.internalTimer.getTime();
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
    return quiz.romaji == input.toLowerCase();
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
}

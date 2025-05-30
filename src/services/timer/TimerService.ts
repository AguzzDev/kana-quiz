export class TimerRepository {
  internalTimer: number = 0;
  time: string = "";
  intervalId: number | null = null;
  onGetTimerEvent?: () => void;

  constructor() {
    this.onGetTimerEvent = () => {};
  }

  start() {
    if (this.intervalId !== null) return;
    this.intervalId = window.setInterval(() => {
      this.internalTimer++;
      this.onGetTimer();
    }, 1000);
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getTime() {
    const minutes = String(Math.floor(this.internalTimer / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(this.internalTimer % 60).padStart(2, "0");
    this.time = `${minutes}:${seconds}`;
  }

  protected onGetTimer() {
    if (this.onGetTimerEvent) {
      this.getTime();
      this.onGetTimerEvent();
    }
  }
}

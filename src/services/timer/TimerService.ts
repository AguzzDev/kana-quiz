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

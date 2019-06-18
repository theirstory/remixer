export class Clock {
  private _clockInterval: number;
  private _clockFrequency: number = 25;
  private _startTime: number;
  public currentTime: number = 0;
  private _tickCB: () => void;

  constructor(tickCB: () => void) {
    this._tickCB = tickCB;
  }

  public play(): void {
    this._startTime = Date.now() - this.currentTime * 1000;
    this._clockInterval = window.setInterval(() => {
      this.currentTime = (Date.now() - this._startTime) / 1000;
      this._tickCB();
    }, this._clockFrequency);
  }

  public pause(): void {
    window.clearInterval(this._clockInterval);
  }

  public stop(): void {
    this.currentTime = 0;
    window.clearInterval(this._clockInterval);
  }
}

export class PromoCodeAdvantageEntity {
  _percent: number;

  constructor(percent: number) {
    this._percent = percent;
  }

  get percent(): number {
    return this._percent;
  }
  set percent(percent: number) {
    this._percent = percent;
  }
}

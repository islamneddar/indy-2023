export class ComparisonRules {
  _lt?: number;
  _gt?: number;
  _eq?: number;

  constructor(lt?: number, gt?: number, eq?: number) {
    if (!lt && !gt && !eq) {
      throw new Error('ComparisonRules must have at least one rule');
    }
    this._lt = lt;
    this._gt = gt;
    this._eq = eq;
  }

  isValid(value: number): boolean {
    if (this._eq) {
      return value === this._eq;
    }

    let isValid = true;
    if (this._gt) {
      isValid = value > this._gt;
      if (!isValid) {
        return false;
      }
    }
    if (this._lt) {
      isValid = value < this._lt;
      if (!isValid) {
        return false;
      }
    }
    return isValid;
  }

  toString() {
    const lt = this._lt ? `lowerThan ${this._lt}` : '';
    const gt = this._gt ? `greaterThan ${this._gt}` : '';
    const eq = this._eq ? `equals to ${this._eq}` : '';
    return `${lt} / ${gt} / ${eq}`;
  }
}

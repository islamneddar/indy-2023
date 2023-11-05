import {PromoCodeDecisionTreeNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-decision-tree-node';
import {IsValidPromoCodeParams} from '@/domain/promo-code/promo-code.type';

export class DateRestrictionNode extends PromoCodeDecisionTreeNode {
  _after?: Date;
  _before?: Date;

  constructor(after: Date, before: Date) {
    super();
    this._type = '@date';
    this._after = after;
    this._before = before;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isValid(params: IsValidPromoCodeParams, reason: any[]): boolean {
    const now = new Date();

    const isValid =
      new Date(this._after) <= now && now <= new Date(this._before);
    if (!isValid) {
      reason.push(
        'Date is not valid for the date restriction : ' + this.toString(),
      );
    }
    return isValid;
  }

  toString() {
    return `${this._type} should be after : ${this._after} - before : ${this._before}`;
  }
}

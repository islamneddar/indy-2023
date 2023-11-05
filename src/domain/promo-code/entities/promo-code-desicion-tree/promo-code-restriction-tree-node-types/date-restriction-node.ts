import {PromoCodeRestrictionDecisionTreeNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-restriction-decision-tree-node';
import {IsValidPromoCodeParams} from '@/domain/promo-code/promo-code.type';

export class DateRestrictionNode extends PromoCodeRestrictionDecisionTreeNode {
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
    if (!params || !params.selectedDate) {
      throw new Error('Date is not defined');
    }

    const now = new Date(params.selectedDate);
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

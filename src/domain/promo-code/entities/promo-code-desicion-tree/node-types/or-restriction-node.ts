import {PromoCodeDecisionTreeNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-decision-tree-node';
import {IsValidPromoCodeParams} from '@/domain/promo-code/promo-code.type';

export class OrRestrictionNode extends PromoCodeDecisionTreeNode {
  constructor() {
    super();
    this._type = '@or';
  }

  isValid(params: IsValidPromoCodeParams, reasons: any[]): boolean {
    const children = this._children;
    if (this._children.length < 2) {
      throw new Error('OR node must have at least two child');
    }

    const reasonForOr = [];
    let isValid = children[0].isValid(params, reasonForOr);

    for (let i = 1; i < children.length; i++) {
      isValid = isValid || children[i].isValid(params, reasonForOr);
    }

    if (!isValid) {
      reasons.push({
        type: this._type,
        reason: reasonForOr,
      });
    }
    return isValid;
  }
}

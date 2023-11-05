import {PromoCodeRestrictionDecisionTreeNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-restriction-decision-tree-node';
import {IsValidPromoCodeParams} from '@/domain/promo-code/promo-code.type';

export class AndRestrictionNode extends PromoCodeRestrictionDecisionTreeNode {
  constructor() {
    super();
    this._type = '@and';
  }

  isValid(params: IsValidPromoCodeParams, reasons: any[]): boolean {
    const children = this._children;
    if (children.length < 2) {
      throw new Error('AND node must have at least two child');
    }

    const reasonForAnd = [];
    let isValid = children[0].isValid(params, reasonForAnd);

    for (let i = 1; i < children.length; i++) {
      isValid = isValid && children[i].isValid(params, reasonForAnd);
    }

    if (!isValid) {
      reasons.push({
        type: this._type,
        reason: reasonForAnd,
      });
    }

    return isValid;
  }
}

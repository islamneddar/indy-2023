import {PromoCodeDecisionTreeNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-decision-tree-node';
import {IsValidPromoCodeParams} from '@/domain/promo-code/promo-code.type';

export class AndRestrictionNode extends PromoCodeDecisionTreeNode {
  constructor() {
    super();
    this._type = '@and';
  }

  isValid(params: IsValidPromoCodeParams, reasons): boolean {
    if (this._children.length < 2) {
      throw new Error('AND node must have at least two child');
    }
    let isValid = this._children[0].isValid(params, reasons);
    for (let i = 1; i < this._children.length; i++) {
      isValid = isValid && this._children[i].isValid(params, reasons);
    }
    return isValid;
  }
}

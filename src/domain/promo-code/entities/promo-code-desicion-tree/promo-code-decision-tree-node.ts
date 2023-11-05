import {IsValidPromoCodeParams} from '@/domain/promo-code/promo-code.type';

export abstract class PromoCodeDecisionTreeNode {
  _type: string;
  _children: PromoCodeDecisionTreeNode[] = [];

  addChild(node: PromoCodeDecisionTreeNode) {
    this._children.push(node);
  }

  abstract isValid(params: IsValidPromoCodeParams, reasons: string[]): boolean;

  toString() {
    return JSON.stringify(this);
  }
}

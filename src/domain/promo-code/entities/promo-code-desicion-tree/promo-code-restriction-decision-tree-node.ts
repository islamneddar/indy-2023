import {IsValidPromoCodeParams} from '@/domain/promo-code/promo-code.type';

export abstract class PromoCodeRestrictionDecisionTreeNode {
  _type: string;
  _children: PromoCodeRestrictionDecisionTreeNode[] = [];

  addChild(node: PromoCodeRestrictionDecisionTreeNode) {
    this._children.push(node);
  }

  abstract isValid(params: IsValidPromoCodeParams, reasons: any[]): boolean;

  toString() {
    return JSON.stringify(this);
  }
}

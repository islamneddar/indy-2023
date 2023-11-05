import {PromoCodeDecisionTreeNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-decision-tree-node';

export class PromoCodeRestrictionDecisionTree {
  private _root: PromoCodeDecisionTreeNode;

  set root(root: PromoCodeDecisionTreeNode) {
    this._root = root;
  }

  get root(): PromoCodeDecisionTreeNode {
    return this._root;
  }

  toString() {
    return JSON.stringify(this._root);
  }
}

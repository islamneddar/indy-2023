import {PromoCodeDecisionTreeNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-decision-tree-node';
import {ComparisonRules} from '@/domain/promo-code/entities/comparison-rules';
import {IsValidPromoCodeParams} from '@/domain/promo-code/promo-code.type';

export class AgeRestrictionNode extends PromoCodeDecisionTreeNode {
  _age: ComparisonRules;
  constructor(age: ComparisonRules) {
    super();
    this._type = '@age';
    this._age = age;
  }

  isValid(params: IsValidPromoCodeParams, reason: string[]): boolean {
    if (!params || !params.age) {
      throw new Error('Age is not defined');
    }
    const age = params.age;

    const isValid = this._age.isValid(age);
    if (!isValid) {
      reason.push(
        `Age is not valid for the age restriction : ${this.toString()}`,
      );
    }
    return isValid;
  }

  toString() {
    return `${this._type} should be : ${this._age.toString()}`;
  }
}

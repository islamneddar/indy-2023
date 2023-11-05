import {PromoCodeRestrictionDecisionTreeNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-restriction-decision-tree-node';
import {ComparisonRules} from '@/domain/promo-code/entities/comparison-rules';
import {IsValidPromoCodeParams} from '@/domain/promo-code/promo-code.type';

export class MeteoRestrictionNode extends PromoCodeRestrictionDecisionTreeNode {
  _is: string;
  _temp: ComparisonRules;

  constructor(is: string, temp: ComparisonRules) {
    super();
    this._type = '@meteo';
    this._is = is;
    this._temp = temp;
  }

  isValid(params: IsValidPromoCodeParams, reason: any[]): boolean {
    if (!params || !params.meteoIs || !params.meteoTemp) {
      throw new Error('Meteo Data is not defined');
    }
    const meteoIs = params.meteoIs;
    const meteoTemp = params.meteoTemp;

    const isSameMainMeteo = this._is === meteoIs;
    if (!isSameMainMeteo) {
      reason.push(`Meteo should be ${this._is} but it's ${meteoIs}`);
    }

    const isValid = this._temp.isValid(meteoTemp);
    if (!isValid) {
      reason.push(
        `Temperature is not valid for the meteo restriction, it should be: ${this._temp.toString()}`,
      );
    }
    return isValid && isSameMainMeteo;
  }
}

import {PromoCodeAdvantageEntity} from '@/domain/promo-code/entities/promo-code-advantage.entity';
import {PromoCodeRestrictionDecisionTree} from '@/domain/promo-code/entities/promo-code-restriction-decision-tree';

export class PromoCodeEntity {
  private _id: string;
  private _name: string;
  private _advantage: PromoCodeAdvantageEntity;
  private _restrictionsTree: PromoCodeRestrictionDecisionTree;

  set id(id: string) {
    this._id = id;
  }

  get name(): string {
    return this._name;
  }
  set name(name: string) {
    this._name = name;
  }

  get advantage(): PromoCodeAdvantageEntity {
    return this._advantage;
  }
  set advantage(advantage: PromoCodeAdvantageEntity) {
    this._advantage = advantage;
  }

  get restrictions(): PromoCodeRestrictionDecisionTree {
    return this._restrictionsTree;
  }
  set restrictions(restrictions: PromoCodeRestrictionDecisionTree) {
    this._restrictionsTree = restrictions;
  }
}

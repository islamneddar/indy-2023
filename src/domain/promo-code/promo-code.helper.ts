import {Injectable} from '@nestjs/common';
import {PromoCodeRestrictionDecisionTree} from '@/domain/promo-code/entities/promo-code-restriction-decision-tree';
import {PromoCodeEntity} from '@/domain/promo-code/entities/promo-code.entity';
import {v4 as uuidv4} from 'uuid';
import {PromoCodeAdvantageEntity} from '@/domain/promo-code/entities/promo-code-advantage.entity';

@Injectable()
export class PromoCodeHelper {
  constructor() {}

  createPromoCode(
    promoCodeName: string,
    promoCodeAvantagePercent: number,
    promoCodeRestrictions: any[],
  ) {
    const promoCode = new PromoCodeEntity();
    promoCode.id = uuidv4();
    promoCode.name = promoCodeName;
    promoCode.advantage = new PromoCodeAdvantageEntity(
      promoCodeAvantagePercent,
    );
    const promoCodeDecisionTree = new PromoCodeRestrictionDecisionTree();
    promoCodeDecisionTree.build(promoCodeRestrictions);
    promoCode.restrictions = promoCodeDecisionTree;
    return promoCode;
  }
}

import {Injectable} from '@nestjs/common';
import {PromoCodeRestrictionDecisionTree} from '@/domain/promo-code/entities/promo-code-restriction-decision-tree';
import {AndRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/node-types/and-restriction-node';
import {PromoCodeDecisionTreeNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-decision-tree-node';
import {
  AgePromoCodeRestriction,
  DatePromoCodeRestriction,
  MeteorPromoCodeRestriction,
  PromoCodeRestriction,
} from '@/domain/promo-code/promo-code.type';
import {DateRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/node-types/date-restriction-node';
import {ComparisonRules} from '@/domain/promo-code/entities/comparison-rules';
import {MeteoRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/node-types/meteo-restriction-node';
import {AgeRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/node-types/age-restriction-node';
import {OrRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/node-types/or-restriction-node';

@Injectable()
export class PromoCodeHelper {
  constructor() {}

  buildDecisionTree(restrictions: any[]) {
    const promoCodeDecisionTree = new PromoCodeRestrictionDecisionTree();

    promoCodeDecisionTree.root = new AndRestrictionNode();

    this.recursiveBuildDecisionTree(promoCodeDecisionTree.root, restrictions);

    return promoCodeDecisionTree;
  }

  recursiveBuildDecisionTree(
    root: PromoCodeDecisionTreeNode,
    restrictions: any[],
  ) {
    console.log('recursiveBuildDecisionTree => ', root);
    restrictions.forEach(restriction => {
      const restrictionKey = Object.keys(restriction)[0];
      switch (restrictionKey) {
        case '@date':
          const dateRestrictionValue = restriction[
            restrictionKey
          ] as DatePromoCodeRestriction;
          const node = new DateRestrictionNode(
            dateRestrictionValue.after,
            dateRestrictionValue.before,
          );
          root.addChild(node);
          break;

        case '@meteo':
          const meteoRestrictionValue = restriction[
            restrictionKey
          ] as MeteorPromoCodeRestriction;

          const temp = new ComparisonRules(
            meteoRestrictionValue.temp.lt,
            meteoRestrictionValue.temp.gt,
            meteoRestrictionValue.temp.eq,
          );
          const meteoNode = new MeteoRestrictionNode(
            meteoRestrictionValue.is,
            temp,
          );
          root.addChild(meteoNode);
          break;

        case '@age':
          const ageRestrictionValue = restriction[
            restrictionKey
          ] as AgePromoCodeRestriction;

          const age = new ComparisonRules(
            ageRestrictionValue.lt,
            ageRestrictionValue.gt,
            ageRestrictionValue.eq,
          );
          const ageNode = new AgeRestrictionNode(age);
          root.addChild(ageNode);
          break;

        case '@or':
          const orRestrictionValue = restriction[
            restrictionKey
          ] as PromoCodeRestriction[];
          const orNode = new OrRestrictionNode();
          root.addChild(orNode);
          this.recursiveBuildDecisionTree(orNode, orRestrictionValue);
          break;

        case '@and':
          const andRestrictionValue = restriction[
            restrictionKey
          ] as PromoCodeRestriction[];
          const andNode = new AndRestrictionNode();
          root.addChild(andNode);
          this.recursiveBuildDecisionTree(andNode, andRestrictionValue);
          break;
      }
    });
  }
}

import {PromoCodeRestrictionDecisionTreeNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-restriction-decision-tree-node';
import {
  AgePromoCodeRestriction,
  DatePromoCodeRestriction,
  MeteorPromoCodeRestriction,
  PromoCodeRestriction,
} from '@/domain/promo-code/promo-code.type';
import {DateRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-restriction-tree-node-types/date-restriction-node';
import {ComparisonRules} from '@/domain/promo-code/entities/comparison-rules';
import {MeteoRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-restriction-tree-node-types/meteo-restriction-node';
import {AgeRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-restriction-tree-node-types/age-restriction-node';
import {OrRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-restriction-tree-node-types/or-restriction-node';
import {AndRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-restriction-tree-node-types/and-restriction-node';

export class PromoCodeRestrictionDecisionTree {
  private _root: PromoCodeRestrictionDecisionTreeNode;

  constructor() {
    this._root = new AndRestrictionNode();
  }

  set root(root: PromoCodeRestrictionDecisionTreeNode) {
    this._root = root;
  }

  get root(): PromoCodeRestrictionDecisionTreeNode {
    return this._root;
  }

  toString() {
    return JSON.stringify(this._root);
  }

  private recursiveBuildPromoCodeRestrictionDecisionTree(
    root: PromoCodeRestrictionDecisionTreeNode,
    restrictions: any[],
  ) {
    restrictions.forEach(restriction => {
      const restrictionKey = Object.keys(restriction)[0];
      switch (restrictionKey) {
        case '@date':
          const dateRestrictionValue = restriction[
            restrictionKey
          ] as DatePromoCodeRestriction;
          const node = new DateRestrictionNode(
            new Date(dateRestrictionValue.after),
            new Date(dateRestrictionValue.before),
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
          this.recursiveBuildPromoCodeRestrictionDecisionTree(
            orNode,
            orRestrictionValue,
          );
          break;

        case '@and':
          const andRestrictionValue = restriction[
            restrictionKey
          ] as PromoCodeRestriction[];
          const andNode = new AndRestrictionNode();
          root.addChild(andNode);
          this.recursiveBuildPromoCodeRestrictionDecisionTree(
            andNode,
            andRestrictionValue,
          );
          break;

        default:
          throw new Error(
            `Restriction type ${restrictionKey} is not supported`,
          );
      }
    });
  }

  build(promoCodeRestrictions: any[]) {
    this.recursiveBuildPromoCodeRestrictionDecisionTree(
      this._root,
      promoCodeRestrictions,
    );
    return this._root;
  }
}

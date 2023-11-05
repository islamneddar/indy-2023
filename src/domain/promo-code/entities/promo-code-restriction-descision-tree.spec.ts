import {PromoCodeRestrictionDecisionTree} from '@/domain/promo-code/entities/promo-code-restriction-decision-tree';
import {DateRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-restriction-tree-node-types/date-restriction-node';
import {OrRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-restriction-tree-node-types/or-restriction-node';
import {AgeRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-restriction-tree-node-types/age-restriction-node';
import {ComparisonRules} from '@/domain/promo-code/entities/comparison-rules';
import {MeteoRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-restriction-tree-node-types/meteo-restriction-node';

describe('PromoCodeRestrictionDescisionTree', () => {
  let restrictions: any[];
  beforeEach(() => {
    restrictions = [
      {'@date': {after: '2022-01-01', before: '2023-01-01'}},
      {
        '@or': [
          {'@age': {lt: 30, gt: 15}},
          {
            '@meteo': {
              is: 'clear',
              temp: {eq: 0},
            },
          },
        ],
      },
    ];
  });

  describe('buildPromoCodeRestrictionDecisionTree', () => {
    it('should build a promo code restriction decision tree', () => {
      const expectedPromoCOdeRestrictionDecisionTree =
        new PromoCodeRestrictionDecisionTree();

      const expectedRoot = expectedPromoCOdeRestrictionDecisionTree.root;

      expectedRoot.addChild(
        new DateRestrictionNode(new Date('2022-01-01'), new Date('2023-01-01')),
      );

      const orNode = new OrRestrictionNode();
      orNode.addChild(
        new AgeRestrictionNode(new ComparisonRules(30, 15, undefined)),
      );

      orNode.addChild(
        new MeteoRestrictionNode(
          'clear',
          new ComparisonRules(undefined, undefined, 0),
        ),
      );

      expectedRoot.addChild(orNode);

      const promoCodeRestrictionDecisionTree =
        new PromoCodeRestrictionDecisionTree();
      const root = promoCodeRestrictionDecisionTree.root;
      promoCodeRestrictionDecisionTree.build(restrictions);

      expect(root).toStrictEqual(expectedRoot);
    });

    it('should throw an error if the restriction is not valid', () => {
      restrictions.push({'@fake': {lt: 30, gt: 15}});

      const promoCodeRestrictionDecisionTree =
        new PromoCodeRestrictionDecisionTree();

      expect(() =>
        promoCodeRestrictionDecisionTree.build(restrictions),
      ).toThrowError('Restriction type @fake is not supported');
    });
  });
});

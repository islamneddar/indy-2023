import {PromoCodeHelper} from '@/domain/promo-code/promo-code.helper';
import {faker} from '@/test-tools/common';
import {PromoCodeRestrictionDecisionTree} from '@/domain/promo-code/entities/promo-code-restriction-decision-tree';

describe('PromoCodeHelper', () => {
  let promoCodeHelper: PromoCodeHelper;
  let restrictions: any[];
  let promoCodeName: string;
  let promoCodeAvantagePercent: number;

  beforeEach(() => {
    promoCodeHelper = new PromoCodeHelper();
    promoCodeName = faker.string.sample();
    promoCodeAvantagePercent = faker.number.int();

    restrictions = [
      {'@date': {after: '2022-01-01', before: '2023-01-01'}},
      {
        '@or': [
          {'@age': {lt: 30, gt: 15, eq: 0}},
          {
            '@meteo': {
              is: 'clear',
              temp: {lt: 30, gt: 15, eq: 0},
            },
          },
        ],
      },
    ];
  });

  describe('createPromoCode', () => {
    it('should create a promo code', () => {
      const expectedPromoCodeRestrictionTree =
        new PromoCodeRestrictionDecisionTree();
      expectedPromoCodeRestrictionTree.build(restrictions);

      const promoCode = promoCodeHelper.createPromoCode(
        promoCodeName,
        promoCodeAvantagePercent,
        restrictions,
      );

      expect(promoCode.id).toBeDefined();
      expect(promoCode.name).toBe(promoCodeName);
      expect(promoCode.advantage.percent).toBe(promoCodeAvantagePercent);
      expect(promoCode.restrictions).toBeDefined();
      expect(promoCode.restrictions).toStrictEqual(
        expectedPromoCodeRestrictionTree,
      );
    });
  });
});

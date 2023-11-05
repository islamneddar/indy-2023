import {OrRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-restriction-tree-node-types/or-restriction-node';
import {IsValidPromoCodeParams} from '@/domain/promo-code/promo-code.type';
import {
  createMockInvalidChild,
  createMockValidChild,
} from '@/test-tools/test-node-tree-promocode-util';
import {AgeRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-restriction-tree-node-types/age-restriction-node';
import {ComparisonRules} from '@/domain/promo-code/entities/comparison-rules';

describe('OrRestrictionNode', () => {
  let orRestriction: OrRestrictionNode;

  beforeEach(() => {
    orRestriction = new OrRestrictionNode();
  });
  it('should be defined', () => {
    expect(orRestriction).toBeDefined();
  });

  it('should have the correct type', () => {
    expect(orRestriction._type).toBe('@or');
  });

  it('should throw an error if it has less than 2 children', () => {
    const mockChildNode = new AgeRestrictionNode(
      new ComparisonRules(30, 15, undefined),
    );
    orRestriction.addChild(mockChildNode);

    const mockParams = {};
    const reasons: any[] = [];

    expect(() => orRestriction.isValid(mockParams, reasons)).toThrowError(
      'OR node must have at least two child',
    );
  });
  it('should return true if at least one child is valid', () => {
    const orNode = new OrRestrictionNode();
    orNode.addChild(createMockValidChild());
    orNode.addChild(createMockInvalidChild());

    const params: IsValidPromoCodeParams = {};
    const reasons: any[] = [];
    const isValid = orNode.isValid(params, reasons);

    expect(isValid).toBe(true);
    expect(reasons).toEqual([]);
  });

  it('should return true if all children are valid', () => {
    const orNode = new OrRestrictionNode();
    orNode.addChild(createMockValidChild());
    orNode.addChild(createMockValidChild());
    orNode.addChild(createMockValidChild());

    const params: IsValidPromoCodeParams = {};
    const reasons: any[] = [];
    const isValid = orNode.isValid(params, reasons);

    expect(isValid).toBe(true);
    expect(reasons).toEqual([]);
  });

  it('should return false if all children are invalid', () => {
    const orNode = new OrRestrictionNode();
    orNode.addChild(createMockInvalidChild());
    orNode.addChild(createMockInvalidChild());
    orNode.addChild(createMockInvalidChild());

    const params: IsValidPromoCodeParams = {};
    const reasons: any[] = [];
    const isValid = orNode.isValid(params, reasons);

    expect(isValid).toBe(false);

    expect(reasons).toHaveLength(1);
  });
});

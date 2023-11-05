import {AndRestrictionNode} from './and-restriction-node';
import {AgeRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-restriction-tree-node-types/age-restriction-node';
import {ComparisonRules} from '@/domain/promo-code/entities/comparison-rules';
import {IsValidPromoCodeParams} from '@/domain/promo-code/promo-code.type';
import {
  createMockInvalidChild,
  createMockValidChild,
} from '@/test-tools/test-node-tree-promocode-util';

describe('AndRestrictionNode', () => {
  let andRestrictionNode: AndRestrictionNode;

  beforeEach(() => {
    andRestrictionNode = new AndRestrictionNode();
  });

  it('should be defined', () => {
    expect(andRestrictionNode).toBeDefined();
  });

  it('should have the correct type', () => {
    expect(andRestrictionNode._type).toBe('@and');
  });

  it('should throw an error if it has less than 2 children', () => {
    const mockChildNode = new AgeRestrictionNode(
      new ComparisonRules(30, 15, undefined),
    );
    andRestrictionNode.addChild(mockChildNode);

    const mockParams = {};
    const reasons: any[] = [];

    expect(() => andRestrictionNode.isValid(mockParams, reasons)).toThrowError(
      'AND node must have at least two child',
    );
  });
  it('should return false if at least one child is invalide', () => {
    andRestrictionNode.addChild(createMockValidChild());
    andRestrictionNode.addChild(createMockInvalidChild());

    const params: IsValidPromoCodeParams = {};
    const reasons: any[] = [];
    const isValid = andRestrictionNode.isValid(params, reasons);

    expect(isValid).toBe(false);
    expect(reasons).toHaveLength(1);
  });

  it('should return true if all children are valid', () => {
    andRestrictionNode.addChild(createMockValidChild());
    andRestrictionNode.addChild(createMockValidChild());
    andRestrictionNode.addChild(createMockValidChild());

    const params: IsValidPromoCodeParams = {};
    const reasons: any[] = [];
    const isValid = andRestrictionNode.isValid(params, reasons);

    expect(isValid).toBe(true);
    expect(reasons).toEqual([]);
  });

  it('should return false if all children are invalid', () => {
    andRestrictionNode.addChild(createMockInvalidChild());
    andRestrictionNode.addChild(createMockInvalidChild());
    andRestrictionNode.addChild(createMockInvalidChild());

    const params: IsValidPromoCodeParams = {};
    const reasons: any[] = [];
    const isValid = andRestrictionNode.isValid(params, reasons);

    expect(isValid).toBe(false);

    expect(reasons).toHaveLength(1);
  });
});

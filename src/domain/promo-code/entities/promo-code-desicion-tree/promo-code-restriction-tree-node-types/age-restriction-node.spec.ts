import {AgeRestrictionNode} from './age-restriction-node';
import {ComparisonRules} from '@/domain/promo-code/entities/comparison-rules';

describe('AgeRestrictionNode', () => {
  let ageRestrictionNode: AgeRestrictionNode;
  let ageRestrictionNodeWithEq: AgeRestrictionNode;

  const sampleComparisonRules = new ComparisonRules(30, 15, undefined);
  const equalComparisonRules = new ComparisonRules(undefined, undefined, 25);

  const mockParams = {age: 25};

  beforeEach(() => {
    ageRestrictionNode = new AgeRestrictionNode(sampleComparisonRules);
    ageRestrictionNodeWithEq = new AgeRestrictionNode(equalComparisonRules);
  });

  it('should be defined', () => {
    expect(ageRestrictionNode).toBeDefined();
  });

  it('should have the correct type', () => {
    expect(ageRestrictionNode._type).toBe('@age');
  });

  it('should return true for valid age', () => {
    const isValid = ageRestrictionNode.isValid(mockParams, []);
    expect(isValid).toBe(true);
  });

  it('should return false for invalid age (greater than max)', () => {
    const mockParams = {age: 35};
    const isValid = ageRestrictionNode.isValid(mockParams, []);
    expect(isValid).toBe(false);
  });

  it('should return false for invalid age (less than min)', () => {
    const mockParams = {age: 10};
    const isValid = ageRestrictionNode.isValid(mockParams, []);
    expect(isValid).toBe(false);
  });

  it('should return false for invalid age (not equal to value)', () => {
    const mockParams = {age: 20};
    const isValid = ageRestrictionNodeWithEq.isValid(mockParams, []);
    expect(isValid).toBe(false);
  });

  it('should add a reason to the provided array for invalid age', () => {
    const mockParams = {age: 35};
    const reason: any[] = [];
    const isValid = ageRestrictionNode.isValid(mockParams, reason);
    expect(isValid).toBe(false);
    expect(reason.length).toBe(1);
    expect(reason[0]).toContain(ageRestrictionNode.toString());
  });

  it('should throw an Error', () => {
    expect(() => ageRestrictionNode.isValid(undefined, [])).toThrowError(
      'Age is not defined',
    );
  });

  it('should throw an error', () => {
    expect(() => ageRestrictionNode.isValid({}, [])).toThrowError(
      'Age is not defined',
    );
  });
});

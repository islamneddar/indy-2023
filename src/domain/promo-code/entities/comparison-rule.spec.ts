import {ComparisonRules} from './comparison-rules';

describe('ComparisonRules', () => {
  it('should throw an error if no rules are provided', () => {
    expect(() => new ComparisonRules()).toThrowError(
      'ComparisonRules must have at least one rule',
    );
  });

  it('should throw an error if both eq and lt/gt rules are provided', () => {
    expect(() => new ComparisonRules(10, 20, 30)).toThrowError(
      'ComparisonRules cannot have eq and lt/gt at the same time',
    );
  });

  it('should be valid when using eq rule', () => {
    const rules = new ComparisonRules(undefined, undefined, 10);
    expect(rules.isValid(10)).toBe(true);
    expect(rules.isValid(5)).toBe(false);
  });

  it('should be valid when using gt rule', () => {
    const rules = new ComparisonRules(undefined, 10, undefined);
    expect(rules.isValid(15)).toBe(true);
    expect(rules.isValid(10)).toBe(false);
    expect(rules.isValid(5)).toBe(false);
  });

  it('should be valid when using lt rule', () => {
    const rules = new ComparisonRules(10, undefined, undefined);
    expect(rules.isValid(5)).toBe(true);
    expect(rules.isValid(10)).toBe(false);
    expect(rules.isValid(15)).toBe(false);
  });

  it('should be valid when using multiple rules', () => {
    const rules = new ComparisonRules(20, 10, undefined);
    expect(rules.isValid(15)).toBe(true);
    expect(rules.isValid(5)).toBe(false);
    expect(rules.isValid(25)).toBe(false);
  });

  it('should return the correct string representation', () => {
    const rules1 = new ComparisonRules(10, undefined, undefined);
    const rules2 = new ComparisonRules(undefined, 20, undefined);
    const rules3 = new ComparisonRules(undefined, undefined, 30);

    expect(rules1.toString()).toBe('lowerThan 10 /  / ');
    expect(rules2.toString()).toBe(' / greaterThan 20 / ');
    expect(rules3.toString()).toBe(' /  / equals to 30');
  });
});

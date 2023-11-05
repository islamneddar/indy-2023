import {MeteoRestrictionNode} from './meteo-restriction-node';
import {ComparisonRules} from '@/domain/promo-code/entities/comparison-rules';

describe('MeteoRestrictionNode', () => {
  let meteoRestrictionNode: MeteoRestrictionNode;
  let meteoRestrictionNodeWithEq: MeteoRestrictionNode;

  beforeEach(() => {
    meteoRestrictionNode = new MeteoRestrictionNode(
      'clear',
      new ComparisonRules(30, 15, undefined),
    );

    meteoRestrictionNodeWithEq = new MeteoRestrictionNode(
      'clear',
      new ComparisonRules(undefined, undefined, 25),
    );
  });

  it('should be defined', () => {
    expect(meteoRestrictionNode).toBeDefined();
  });

  it('should have the correct type', () => {
    expect(meteoRestrictionNode._type).toBe('@meteo');
  });

  it('should return true for valid meteo data', () => {
    const mockParams = {
      meteoIs: 'clear',
      meteoTemp: 20,
    };
    const reasons: any[] = [];

    const isValid = meteoRestrictionNode.isValid(mockParams, reasons);

    expect(isValid).toBe(true);
    expect(reasons.length).toBe(0);
  });

  it('should return false for invalid meteo data (mismatching meteoIs)', () => {
    const mockParams = {
      meteoIs: 'rainy',
      meteoTemp: 20,
    };
    const reasons: any[] = [];

    const isValid = meteoRestrictionNode.isValid(mockParams, reasons);

    expect(isValid).toBe(false);
    expect(reasons.length).toBe(1);
    expect(reasons[0]).toContain("Meteo should be clear but it's rainy");
  });

  it('should return false for invalid meteo data (invalid temperature)', () => {
    const mockParams = {
      meteoIs: 'clear',
      meteoTemp: 10,
    };
    const reasons: any[] = [];

    const isValid = meteoRestrictionNode.isValid(mockParams, reasons);

    expect(isValid).toBe(false);
    expect(reasons.length).toBe(1);
    expect(reasons[0]).toContain(
      'Temperature is not valid for the meteo restriction',
    );
  });

  it('should add reasons for invalid meteo data', () => {
    const mockParams = {
      meteoIs: 'rainy',
      meteoTemp: 10,
    };
    const reasons: any[] = [];

    const isValid = meteoRestrictionNode.isValid(mockParams, reasons);

    expect(isValid).toBe(false);
    expect(reasons.length).toBe(2);
    expect(reasons[0]).toContain("Meteo should be clear but it's rainy");
    expect(reasons[1]).toContain(
      'Temperature is not valid for the meteo restriction',
    );
  });

  it('should return false for invalid meteo data (not equal to value)', () => {
    const mockParams = {
      meteoIs: 'clear',
      meteoTemp: 30,
    };
    const reasons: any[] = [];

    const isValid = meteoRestrictionNodeWithEq.isValid(mockParams, reasons);

    expect(isValid).toBe(false);
    expect(reasons.length).toBe(1);
    expect(reasons[0]).toContain(
      'Temperature is not valid for the meteo restriction',
    );
  });
});

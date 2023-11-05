import {DateRestrictionNode} from './date-restriction-node';
import {IsValidPromoCodeParams} from '@/domain/promo-code/promo-code.type';

describe('DateRestrictionNode', () => {
  let dateRestrictionNode: DateRestrictionNode;

  beforeEach(() => {
    dateRestrictionNode = new DateRestrictionNode(
      new Date('2022-01-01'),
      new Date('2024-01-01'),
    );
  });

  it('should be defined', () => {
    expect(dateRestrictionNode).toBeDefined();
  });

  it('should have the correct type', () => {
    expect(dateRestrictionNode._type).toBe('@date');
  });

  it('should return true for a valid date range', () => {
    const mockParams: IsValidPromoCodeParams = {
      selectedDate: new Date('2023-01-01'),
    };
    const reasons: any[] = [];

    const isValid = dateRestrictionNode.isValid(mockParams, reasons);

    expect(isValid).toBe(true);
    expect(reasons.length).toBe(0);
  });

  it('should return false for an invalid date range', () => {
    const mockParams: IsValidPromoCodeParams = {
      selectedDate: new Date('2025-01-01'),
    };
    const reasons: any[] = [];

    const isValid = dateRestrictionNode.isValid(mockParams, reasons);

    expect(isValid).toBe(false);
    expect(reasons.length).toBe(1);
    expect(reasons[0]).toContain(
      'Date is not valid for the date restriction : ' +
        dateRestrictionNode.toString(),
    );
  });

  it('should throw an Error', () => {
    expect(() => dateRestrictionNode.isValid(undefined, [])).toThrowError(
      'Date is not defined',
    );
  });
});

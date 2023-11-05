import {IsValidPromoCodeParams} from '@/domain/promo-code/promo-code.type';
import {OrRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-restriction-tree-node-types/or-restriction-node';

export function createMockValidChild() {
  return {
    isValid: (params: IsValidPromoCodeParams, reasons: any[]) => {
      return true;
    },
  } as OrRestrictionNode;
}

export function createMockInvalidChild() {
  return {
    isValid: (params: IsValidPromoCodeParams, reasons: any[]) => {
      reasons.push('Invalid child reason');
      return false;
    },
  } as OrRestrictionNode;
}

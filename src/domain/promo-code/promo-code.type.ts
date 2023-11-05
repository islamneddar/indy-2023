export type PromoCodeRestriction =
  | DatePromoCodeRestriction
  | AgePromoCodeRestriction
  | MeteorPromoCodeRestriction
  | OrOperationPromoCodeRestriction
  | AndOperationPromoCodeRestriction;

export interface DatePromoCodeRestriction {
  type: '@date';
  before: Date;
  after: Date;
}

export interface AgePromoCodeRestriction {
  type: '@age';
  eq?: number;
  lt?: number;
  gt?: number;
}

export interface MeteorPromoCodeRestriction {
  type: '@meteo';
  is: string;
  temp: TempMeteorPromoCodeRestriction;
}

export interface TempMeteorPromoCodeRestriction {
  eq?: number;
  lt?: number;
  gt?: number;
}

export interface OrOperationPromoCodeRestriction {
  type: '@or';
  restrictions: PromoCodeRestriction[];
}

export interface AndOperationPromoCodeRestriction {
  type: '@and';
  restrictions: PromoCodeRestriction[];
}

export interface IsValidPromoCodeParams {
  age?: number;
  meteoIs?: string;
  meteoTemp?: number;
  selectedDate?: Date;
}

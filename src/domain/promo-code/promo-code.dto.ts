import {
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

type RestrictionArrayType = (
  | AgeRestriction
  | MeteoRestriction
  | DateRestriction
  | OrRestriction
  | AndRestriction
)[];

class AdvantageDto {
  @IsNumber()
  percent: number;
}

// meteo
type MeteoRestriction = Record<'@meteo', MeteoRestrictionData>;

class TempMeteoRestrictionData {
  @IsNumber()
  eq?: number;

  @IsNumber()
  lt?: number;

  @IsNumber()
  gt?: number;
}

class MeteoRestrictionData {
  @IsString()
  is: string;

  @IsObject()
  @ValidateNested()
  temp: TempMeteoRestrictionData;
}

// age
type AgeRestriction = Record<'@age', AgeRestrictionData>;
class AgeRestrictionData {
  @IsNumber()
  eq?: number;

  @IsNumber()
  lt?: number;

  @IsNumber()
  gt?: number;
}

type DateRestriction = Record<'@date', DateRestrictionData>;
class DateRestrictionData {
  @IsString()
  before: string;

  @IsString()
  after: string;
}

type OrRestriction = Record<'@or', RestrictionArrayType>;

type AndRestriction = Record<'@and', RestrictionArrayType>;

export class CreatePromoCodeRequest {
  @IsString()
  name: string;

  @IsObject()
  @ValidateNested()
  avantage: AdvantageDto;

  @IsArray()
  restrictions: RestrictionArrayType;
}

class MeteoValidationArguments {
  @IsString()
  town: string;
}

class PromoCodeRestrictionArguments {
  @IsNumber()
  age: number;

  @IsObject()
  @ValidateNested()
  meteo: MeteoValidationArguments;
}

export class ValidatePromoCodeRequest {
  @IsString()
  promocode_name: string;

  @IsObject()
  @ValidateNested()
  arguments: PromoCodeRestrictionArguments;
}

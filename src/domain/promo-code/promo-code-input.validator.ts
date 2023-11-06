import {
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

// create code promo
type RestrictionArrayType = (
  | AgeRestriction
  | MeteoRestriction
  | DateRestriction
  | OrRestriction
  | AndRestriction
)[];

class AdvantageDto {
  @IsNumber()
  @ApiProperty()
  percent: number;
}

// meteo
type MeteoRestriction = Record<'@meteo', MeteoRestrictionData>;

class TempMeteoRestrictionData {
  @IsNumber()
  @ApiProperty()
  eq?: number;

  @IsNumber()
  @ApiProperty()
  lt?: number;

  @IsNumber()
  @ApiProperty()
  gt?: number;
}

class MeteoRestrictionData {
  @IsString()
  @ApiProperty()
  is: string;

  @IsObject()
  @ValidateNested()
  @ApiProperty()
  temp: TempMeteoRestrictionData;
}

// age
type AgeRestriction = Record<'@age', AgeRestrictionData>;
class AgeRestrictionData {
  @IsNumber()
  @ApiProperty()
  eq?: number;

  @IsNumber()
  @ApiProperty()
  lt?: number;

  @IsNumber()
  @ApiProperty()
  gt?: number;
}

type DateRestriction = Record<'@date', DateRestrictionData>;
class DateRestrictionData {
  @IsString()
  @ApiProperty()
  before: string;

  @IsString()
  @ApiProperty()
  after: string;
}

type OrRestriction = Record<'@or', RestrictionArrayType>;

type AndRestriction = Record<'@and', RestrictionArrayType>;

export class CreatePromoCodeRequest {
  @IsString()
  @ApiProperty()
  name: string;

  @IsObject()
  @ValidateNested()
  @ApiProperty()
  avantage: AdvantageDto;

  @IsArray()
  @ApiProperty()
  restrictions: RestrictionArrayType;
}

// validate code promo
class MeteoValidationArguments {
  @IsString()
  @ApiProperty()
  town: string;
}

class PromoCodeRestrictionArguments {
  @IsNumber()
  @ApiProperty()
  age: number;

  @IsObject()
  @ValidateNested()
  @ApiProperty()
  meteo: MeteoValidationArguments;
}

export class ValidatePromoCodeRequest {
  @IsString()
  @ApiProperty()
  promocode_name: string;

  @IsObject()
  @ValidateNested()
  @ApiProperty()
  arguments: PromoCodeRestrictionArguments;
}

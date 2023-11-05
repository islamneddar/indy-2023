import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  CreatePromoCodeRequest,
  ValidatePromoCodeRequest,
} from '@/domain/promo-code/promo-code.dto';
import {PromoCodeEntity} from '@/domain/promo-code/entities/promo-code.entity';
import {v4 as uuidv4} from 'uuid';
import {PromoCodeAdvantageEntity} from '@/domain/promo-code/entities/promo-code-advantage.entity';
import {InMemoryService} from '@/external-service/in-memory-storage/in-memory-storage';
import {WeatherService} from '@/external-service/weather-service/weather.service';
import {PromoCodeHelper} from '@/domain/promo-code/promo-code.helper';
import {IsValidPromoCodeParams} from '@/domain/promo-code/promo-code.type';

@Controller('promo-code')
export class PromoCodeController {
  constructor(
    private inMemoryService: InMemoryService<PromoCodeEntity>,
    private weatherService: WeatherService,
    private promoCodeHelper: PromoCodeHelper,
  ) {}

  @Get('/health')
  health() {
    return 'OK';
  }

  @Post('/')
  create(@Body() promoCodeRequest: CreatePromoCodeRequest) {
    const isPromoCodeExist = this.inMemoryService.read(promoCodeRequest.name);
    if (isPromoCodeExist) {
      throw new ConflictException('Promo code already exist');
    }

    const promoCode = new PromoCodeEntity();
    promoCode.id = uuidv4();
    promoCode.name = promoCodeRequest.name;
    promoCode.advantage = new PromoCodeAdvantageEntity(
      promoCodeRequest.avantage.percent,
    );
    promoCode.restrictions = this.promoCodeHelper.buildDecisionTree(
      promoCodeRequest.restrictions,
    );

    this.inMemoryService.create(promoCode.name, promoCode);

    return {
      promocode_name: promoCode.name,
      status: 'created',
    };
  }

  @Get('/:name')
  getByName(@Param('name') name: string) {
    return this.inMemoryService.read(name);
  }

  @Post('/validate')
  async validate(@Body() body: ValidatePromoCodeRequest) {
    const promoCode = this.inMemoryService.read(body.promocode_name);

    if (!promoCode) {
      throw new NotFoundException('Promo code not found');
    }

    const paramsValidation: IsValidPromoCodeParams = {};

    if (body.arguments.age) {
      paramsValidation.age = body.arguments.age;
    }

    if (body.arguments.meteo.town) {
      const weatherData = await this.weatherService.getWeatherByCity(
        body.arguments.meteo.town,
      );
      paramsValidation.meteoIs = weatherData.weather.main;
      paramsValidation.meteoTemp = weatherData.main.temp;
    }

    const reasonInvalidationCodePromo = [];
    const isValid = promoCode.restrictions.root.isValid(
      paramsValidation,
      reasonInvalidationCodePromo,
    );

    if (isValid) {
      return {
        promocode_name: promoCode.name,
        status: 'accepted',
        avantage: {
          percent: promoCode.advantage.percent,
        },
      };
    }
    return {
      promocode_name: promoCode.name,
      status: 'denied',
      reasons: [...reasonInvalidationCodePromo],
    };
  }
}

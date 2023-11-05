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
} from '@/domain/promo-code/promo-code-input.validator';
import {PromoCodeEntity} from '@/domain/promo-code/entities/promo-code.entity';
import {InMemoryStorageService} from '@/external-service/in-memory-storage/in-memory-storage';
import {WeatherService} from '@/external-service/weather-service/weather.service';
import {PromoCodeHelper} from '@/domain/promo-code/promo-code.helper';
import {IsValidPromoCodeParams} from '@/domain/promo-code/promo-code.type';

@Controller('promo-code')
export class PromoCodeController {
  constructor(
    private inMemoryService: InMemoryStorageService<PromoCodeEntity>,
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

    const promoCode = this.promoCodeHelper.createPromoCode(
      promoCodeRequest.name,
      promoCodeRequest.avantage.percent,
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

    const paramsValidation: IsValidPromoCodeParams = {
      selectedDate: new Date(),
    };

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

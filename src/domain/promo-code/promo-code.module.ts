import {Module} from '@nestjs/common';
import {PromoCodeController} from '@/domain/promo-code/promo-code.controller';
import {PromoCodeService} from '@/domain/promo-code/promo-code.service';
import {InMemoryService} from '@/external-service/in-memory-storage/in-memory-storage';
import {WeatherService} from '@/external-service/weather-service/weather.service';
import {openWeatherProvider} from '@/external-service/weather-service/weather-service-provider';
import {PromoCodeHelper} from '@/domain/promo-code/promo-code.helper';

@Module({
  imports: [],
  controllers: [PromoCodeController],
  providers: [
    PromoCodeService,
    InMemoryService,
    WeatherService,
    openWeatherProvider,
    PromoCodeHelper,
  ],
  exports: [],
})
export class PromoCodeModule {}

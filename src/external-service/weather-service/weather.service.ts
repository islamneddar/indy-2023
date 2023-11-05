import {Inject, Injectable} from '@nestjs/common';
import {WeatherServiceInterface} from '@/external-service/weather-service/weather-service-interface';

@Injectable()
export class WeatherService {
  constructor(
    @Inject('WeatherService')
    private readonly weatherService: WeatherServiceInterface,
  ) {}

  async getWeatherByCity(city: string) {
    return this.weatherService.getWeatherByCity(city);
  }
}

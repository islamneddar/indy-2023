import {GetWeatherByCityResponse} from '@/external-service/weather-service/weather-service.type';

export interface WeatherServiceInterface {
  getWeatherByCity(city: string): Promise<GetWeatherByCityResponse>;
}

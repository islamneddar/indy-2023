import {OpenWeatherService} from '@/external-service/weather-service/open-weather-service/open-weather.service';

export const openWeatherProvider = {
  provide: 'WeatherService',
  useClass: OpenWeatherService,
};

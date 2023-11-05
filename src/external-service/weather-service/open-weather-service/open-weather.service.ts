import {WeatherServiceInterface} from '@/external-service/weather-service/weather-service-interface';
import {GetWeatherByCityResponse} from '@/external-service/weather-service/weather-service.type';
import axios from 'axios';
import {ConfigService} from '@nestjs/config';
import {Inject} from '@nestjs/common';
import {OPEN_WEATHER_API_KEY} from '@/config/key.constant';

export class OpenWeatherService implements WeatherServiceInterface {
  private endpoint = 'https://api.openweathermap.org/data/2.5/weather';
  private apiKey: string;

  constructor(@Inject(ConfigService) configService: ConfigService) {
    this.apiKey = configService.get(OPEN_WEATHER_API_KEY);
  }
  async getWeatherByCity(city: string): Promise<GetWeatherByCityResponse> {
    // we can add a retry system
    try {
      const weather = await axios.get(this.endpoint, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric',
        },
      });

      return {
        weather: {
          main: weather.data.weather[0].main,
        },
        main: {
          temp: weather.data.main.temp,
        },
      };
    } catch (error) {
      console.log(error);
      throw new Error('Error getting weather');
    }
  }
}

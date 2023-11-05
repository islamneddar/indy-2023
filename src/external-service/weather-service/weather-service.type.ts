export interface GetWeatherByCityResponse {
  weather: Weather;
  main: Main;
}

export interface Main {
  temp: number;
}

export interface Weather {
  main: string;
}

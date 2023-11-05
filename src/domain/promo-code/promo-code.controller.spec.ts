import {Test, TestingModule} from '@nestjs/testing';
import {PromoCodeController} from './promo-code.controller';
import {PromoCodeHelper} from '@/domain/promo-code/promo-code.helper';
import {InMemoryStorageService} from '@/external-service/in-memory-storage/in-memory-storage';
import {WeatherService} from '@/external-service/weather-service/weather.service';
import {openWeatherProvider} from '@/external-service/weather-service/weather-service-provider';
import {ConfigService} from '@nestjs/config';
import {PromoCodeEntity} from '@/domain/promo-code/entities/promo-code.entity';
import {CreatePromoCodeRequest} from '@/domain/promo-code/promo-code-input.validator';
import {faker} from '@/test-tools/common';
import {GetWeatherByCityResponse} from '@/external-service/weather-service/weather-service.type';

describe('PromoCodeController', () => {
  let controller: PromoCodeController;
  let inMemoryService: InMemoryStorageService<PromoCodeEntity>;
  let promoCodeHelper: PromoCodeHelper;
  let weatherService: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromoCodeController],
      providers: [
        InMemoryStorageService,
        PromoCodeHelper,
        WeatherService,
        openWeatherProvider,
        ConfigService,
      ],
    }).compile();

    controller = module.get<PromoCodeController>(PromoCodeController);
    inMemoryService = module.get<InMemoryStorageService<PromoCodeEntity>>(
      InMemoryStorageService,
    );

    promoCodeHelper = module.get<PromoCodeHelper>(PromoCodeHelper);
    weatherService = module.get<WeatherService>(WeatherService);
  });

  describe('health', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should return "OK" for health check', () => {
      expect(controller.health()).toBe('OK');
    });
  });

  describe('create', () => {
    let createPromoCodeRequest: CreatePromoCodeRequest;
    beforeEach(() => {
      createPromoCodeRequest = {
        name: faker.string.uuid(),
        avantage: {
          percent: faker.number.int(),
        },
        restrictions: restriction,
      };
    });
    it('should create a promo code', () => {
      const promoCodeEntity = promoCodeHelper.createPromoCode(
        createPromoCodeRequest.name,
        createPromoCodeRequest.avantage.percent,
        createPromoCodeRequest.restrictions,
      );

      jest
        .spyOn(promoCodeHelper, 'createPromoCode')
        .mockReturnValueOnce(promoCodeEntity);

      jest.spyOn(inMemoryService, 'create').mockReturnValueOnce(undefined);

      const result = controller.create(createPromoCodeRequest);

      expect(result).toEqual({
        promocode_name: promoCodeEntity.name,
        status: 'created',
      });
      expect(inMemoryService.create).toHaveBeenCalledWith(
        createPromoCodeRequest.name,
        promoCodeEntity,
      );

      expect(promoCodeHelper.createPromoCode).toHaveBeenCalledWith(
        createPromoCodeRequest.name,
        createPromoCodeRequest.avantage.percent,
        createPromoCodeRequest.restrictions,
      );
    });

    it('should throw an error if promo code already exist', () => {
      jest
        .spyOn(inMemoryService, 'read')
        .mockReturnValueOnce(new PromoCodeEntity());

      try {
        controller.create(createPromoCodeRequest);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Promo code already exist');
      }
    });
  });

  describe('validate', () => {
    let validatePromoCodeRequest;
    let promoCodeValidEntity: PromoCodeEntity;
    let promoCodeInvalidEntity: PromoCodeEntity;
    beforeEach(() => {
      validatePromoCodeRequest = {
        promocode_name: faker.string.uuid(),
        arguments: {
          age: faker.number.int(),
          meteo: {
            town: faker.location.city(),
          },
        },
      };

      promoCodeValidEntity = promoCodeHelper.createPromoCode(
        validatePromoCodeRequest.promocode_name,
        faker.number.int(),
        restriction,
      );

      promoCodeInvalidEntity = promoCodeHelper.createPromoCode(
        validatePromoCodeRequest.promocode_name,
        faker.number.int(),
        restrictionPrefilled,
      );
    });

    it('should throw an error if promo code not found', async () => {
      jest.spyOn(inMemoryService, 'read').mockReturnValueOnce(null);

      try {
        await controller.validate(validatePromoCodeRequest);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Promo code not found');
      }
    });

    it('should return true if promo code is valid', async () => {
      const weatherData: GetWeatherByCityResponse = {
        weather: {
          main: faker.string.sample(),
        },
        main: {
          temp: faker.number.float(),
        },
      };
      jest
        .spyOn(weatherService, 'getWeatherByCity')
        .mockResolvedValue(weatherData);

      jest
        .spyOn(inMemoryService, 'read')
        .mockReturnValueOnce(promoCodeValidEntity);

      jest
        .spyOn(promoCodeValidEntity.restrictions.root, 'isValid')
        .mockReturnValueOnce(true);

      const result = await controller.validate(validatePromoCodeRequest);

      expect(result).toEqual({
        promocode_name: promoCodeValidEntity.name,
        status: 'accepted',
        avantage: {
          percent: promoCodeValidEntity.advantage.percent,
        },
      });
    });

    it('should return false if promo code is not valid', async () => {
      const weatherData: GetWeatherByCityResponse = {
        weather: {
          main: 'rainy',
        },
        main: {
          temp: 10,
        },
      };
      jest
        .spyOn(weatherService, 'getWeatherByCity')
        .mockResolvedValue(weatherData);

      jest
        .spyOn(inMemoryService, 'read')
        .mockReturnValueOnce(promoCodeInvalidEntity);

      const expectedReasons = [
        {
          type: '@and',
          reason: [
            {
              type: '@or',
              reason: [
                'Age is not valid for the age restriction : @age should be :  /  / equals to 30',
                {
                  type: '@and',
                  reason: [
                    'Age is not valid for the age restriction : @age should be : lowerThan 40 / greaterThan 20 / ',
                  ],
                },
              ],
            },
          ],
        },
      ];

      const result = await controller.validate(validatePromoCodeRequest);

      expect(result).toEqual({
        promocode_name: promoCodeInvalidEntity.name,
        status: 'denied',
        reasons: expectedReasons,
      });
    });
  });
});

const restriction: any = [
  {
    '@date': {
      after: faker.date.past().toDateString(),
      before: faker.date.soon().toDateString(),
    },
  },
  {
    '@or': [
      {
        '@age': {
          eq: faker.number.int({max: 100}),
        },
      },
      {
        '@and': [
          {
            '@age': {
              lt: faker.number.int({max: 100}),
              gt: faker.number.int({min: 100, max: 200}),
            },
          },
          {
            '@meteo': {
              is: faker.string.sample(),
              temp: {
                gt: faker.number.int(),
              },
            },
          },
        ],
      },
    ],
  },
];

const restrictionPrefilled = [
  {
    '@date': {
      after: '2021-01-01',
      before: '2024-01-01',
    },
  },
  {
    '@or': [
      {
        '@age': {
          eq: 30,
        },
      },
      {
        '@and': [
          {
            '@age': {
              lt: 40,
              gt: 20,
            },
          },
          {
            '@meteo': {
              is: 'clear',
              temp: {
                gt: 20,
              },
            },
          },
        ],
      },
    ],
  },
];

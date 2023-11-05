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
import {PromoCodeRestrictionDecisionTree} from '@/domain/promo-code/entities/promo-code-restriction-decision-tree';
import {AndRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/node-types/and-restriction-node';
import {DateRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/node-types/date-restriction-node';
import {
  AgePromoCodeRestriction,
  DatePromoCodeRestriction,
  MeteorPromoCodeRestriction,
  PromoCodeRestriction,
} from '@/domain/promo-code/promo-code.type';
import {PromoCodeDecisionTreeNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/promo-code-decision-tree-node';
import {MeteoRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/node-types/meteo-restriction-node';
import {ComparisonRules} from '@/domain/promo-code/entities/comparison-rules';
import {AgeRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/node-types/age-restriction-node';
import {OrRestrictionNode} from '@/domain/promo-code/entities/promo-code-desicion-tree/node-types/or-restriction-node';
import {InMemoryService} from '@/external-service/in-memory-storage/in-memory-storage';
import {WeatherService} from '@/external-service/weather-service/weather.service';

@Controller('promo-code')
export class PromoCodeController {
  constructor(
    private inMemoryService: InMemoryService<PromoCodeEntity>,
    private weatherService: WeatherService,
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
    promoCode.restrictions = this.buildDecisionTree(
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
    console.log('promoCode => ', promoCode);
    if (!promoCode) {
      throw new NotFoundException('Promo code not found');
    }
    const paramsValidation = {};
    if (body.arguments.age) {
      paramsValidation['age'] = body.arguments.age;
    }

    if (body.arguments.meteo.town) {
      const town = body.arguments.meteo.town;
      const weatherData = await this.weatherService.getWeatherByCity(town);
      console.log('weatherData => ', weatherData);
      paramsValidation['meteoIs'] = weatherData.weather.main;
      paramsValidation['meteoTemp'] = weatherData.main.temp;
    }

    console.log('paramsValidation => ', paramsValidation);
    const reason = [];
    const isValid = promoCode.restrictions.root.isValid(
      paramsValidation,
      reason,
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
      reasons: [...reason],
    };
  }

  buildDecisionTree(restrictions: any[]) {
    const promoCodeDecisionTree = new PromoCodeRestrictionDecisionTree();

    promoCodeDecisionTree.root = new AndRestrictionNode();

    this.recursiveBuildDecisionTree(promoCodeDecisionTree.root, restrictions);

    return promoCodeDecisionTree;
  }

  recursiveBuildDecisionTree(
    root: PromoCodeDecisionTreeNode,
    restrictions: any[],
  ) {
    console.log('recursiveBuildDecisionTree => ', root);
    restrictions.forEach(restriction => {
      const restrictionKey = Object.keys(restriction)[0];
      switch (restrictionKey) {
        case '@date':
          const dateRestrictionValue = restriction[
            restrictionKey
          ] as DatePromoCodeRestriction;
          const node = new DateRestrictionNode(
            dateRestrictionValue.after,
            dateRestrictionValue.before,
          );
          root.addChild(node);
          break;

        case '@meteo':
          const meteoRestrictionValue = restriction[
            restrictionKey
          ] as MeteorPromoCodeRestriction;

          const temp = new ComparisonRules(
            meteoRestrictionValue.temp.lt,
            meteoRestrictionValue.temp.gt,
            meteoRestrictionValue.temp.eq,
          );
          const meteoNode = new MeteoRestrictionNode(
            meteoRestrictionValue.is,
            temp,
          );
          root.addChild(meteoNode);
          break;

        case '@age':
          const ageRestrictionValue = restriction[
            restrictionKey
          ] as AgePromoCodeRestriction;

          const age = new ComparisonRules(
            ageRestrictionValue.lt,
            ageRestrictionValue.gt,
            ageRestrictionValue.eq,
          );
          const ageNode = new AgeRestrictionNode(age);
          root.addChild(ageNode);
          break;

        case '@or':
          const orRestrictionValue = restriction[
            restrictionKey
          ] as PromoCodeRestriction[];
          const orNode = new OrRestrictionNode();
          root.addChild(orNode);
          this.recursiveBuildDecisionTree(orNode, orRestrictionValue);
          break;

        case '@and':
          const andRestrictionValue = restriction[
            restrictionKey
          ] as PromoCodeRestriction[];
          const andNode = new AndRestrictionNode();
          root.addChild(andNode);
          this.recursiveBuildDecisionTree(andNode, andRestrictionValue);
          break;
      }
    });
  }
}

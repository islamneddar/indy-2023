import {ConfigModule} from '@nestjs/config';
import {Module} from '@nestjs/common';
import {Modules} from '@/modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ...Modules,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export default class AppModule {}
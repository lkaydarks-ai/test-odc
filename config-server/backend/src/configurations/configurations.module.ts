// import { Module } from '@nestjs/common';
// import { ConfigurationsService } from './configurations.service';
// import { ConfigurationsController } from './configurations.controller';

// @Module({
//   providers: [ConfigurationsService],
//   controllers: [ConfigurationsController]
// })
// export class ConfigurationsModule {}


import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationsController } from './configurations.controller';
import { ConfigurationsService } from './configurations.service';
import { Config, ConfigSchema } from './schemas/config.schema';

@Module({
  imports: [
    // Enregistre le modèle Mongoose "Config" dans ce module
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
  ],
  controllers: [ConfigurationsController],
  providers: [ConfigurationsService],
})
export class ConfigurationsModule {}
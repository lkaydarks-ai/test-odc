// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { ConfigurationsModule } from './configurations/configurations.module';

// @Module({
//   imports: [ConfigurationsModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationsModule } from './configurations/configurations.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    // Connexion MongoDB (la base "config-server" est créée automatiquement)
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/config-server'),
    ConfigurationsModule,
    UploadsModule,
  ],
})
export class AppModule {}
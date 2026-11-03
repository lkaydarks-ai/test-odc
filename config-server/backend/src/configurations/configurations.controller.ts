// import { Controller } from '@nestjs/common';

// @Controller('configurations')
// export class ConfigurationsController {}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ConfigurationsService } from './configurations.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Controller('configurations') // préfixe : /configurations
export class ConfigurationsController {
  constructor(private readonly service: ConfigurationsService) {}

  @Post() // POST /configurations
  create(@Body() dto: CreateConfigurationDto) {
    return this.service.create(dto);
  }

  @Get() // GET /configurations
  findAll() {
    return this.service.findAll();
  }

  @Get(':key') // GET /configurations/programs.devops
  findOne(@Param('key') key: string) {
    return this.service.findOneByKey(key);
  }

  @Patch(':key') // PATCH /configurations/programs.devops
  update(@Param('key') key: string, @Body() dto: UpdateConfigurationDto) {
    return this.service.updateByKey(key, dto);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.service.deleteByKey(key);
  }
}
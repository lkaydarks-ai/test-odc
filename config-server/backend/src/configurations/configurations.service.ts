// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class ConfigurationsService {}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Config, ConfigDocument } from './schemas/config.schema';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Injectable()
export class ConfigurationsService {
  constructor(
    @InjectModel(Config.name) private readonly configModel: Model<ConfigDocument>,
  ) {}

  // CREATE : 409 Conflict si la clé existe déjà
  async create(dto: CreateConfigurationDto) {
    try {
      return await this.configModel.create(dto);
    } catch (error: any) {
      // 11000 = erreur MongoDB "duplicate key" (index unique sur "key")
      if (error?.code === 11000) {
        throw new ConflictException(`La clé "${dto.key}" existe déjà`);
      }
      throw error;
    }
  }

  // LIST : les plus récentes en premier
  async findAll() {
    return this.configModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  // DETAIL : 404 si la clé n'existe pas
  async findOneByKey(key: string) {
    const config = await this.configModel.findOne({ key }).lean().exec();
    if (!config) {
      throw new NotFoundException(`Configuration "${key}" introuvable`);
    }
    return config;
  }

  // UPDATE : modifie value et/ou status. 404 si la clé n'existe pas
  async updateByKey(key: string, dto: UpdateConfigurationDto) {
    const updated = await this.configModel
      .findOneAndUpdate(
        { key },
        { $set: { ...dto } },
        { new: true, runValidators: true }, // new: renvoie le doc mis à jour
      )
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException(`Configuration "${key}" introuvable`);
    }
    return updated;
  }

  async deleteByKey(key: string) {
    const deleted = await this.configModel.findOneAndDelete({ key }).lean().exec();

    if (!deleted) {
      throw new NotFoundException(`Configuration "${key}" introuvable`);
    }
    return deleted;
  }
}
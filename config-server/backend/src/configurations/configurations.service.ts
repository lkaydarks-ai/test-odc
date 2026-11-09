/**
 * Service métier pour la gestion des configurations en base de données MongoDB.
 * Assure les opérations de création, lecture, mise à jour et suppression,
 * en gérant l'unicité des clés et les cas d'erreur (404 Not Found, 409 Conflict).
 */

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
    // Injection du modèle Mongoose associé à la collection "configs"
    @InjectModel(Config.name) private readonly configModel: Model<ConfigDocument>,
  ) {}

  /**
   * Crée une nouvelle configuration en base.
   * Lève une exception 409 Conflict si la clé demandée est déjà utilisée.
   */
  async create(dto: CreateConfigurationDto) {
    try {
      return await this.configModel.create(dto);
    } catch (error: any) {
      // Le code d'erreur MongoDB 11000 signale la violation d'un index unique (sur le champ "key")
      if (error?.code === 11000) {
        throw new ConflictException(`La clé "${dto.key}" existe déjà.`);
      }
      throw error;
    }
  }

  /**
   * Renvoie la liste de toutes les configurations, ordonnées de la plus récente à la plus ancienne.
   * L'option .lean() allège la mémoire en retournant des objets JavaScript simples plutôt que des documents Mongoose.
   */
  async findAll() {
    return this.configModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  /**
   * Recherche une configuration à partir de sa clé unique.
   * Lève une exception 404 Not Found si aucun document ne correspond.
   */
  async findOneByKey(key: string) {
    const config = await this.configModel.findOne({ key }).lean().exec();
    if (!config) {
      throw new NotFoundException(`Configuration avec la clé "${key}" introuvable.`);
    }
    return config;
  }

  /**
   * Met à jour la valeur (JSON) ou le statut d'une configuration existante.
   * La clé reste immuable car elle sert d'identifiant stable dans les applications clientes.
   */
  async updateByKey(key: string, dto: UpdateConfigurationDto) {
    const updated = await this.configModel
      .findOneAndUpdate(
        { key },
        { $set: { ...dto } },
        { new: true, runValidators: true }, // new: true renvoie l'objet après modification
      )
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException(`Configuration "${key}" introuvable.`);
    }
    return updated;
  }

  /**
   * Supprime définitivement une configuration identifiée par sa clé.
   * Lève une exception 404 Not Found si la clé n'existe pas en base.
   */
  async deleteByKey(key: string) {
    const deleted = await this.configModel.findOneAndDelete({ key }).lean().exec();

    if (!deleted) {
      throw new NotFoundException(`Configuration "${key}" introuvable.`);
    }
    return deleted;
  }
}

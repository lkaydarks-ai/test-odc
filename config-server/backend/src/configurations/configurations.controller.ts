/**
 * Contrôleur REST pour la gestion des configurations de l'écosystème ODC Campus.
 * Expose les endpoints CRUD permettant au Back Office de modifier les paramètres
 * et à la Super App Flutter de les consommer dynamiquement.
 */

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

@Controller('configurations')
export class ConfigurationsController {
  constructor(private readonly service: ConfigurationsService) {}

  /**
   * Crée une nouvelle configuration dans MongoDB.
   * Route : POST /configurations
   * Exemple de payload : { key: "app.services", value: { services: [...] } }
   */
  @Post()
  create(@Body() dto: CreateConfigurationDto) {
    return this.service.create(dto);
  }

  /**
   * Récupère la liste intégrale des configurations existantes.
   * Route : GET /configurations
   * Utilisé par le Back Office pour afficher l'ensemble des éléments configurables.
   */
  @Get()
  findAll() {
    return this.service.findAll();
  }

  /**
   * Récupère une configuration précise selon sa clé unique.
   * Route : GET /configurations/:key
   * Exemple : GET /configurations/app.services (utilisé par la Super App Flutter au démarrage)
   */
  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.service.findOneByKey(key);
  }

  /**
   * Met à jour partiellement la valeur ou le statut d'une configuration existante.
   * Route : PATCH /configurations/:key
   * Exemple : PATCH /configurations/app.services (utilisé par le Back Office après ajout/modification de service)
   */
  @Patch(':key')
  update(@Param('key') key: string, @Body() dto: UpdateConfigurationDto) {
    return this.service.updateByKey(key, dto);
  }

  /**
   * Supprime définitivement une configuration par sa clé unique.
   * Route : DELETE /configurations/:key
   */
  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.service.deleteByKey(key);
  }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_schema_1 = require("./schemas/config.schema");
let ConfigurationsService = class ConfigurationsService {
    configModel;
    constructor(configModel) {
        this.configModel = configModel;
    }
    async create(dto) {
        try {
            return await this.configModel.create(dto);
        }
        catch (error) {
            if (error?.code === 11000) {
                throw new common_1.ConflictException(`La clé "${dto.key}" existe déjà`);
            }
            throw error;
        }
    }
    async findAll() {
        return this.configModel.find().sort({ createdAt: -1 }).lean().exec();
    }
    async findOneByKey(key) {
        const config = await this.configModel.findOne({ key }).lean().exec();
        if (!config) {
            throw new common_1.NotFoundException(`Configuration "${key}" introuvable`);
        }
        return config;
    }
    async updateByKey(key, dto) {
        const updated = await this.configModel
            .findOneAndUpdate({ key }, { $set: { ...dto } }, { new: true, runValidators: true })
            .lean()
            .exec();
        if (!updated) {
            throw new common_1.NotFoundException(`Configuration "${key}" introuvable`);
        }
        return updated;
    }
    async deleteByKey(key) {
        const deleted = await this.configModel.findOneAndDelete({ key }).lean().exec();
        if (!deleted) {
            throw new common_1.NotFoundException(`Configuration "${key}" introuvable`);
        }
        return deleted;
    }
};
exports.ConfigurationsService = ConfigurationsService;
exports.ConfigurationsService = ConfigurationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(config_schema_1.Config.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ConfigurationsService);
//# sourceMappingURL=configurations.service.js.map
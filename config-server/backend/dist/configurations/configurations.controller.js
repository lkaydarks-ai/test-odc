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
exports.ConfigurationsController = void 0;
const common_1 = require("@nestjs/common");
const configurations_service_1 = require("./configurations.service");
const create_configuration_dto_1 = require("./dto/create-configuration.dto");
const update_configuration_dto_1 = require("./dto/update-configuration.dto");
let ConfigurationsController = class ConfigurationsController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll() {
        return this.service.findAll();
    }
    findOne(key) {
        return this.service.findOneByKey(key);
    }
    update(key, dto) {
        return this.service.updateByKey(key, dto);
    }
    remove(key) {
        return this.service.deleteByKey(key);
    }
};
exports.ConfigurationsController = ConfigurationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_configuration_dto_1.CreateConfigurationDto]),
    __metadata("design:returntype", void 0)
], ConfigurationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':key'),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConfigurationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':key'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_configuration_dto_1.UpdateConfigurationDto]),
    __metadata("design:returntype", void 0)
], ConfigurationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':key'),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConfigurationsController.prototype, "remove", null);
exports.ConfigurationsController = ConfigurationsController = __decorate([
    (0, common_1.Controller)('configurations'),
    __metadata("design:paramtypes", [configurations_service_1.ConfigurationsService])
], ConfigurationsController);
//# sourceMappingURL=configurations.controller.js.map
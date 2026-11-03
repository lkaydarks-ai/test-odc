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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateConfigurationDto = void 0;
const class_validator_1 = require("class-validator");
const config_schema_1 = require("../schemas/config.schema");
class CreateConfigurationDto {
    key;
    value;
    status;
}
exports.CreateConfigurationDto = CreateConfigurationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9._-]+$/, {
        message: 'La clé ne peut contenir que des lettres, chiffres, points, tirets et underscores',
    }),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsObject)({ message: 'value doit être un objet JSON' }),
    __metadata("design:type", Object)
], CreateConfigurationDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(config_schema_1.ConfigStatus, { message: 'status doit être "active" ou "inactive"' }),
    __metadata("design:type", String)
], CreateConfigurationDto.prototype, "status", void 0);
//# sourceMappingURL=create-configuration.dto.js.map
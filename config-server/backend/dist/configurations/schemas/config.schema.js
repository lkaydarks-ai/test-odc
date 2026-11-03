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
exports.ConfigSchema = exports.Config = exports.ConfigStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ConfigStatus;
(function (ConfigStatus) {
    ConfigStatus["ACTIVE"] = "active";
    ConfigStatus["INACTIVE"] = "inactive";
})(ConfigStatus || (exports.ConfigStatus = ConfigStatus = {}));
let Config = class Config {
    key;
    value;
    status;
    createdAt;
    updatedAt;
};
exports.Config = Config;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true }),
    __metadata("design:type", String)
], Config.prototype, "key", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed, required: true }),
    __metadata("design:type", Object)
], Config.prototype, "value", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ConfigStatus, default: ConfigStatus.ACTIVE }),
    __metadata("design:type", String)
], Config.prototype, "status", void 0);
exports.Config = Config = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Config);
exports.ConfigSchema = mongoose_1.SchemaFactory.createForClass(Config);
//# sourceMappingURL=config.schema.js.map
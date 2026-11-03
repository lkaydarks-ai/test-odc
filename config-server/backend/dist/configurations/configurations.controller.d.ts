import { ConfigurationsService } from './configurations.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
export declare class ConfigurationsController {
    private readonly service;
    constructor(service: ConfigurationsService);
    create(dto: CreateConfigurationDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/config.schema").Config, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/config.schema").Config & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/config.schema").Config, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/config.schema").Config & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/config.schema").Config, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/config.schema").Config & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(key: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/config.schema").Config, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/config.schema").Config & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(key: string, dto: UpdateConfigurationDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/config.schema").Config, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/config.schema").Config & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(key: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/config.schema").Config, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/config.schema").Config & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}

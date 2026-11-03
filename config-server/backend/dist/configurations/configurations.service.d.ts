import { Model } from 'mongoose';
import { Config, ConfigDocument } from './schemas/config.schema';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
export declare class ConfigurationsService {
    private readonly configModel;
    constructor(configModel: Model<ConfigDocument>);
    create(dto: CreateConfigurationDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Config, {}, import("mongoose").DefaultSchemaOptions> & Config & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Config, {}, import("mongoose").DefaultSchemaOptions> & Config & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Config, {}, import("mongoose").DefaultSchemaOptions> & Config & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOneByKey(key: string): Promise<import("mongoose").Document<unknown, {}, Config, {}, import("mongoose").DefaultSchemaOptions> & Config & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    updateByKey(key: string, dto: UpdateConfigurationDto): Promise<import("mongoose").Document<unknown, {}, Config, {}, import("mongoose").DefaultSchemaOptions> & Config & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    deleteByKey(key: string): Promise<import("mongoose").Document<unknown, {}, Config, {}, import("mongoose").DefaultSchemaOptions> & Config & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}

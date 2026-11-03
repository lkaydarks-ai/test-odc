import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
export declare enum ConfigStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare class Config {
    key: string;
    value: Record<string, any>;
    status: ConfigStatus;
    createdAt?: Date;
    updatedAt?: Date;
}
export type ConfigDocument = HydratedDocument<Config>;
export declare const ConfigSchema: MongooseSchema<Config, import("mongoose").Model<Config, any, any, any, any, any, Config & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Config, import("mongoose").Document<unknown, {}, Config, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Config & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    key?: import("mongoose").SchemaDefinitionProperty<string, Config, import("mongoose").Document<unknown, {}, Config, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Config & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    value?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, Config, import("mongoose").Document<unknown, {}, Config, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Config & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<ConfigStatus, Config, import("mongoose").Document<unknown, {}, Config, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Config & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Config, import("mongoose").Document<unknown, {}, Config, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Config & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    updatedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Config, import("mongoose").Document<unknown, {}, Config, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Config & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Config>;

import { ConfigStatus } from '../schemas/config.schema';
export declare class CreateConfigurationDto {
    key: string;
    value: Record<string, any>;
    status?: ConfigStatus;
}

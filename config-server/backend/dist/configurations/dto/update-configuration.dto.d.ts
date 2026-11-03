import { ConfigStatus } from '../schemas/config.schema';
export declare class UpdateConfigurationDto {
    value?: Record<string, any>;
    status?: ConfigStatus;
}

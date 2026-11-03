export type ConfigStatus = 'active' | 'inactive';

// Ce que renvoie le backend
export interface Configuration {
  _id: string;
  key: string;
  value: Record<string, unknown>;
  status: ConfigStatus;
  createdAt: string;
  updatedAt: string;
}

// Ce qu'on envoie pour créer
export interface CreateConfigurationPayload {
  key: string;
  value: Record<string, unknown>;
  status?: ConfigStatus;
}

// Ce qu'on envoie pour modifier (la clé n'est pas modifiable)
export interface UpdateConfigurationPayload {
  value?: Record<string, unknown>;
  status?: ConfigStatus;
}
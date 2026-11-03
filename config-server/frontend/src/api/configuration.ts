import axios from 'axios';
import type {
  Configuration,
  CreateConfigurationPayload,
  UpdateConfigurationPayload,
} from '../types/configurations';

// Instance Axios pointant vers le backend NestJS
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
});

export const getConfigurations = async (): Promise<Configuration[]> => {
  const { data } = await api.get<Configuration[]>('/configurations');
  return data;
};

export const getConfiguration = async (key: string): Promise<Configuration> => {
  // encodeURIComponent protège les caractères spéciaux dans l'URL
  const { data } = await api.get<Configuration>(
    `/configurations/${encodeURIComponent(key)}`,
  );
  return data;
};

export const createConfiguration = async (
  payload: CreateConfigurationPayload,
): Promise<Configuration> => {
  const { data } = await api.post<Configuration>('/configurations', payload);
  return data;
};

export const updateConfiguration = async (
  key: string,
  payload: UpdateConfigurationPayload,
): Promise<Configuration> => {
  const { data } = await api.patch<Configuration>(
    `/configurations/${encodeURIComponent(key)}`,
    payload,
  );
  return data;
};

export const deleteConfiguration = async (key: string): Promise<void> => {
  await api.delete(`/configurations/${encodeURIComponent(key)}`);
};
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export type ExpiryStatus = 'CRITICAL' | 'WARNING' | 'HEALTHY';

export interface Item {
  id: number;
  name: string;
  category: string;
  expiry_date?: string;
  expiry_status: ExpiryStatus;
  quantity: number;
  unit: string;
  min_quantity: number;
  amount_to_buy: number;
  on_shopping_list: boolean;
  box_id: number;
}

export interface Box {
  id: number;
  number: string;
  uuid: string;
  location_id: number;
  items?: Item[];
}

export interface Location {
  id: number;
  name: string;
  description?: string;
  boxes?: Box[];
}

export const getLocations = async (): Promise<Location[]> => {
  const { data } = await api.get('/locations/');
  return data;
};

export const getBoxes = async (): Promise<Box[]> => {
  const { data } = await api.get('/boxes/');
  return data;
};

export const getBoxByUuid = async (uuid: string): Promise<Box> => {
  const { data } = await api.get(`/boxes/by-uuid/${uuid}`);
  return data;
};

export const getItems = async (): Promise<Item[]> => {
  const { data } = await api.get('/items/');
  return data;
};

export const getShoppingList = async (grouped: boolean = false): Promise<Item[] | Record<string, Item[]>> => {
  const { data } = await api.get('/shopping-list', { params: { grouped } });
  return data;
};

export const purchaseItem = async (itemId: number, amount?: number): Promise<Item> => {
  const { data } = await api.post(`/shopping-list/purchase/${itemId}`, null, { params: { amount } });
  return data;
};

export const getExpirySummary = async (): Promise<Item[]> => {
  const { data } = await api.get('/dashboard/expiry-summary');
  return data;
};

export const downloadEmergencyLedger = async () => {
  const response = await api.get('/reports/inventory-pdf', {
    responseType: 'blob',
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `emergency_ledger_${new Date().toISOString().split('T')[0]}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const consumeItem = async (itemId: number, amount: number, addToList: boolean = true): Promise<Item> => {
  const { data } = await api.post(`/items/${itemId}/consume?amount=${amount}&add_to_list=${addToList}`);
  return data;
};

export default api;

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

export interface Weapon {
  id: number;
  model: string;
  type: string;
  caliber: string;
  serial_number: string;
  purchase_date?: string;
  last_cleaned: string;
  days_since_cleaning: number;
  status: string;
}

export interface Ammunition {
  id: number;
  caliber: string;
  brand: string;
  type: string;
  quantity: number;
  batch_number?: string;
  location_id: number;
}

export interface ArsenalStats {
  caliber: string;
  total_quantity: number;
  is_critical: boolean;
}

export interface Shelter {
  id: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
  capacity: number;
  water_source: boolean;
  heat_source: boolean;
  notes?: string;
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

// Locations
export const getLocations = async (): Promise<Location[]> => {
  const { data } = await api.get('/locations/');
  return data;
};

export const createLocation = async (location: Omit<Location, 'id'>): Promise<Location> => {
  const { data } = await api.post('/locations/', location);
  return data;
};

// Boxes
export const getBoxes = async (): Promise<Box[]> => {
  const { data } = await api.get('/boxes/');
  return data;
};

export const createBox = async (box: Omit<Box, 'id' | 'uuid'>): Promise<Box> => {
  const { data } = await api.post('/boxes/', box);
  return data;
};

export const getBoxByUuid = async (uuid: string): Promise<Box> => {
  const { data } = await api.get(`/boxes/by-uuid/${uuid}`);
  return data;
};

// Items
export const getItems = async (): Promise<Item[]> => {
  const { data } = await api.get('/items/');
  return data;
};

export const createItem = async (item: Omit<Item, 'id' | 'expiry_status' | 'amount_to_buy' | 'on_shopping_list'>): Promise<Item> => {
  const { data } = await api.post('/items/', item);
  return data;
};

export const consumeItem = async (itemId: number, amount: number, addToList: boolean = true): Promise<Item> => {
  const { data } = await api.post(`/items/${itemId}/consume?amount=${amount}&add_to_list=${addToList}`);
  return data;
};

// Arsenal
export const getWeapons = async (): Promise<Weapon[]> => {
  const { data } = await api.get('/arsenal/weapons');
  return data;
};

export const createWeapon = async (weapon: Omit<Weapon, 'id' | 'last_cleaned' | 'days_since_cleaning'>): Promise<Weapon> => {
  const { data } = await api.post('/arsenal/weapons', weapon);
  return data;
};

export const cleanWeapon = async (weaponId: number): Promise<Weapon> => {
  const { data } = await api.post(`/arsenal/weapons/${weaponId}/clean`);
  return data;
};

export const getAmmunition = async (): Promise<Ammunition[]> => {
  const { data } = await api.get('/arsenal/ammunition');
  return data;
};

export const createAmmunition = async (ammo: Omit<Ammunition, 'id'>): Promise<Ammunition> => {
  const { data } = await api.post('/arsenal/ammunition', ammo);
  return data;
};

export const getArsenalStats = async (): Promise<ArsenalStats[]> => {
  const { data } = await api.get('/arsenal/stats');
  return data;
};

// Shelters
export const getShelters = async (): Promise<Shelter[]> => {
  const { data } = await api.get('/shelters');
  return data;
};

export const createShelter = async (shelter: Omit<Shelter, 'id'>): Promise<Shelter> => {
  const { data } = await api.post('/shelters', shelter);
  return data;
};

export const updateShelter = async (id: number, shelter: Omit<Shelter, 'id'>): Promise<Shelter> => {
  const { data } = await api.put(`/shelters/${id}`, shelter);
  return data;
};

export const deleteShelter = async (id: number): Promise<void> => {
  await api.delete(`/shelters/${id}`);
};

// Shopping List
export const getShoppingList = async (grouped: boolean = false): Promise<Item[] | Record<string, Item[]>> => {
  const { data } = await api.get('/shopping-list', { params: { grouped } });
  return data;
};

export const purchaseItem = async (itemId: number, amount?: number): Promise<Item> => {
  const { data } = await api.post(`/shopping-list/purchase/${itemId}`, null, { params: { amount } });
  return data;
};

// Dashboard / Reports
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

export default api;

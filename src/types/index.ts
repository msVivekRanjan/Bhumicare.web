export type SensorData = {
  soilMoisture: number;
  lightLevel: number;
  gasLevel: number;
  temperature: number;
  humidity: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  timestamp: number;
};

export type Alert = {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
};

export type Language = 'en' | 'hi' | 'or' | 'bn';

export type Translations = {
  [key: string]: string;
};

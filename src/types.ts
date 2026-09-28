export interface GasStationAmenity {
  has7Eleven?: boolean;
  hasCafeAmazon?: boolean;
  hasInthanin?: boolean;
  hasEVCharger?: boolean;
  hasFoodCourt?: boolean;
  hasCleanToilet?: boolean;
  hasAirPump?: boolean;
  has24Hour?: boolean;
  hasAtm?: boolean;
  hasKfcOrMcdonalds?: boolean;
}

export type BrandType = 'PTT' | 'Bangchak' | 'Shell' | 'Caltex' | 'PT' | 'Susco' | 'Other';

export interface GasStation {
  id: string;
  name: string;
  brand: BrandType;
  location: string;
  highwayNumber: string;
  kmFromStart: number;
  coordinates: [number, number]; // [lat, lng]
  amenities: GasStationAmenity;
  recommendedFor: string;
  highlights?: string[];
  googleMapsQuery?: string;
}

export interface RestStop {
  id: string;
  name: string;
  stationId?: string;
  brand?: BrandType;
  location: string;
  highwayNumber: string;
  kmFromStart: number;
  driveTimeFromPrevMin: number;
  durationMinutes: number; // e.g. 15, 30, 45, 60
  activity: string; // e.g., "เข้าห้องน้ำ + กาแฟ", "พักทานอาหารกลางวัน", "เติมน้ำมัน + เช็คลมยาง"
  coordinates: [number, number];
  isMandatorySafetyStop?: boolean;
  notes?: string;
  amenities?: GasStationAmenity;
}

export interface RouteOption {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  description: string;
  isShortest: boolean;
  isRecommended: boolean;
  totalDistanceKm: number;
  baseDriveTimeMinutes: number; // driving without rest
  highways: string[];
  keyWaypoints: string[];
  mountainSections: string[];
  defaultStops: RestStop[];
  gasStationsList: GasStation[];
  routeCoordinates: [number, number][]; // polyline coordinates
}

export interface VehicleSetting {
  type: 'sedan' | 'suv' | 'pickup' | 'van' | 'ev' | 'motorcycle';
  name: string;
  fuelType: 'gasohol95' | 'gasohol91' | 'e20' | 'diesel' | 'ev_kwh';
  fuelPricePerUnit: number; // Baht per liter or per kWh
  consumptionRate: number; // km/L or km/kWh
}

export interface AiAnalysisResult {
  summary: string;
  safetyTips: string[];
  recommendedStopsRationale: string;
  fuelStrategy: string;
  foodRecommendations: string[];
  emergencyAdvice?: string;
}

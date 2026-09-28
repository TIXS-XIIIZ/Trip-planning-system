import { RestStop, RouteOption, VehicleSetting } from '../types';

export interface CalculatedLeg {
  fromName: string;
  toName: string;
  departureTimeStr: string;
  arrivalTimeStr: string;
  driveTimeMinutes: number;
  stopDurationMinutes: number;
  cumulativeDistanceKm: number;
  legDistanceKm: number;
  activity?: string;
  isDestination?: boolean;
  isOrigin?: boolean;
  stopObject?: RestStop;
  isNightDriving?: boolean;
  safetyAlert?: string;
}

export interface CalculatedTrip {
  departureTime: string; // e.g. "06:00"
  arrivalTime: string; // e.g. "15:45"
  totalDriveMinutes: number;
  totalRestMinutes: number;
  totalDurationMinutes: number;
  totalDistanceKm: number;
  legs: CalculatedLeg[];
  fuelCostBaht: number;
  fuelUnitsUsed: number;
  safetyScore: number; // 0 - 100
  safetyWarnings: string[];
}

// Convert "HH:mm" to total minutes from 00:00
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 20 * 60; // default 20:00
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr || '20', 10);
  const m = parseInt(mStr || '0', 10);
  return h * 60 + m;
}

// Convert total minutes to "HH:mm น."
export function formatMinutesToTime(totalMinutes: number): string {
  const normalized = ((totalMinutes % (24 * 60)) + (24 * 60)) % (24 * 60);
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} น.`;
}

// Format duration into readable Thai text (e.g. "8 ชม. 35 นาที")
export function formatDurationThai(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} นาที`;
  if (m === 0) return `${h} ชม.`;
  return `${h} ชม. ${m} นาที`;
}

export function calculateTripDetails(
  route: RouteOption,
  stops: RestStop[],
  departureTime: string,
  vehicle: VehicleSetting,
  originName: string,
  destinationName: string,
  destinationCoordinates: [number, number]
): CalculatedTrip {
  const startMinutes = parseTimeToMinutes(departureTime);
  let currentMinutes = startMinutes;
  let prevKm = 0;
  const legs: CalculatedLeg[] = [];
  const safetyWarnings: string[] = [];

  let totalRestMinutes = 0;

  // Origin Leg entry
  legs.push({
    fromName: originName,
    toName: stops.length > 0 ? stops[0].name : destinationName,
    departureTimeStr: formatMinutesToTime(currentMinutes),
    arrivalTimeStr: formatMinutesToTime(currentMinutes),
    driveTimeMinutes: 0,
    stopDurationMinutes: 0,
    cumulativeDistanceKm: 0,
    legDistanceKm: 0,
    isOrigin: true,
    activity: "เริ่มต้นออกเดินทางจาก บิ๊กซี ลำพูน",
  });

  // Calculate each stop leg
  stops.forEach((stop, index) => {
    const legDistance = Math.max(1, stop.kmFromStart - prevKm);
    const driveTime = stop.driveTimeFromPrevMin || Math.round((legDistance / 75) * 60); // approx 75 km/h avg
    const legDepartureMinutes = currentMinutes;
    const legArrivalMinutes = legDepartureMinutes + driveTime;
    
    // Check night driving or long duration safety
    const arrivalHour = Math.floor((legArrivalMinutes % (24 * 60)) / 60);
    const isNight = arrivalHour >= 19 || arrivalHour < 5;

    let alert: string | undefined;
    if (driveTime > 150) {
      alert = `ขับขี่ยาวนานเกิน 2.5 ชม. (${formatDurationThai(driveTime)}) ควรระวังความง่วงสะสม`;
      safetyWarnings.push(`ช่วงก่อนถึง ${stop.name} ขับขี่ยาวนานเกิน 2.5 ชม.`);
    }

    currentMinutes = legArrivalMinutes + stop.durationMinutes;
    totalRestMinutes += stop.durationMinutes;

    legs.push({
      fromName: index === 0 ? originName : stops[index - 1].name,
      toName: stop.name,
      departureTimeStr: formatMinutesToTime(legDepartureMinutes),
      arrivalTimeStr: formatMinutesToTime(legArrivalMinutes),
      driveTimeMinutes: driveTime,
      stopDurationMinutes: stop.durationMinutes,
      cumulativeDistanceKm: stop.kmFromStart,
      legDistanceKm: legDistance,
      activity: stop.activity,
      stopObject: stop,
      isNightDriving: isNight,
      safetyAlert: alert,
    });

    prevKm = stop.kmFromStart;
  });

  // Final leg to Destination
  const finalLegDistance = Math.max(1, route.totalDistanceKm - prevKm);
  const finalDriveTime = Math.round((finalLegDistance / 75) * 60);
  const finalDepartureMinutes = currentMinutes;
  const finalArrivalMinutes = finalDepartureMinutes + finalDriveTime;

  const destArrivalHour = Math.floor((finalArrivalMinutes % (24 * 60)) / 60);
  const isDestNight = destArrivalHour >= 19 || destArrivalHour < 5;

  let finalAlert: string | undefined;
  if (finalDriveTime > 150) {
    finalAlert = `ช่วงสุดท้ายขับขี่ยาวนาน ${formatDurationThai(finalDriveTime)} แนะนำเพิ่มจุดแวะพัก`;
    safetyWarnings.push("ช่วงสุดท้ายก่อนถึงจุดหมายขับติดต่อกันนานเกิน 2.5 ชม.");
  }

  legs.push({
    fromName: stops.length > 0 ? stops[stops.length - 1].name : originName,
    toName: destinationName,
    departureTimeStr: formatMinutesToTime(finalDepartureMinutes),
    arrivalTimeStr: formatMinutesToTime(finalArrivalMinutes),
    driveTimeMinutes: finalDriveTime,
    stopDurationMinutes: 0,
    cumulativeDistanceKm: route.totalDistanceKm,
    legDistanceKm: finalLegDistance,
    isDestination: true,
    activity: "ถึงจุดหมายปลายทาง ศูนย์ฝึกอบรมตำรวจภูธรภาค 3 (จอหอ โคราช)",
    isNightDriving: isDestNight,
    safetyAlert: finalAlert,
  });

  const totalDriveMinutes = legs.reduce((acc, l) => acc + l.driveTimeMinutes, 0);
  const totalDurationMinutes = totalDriveMinutes + totalRestMinutes;

  // Fuel calculation
  const fuelUnitsUsed = Number((route.totalDistanceKm / vehicle.consumptionRate).toFixed(1));
  const fuelCostBaht = Math.round(fuelUnitsUsed * vehicle.fuelPricePerUnit);

  // Safety Score calculation (out of 100)
  let safetyScore = 100;
  if (stops.length < 2) safetyScore -= 25;
  if (totalRestMinutes < 45) safetyScore -= 15;
  legs.forEach((l) => {
    if (l.driveTimeMinutes > 150) safetyScore -= 10;
    if (l.isNightDriving) safetyScore -= 5;
  });
  safetyScore = Math.max(40, Math.min(100, safetyScore));

  return {
    departureTime: formatMinutesToTime(startMinutes),
    arrivalTime: formatMinutesToTime(finalArrivalMinutes),
    totalDriveMinutes,
    totalRestMinutes,
    totalDurationMinutes,
    totalDistanceKm: route.totalDistanceKm,
    legs,
    fuelCostBaht,
    fuelUnitsUsed,
    safetyScore,
    safetyWarnings,
  };
}

// Generate Google Maps Navigation URL with waypoints
export function generateGoogleMapsNavigationUrl(
  originCoords: [number, number],
  destCoords: [number, number],
  stops: RestStop[]
): string {
  const originStr = `${originCoords[0]},${originCoords[1]}`;
  const destStr = `${destCoords[0]},${destCoords[1]}`;
  
  if (stops.length === 0) {
    return `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destStr}&travelmode=driving`;
  }

  const waypoints = stops.map(s => `${s.coordinates[0]},${s.coordinates[1]}`).join('|');
  return `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destStr}&waypoints=${encodeURIComponent(waypoints)}&travelmode=driving`;
}

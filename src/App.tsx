/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ROUTE_OPTIONS, 
  DEFAULT_VEHICLE_SETTINGS, 
  ORIGIN_INFO, 
  DESTINATION_INFO 
} from './data/routeData';
import { RouteOption, RestStop, GasStation, VehicleSetting } from './types';
import { calculateTripDetails, generateGoogleMapsNavigationUrl } from './utils/tripCalculator';
import { Navbar } from './components/Navbar';
import { TripSummaryBanner } from './components/TripSummaryBanner';
import { RouteSelector } from './components/RouteSelector';
import { TimelineView } from './components/TimelineView';
import { GasStationDirectory } from './components/GasStationDirectory';
import { MapInteractive } from './components/MapInteractive';
import { SafetyAndCostSection } from './components/SafetyAndCostSection';
import { AiAssistantModal } from './components/AiAssistantModal';
import { PrintReportModal } from './components/PrintReportModal';
import { StationPickerModal } from './components/StationPickerModal';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Sparkles, 
  Navigation, 
  Fuel, 
  ShieldCheck, 
  ExternalLink, 
  MapPin, 
  Share2, 
  Clock,
  Plus
} from 'lucide-react';

export default function App() {
  // 1. Core State
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>(ROUTE_OPTIONS[0]); // Default to shortest route
  const [departureTime, setDepartureTime] = useState<string>('20:00');
  const [stops, setStops] = useState<RestStop[]>(ROUTE_OPTIONS[0].defaultStops);
  const [vehicle, setVehicle] = useState<VehicleSetting>(DEFAULT_VEHICLE_SETTINGS[0]);
  const [activeTab, setActiveTab] = useState<'timeline' | 'map' | 'stations' | 'safety' | 'cost'>('map');

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isStationPickerOpen, setIsStationPickerOpen] = useState(false);
  const [pickerInsertKm, setPickerInsertKm] = useState<number | undefined>(undefined);
  const [shareCopied, setShareCopied] = useState(false);

  // 2. Computed Trip Details
  const trip = useMemo(() => {
    return calculateTripDetails(
      selectedRoute,
      stops,
      departureTime,
      vehicle,
      ORIGIN_INFO.name,
      DESTINATION_INFO.name,
      DESTINATION_INFO.coordinates
    );
  }, [selectedRoute, stops, departureTime, vehicle]);

  // Google Maps navigation link with all stops as waypoints
  const googleMapsNavUrl = useMemo(() => {
    return generateGoogleMapsNavigationUrl(
      ORIGIN_INFO.coordinates,
      DESTINATION_INFO.coordinates,
      stops
    );
  }, [stops]);

  // 3. Handlers
  const handleSelectRoute = (newRoute: RouteOption) => {
    setSelectedRoute(newRoute);
    setStops(newRoute.defaultStops);
  };

  const handleResetStops = () => {
    setStops(selectedRoute.defaultStops);
  };

  const handleOpenPicker = (insertKm?: number) => {
    setPickerInsertKm(insertKm);
    setIsStationPickerOpen(true);
  };

  const handleAddStationToStops = (station: GasStation, durationMinutes: number = 20) => {
    const newStop: RestStop = {
      id: `stop-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      stationId: station.id,
      name: station.name,
      brand: station.brand,
      location: station.location,
      highwayNumber: station.highwayNumber,
      kmFromStart: station.kmFromStart,
      driveTimeFromPrevMin: 60, // will be auto-calculated
      durationMinutes: durationMinutes,
      activity: "เข้าห้องน้ำ + เติมน้ำมัน / กาแฟ",
      coordinates: station.coordinates,
      amenities: station.amenities,
    };

    // Insert sorted by kmFromStart
    const updated = [...stops, newStop].sort((a, b) => a.kmFromStart - b.kmFromStart);
    setStops(updated);
  };

  const handleAddCustomStop = (customStop: RestStop) => {
    const updated = [...stops, customStop].sort((a, b) => a.kmFromStart - b.kmFromStart);
    setStops(updated);
  };

  const handleRemoveStationFromStops = (stationId: string) => {
    setStops(stops.filter(s => s.stationId !== stationId && s.id !== stationId));
  };

  const handleSharePlan = () => {
    const text = `แผนเดินทาง ลำพูน ➔ โคราช (${selectedRoute.title.split(':')[0]})
ระยะทาง: ${trip.totalDistanceKm} กม.
ออกเดินทาง: ${trip.departureTime}
ถึงเป้าหมาย: ${trip.arrivalTime}
จุดพักรถ: ${stops.length} จุด (${stops.length > 0 ? stops.map(s => s.name.split('(')[0]).join(', ') : 'ไม่มีจุดพัก'})
ลิงก์นำทาง GPS: ${googleMapsNavUrl}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
      } catch (e) {
        // silent fallback
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* 1. Navigation Header */}
      <Navbar
        departureTime={departureTime}
        onDepartureTimeChange={setDepartureTime}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onOpenPrintReport={() => setIsPrintModalOpen(true)}
        googleMapsUrl={googleMapsNavUrl}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 2. Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8">
        
        {/* Summary Metric Cards */}
        <TripSummaryBanner
          trip={trip}
          route={selectedRoute}
          vehicle={vehicle}
          onOpenAiModal={() => setIsAiModalOpen(true)}
          stopsCount={stops.length}
        />

        {/* Route Selector (3 Options comparison) */}
        <RouteSelector
          selectedRouteId={selectedRoute.id}
          onSelectRoute={handleSelectRoute}
        />

        {/* Quick Share / Export Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs mb-6 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <Navigation className="w-4 h-4 text-blue-600" />
              การนำทางจริง:
            </span>
            <span className="text-slate-600 hidden sm:inline">
              คลิกเปิด Google Maps เพื่อเริ่มระบบนำทาง Turn-by-turn บนมือถือพร้อมจุดแวะทุกจุด ({stops.length} จุดพัก)
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => handleOpenPicker()}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-colors border border-blue-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ เพิ่มจุดพัก</span>
            </button>

            <button
              onClick={handleSharePlan}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{shareCopied ? "คัดลอกสรุปแล้ว! ✓" : "แชร์สรุปทริป"}</span>
            </button>

            <a
              href={googleMapsNavUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-xs transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>เปิด GPS บน Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <TimelineView
              trip={trip}
              route={selectedRoute}
              stops={stops}
              onUpdateStops={setStops}
              onResetStops={handleResetStops}
              onOpenStationPicker={handleOpenPicker}
            />
            {/* Embedded Map for visual context */}
            <MapInteractive
              route={selectedRoute}
              stops={stops}
              gasStations={selectedRoute.gasStationsList}
              onAddStation={(st) => handleAddStationToStops(st)}
              onRemoveStop={handleRemoveStationFromStops}
            />
          </div>
        )}

        {activeTab === 'map' && (
          <div className="space-y-6">
            <MapInteractive
              route={selectedRoute}
              stops={stops}
              gasStations={selectedRoute.gasStationsList}
              onAddStation={(st) => handleAddStationToStops(st)}
              onRemoveStop={handleRemoveStationFromStops}
            />
            <TimelineView
              trip={trip}
              route={selectedRoute}
              stops={stops}
              onUpdateStops={setStops}
              onResetStops={handleResetStops}
              onOpenStationPicker={handleOpenPicker}
            />
          </div>
        )}

        {activeTab === 'stations' && (
          <GasStationDirectory
            gasStations={selectedRoute.gasStationsList}
            currentStops={stops}
            onAddStationToStops={handleAddStationToStops}
            onRemoveStationFromStops={handleRemoveStationFromStops}
          />
        )}

        {activeTab === 'safety' && (
          <SafetyAndCostSection
            vehicle={vehicle}
            onVehicleChange={setVehicle}
            route={selectedRoute}
            totalDistanceKm={trip.totalDistanceKm}
          />
        )}

        {activeTab === 'cost' && (
          <SafetyAndCostSection
            vehicle={vehicle}
            onVehicleChange={setVehicle}
            route={selectedRoute}
            totalDistanceKm={trip.totalDistanceKm}
          />
        )}

      </main>

      {/* 3. Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-slate-200 text-sm mb-1">
              ระบบวางแผนการเดินทาง & สรุปจุดพักรถ ลำพูน ➔ นครราชสีมา (จอหอ)
            </div>
            <p className="text-slate-500">
              อ้างอิงพิกัดปลายทางจริง ศูนย์ฝึกอบรมตำรวจภูธรภาค 3 ต.จอหอ จ.นครราชสีมา (ตาม Google Maps ลิงก์ที่ระบุ)
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              พิมพ์รายงานสรุป
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="hover:text-purple-300 text-purple-400 font-semibold transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> วิเคราะห์ด้วย AI
            </button>
            <span>•</span>
            <a
              href={DESTINATION_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              Google Maps ปลายทาง
            </a>
          </div>
        </div>
      </footer>

      {/* 4. Modals */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        trip={trip}
        route={selectedRoute}
        vehicle={vehicle}
        stops={stops}
      />

      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        trip={trip}
        route={selectedRoute}
        vehicle={vehicle}
        stops={stops}
      />

      <StationPickerModal
        isOpen={isStationPickerOpen}
        onClose={() => setIsStationPickerOpen(false)}
        gasStations={selectedRoute.gasStationsList}
        currentStops={stops}
        onAddStation={handleAddStationToStops}
        onAddCustomStop={handleAddCustomStop}
        defaultInsertKm={pickerInsertKm}
      />

    </div>
  );
}

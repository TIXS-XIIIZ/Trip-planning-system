import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RouteOption, RestStop, GasStation } from '../types';
import { CalculatedTrip, formatDurationThai } from '../utils/tripCalculator';
import { DESTINATION_INFO, ORIGIN_INFO, ROUTE_OPTIONS } from '../data/routeData';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Fuel, 
  Clock, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight,
  Route,
  Menu,
  ChevronDown
} from 'lucide-react';

interface StandaloneMapPageProps {
  selectedRoute: RouteOption;
  onSelectRoute: (route: RouteOption) => void;
  stops: RestStop[];
  trip: CalculatedTrip;
  googleMapsNavUrl: string;
  onAddStation: (station: GasStation) => void;
  onRemoveStop: (stopId: string) => void;
  onGoToFullView: () => void;
  filterBrand: string;
  onFilterBrandChange: (brand: string) => void;
  onOpenMobileMenu: () => void;
}

export const StandaloneMapPage: React.FC<StandaloneMapPageProps> = ({
  selectedRoute,
  onSelectRoute,
  stops,
  trip,
  googleMapsNavUrl,
  onAddStation,
  onRemoveStop,
  onGoToFullView,
  filterBrand,
  onFilterBrandChange,
  onOpenMobileMenu,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);

  const [notification, setNotification] = useState<{ message: string; type: 'add' | 'remove' } | null>(null);

  const brands = ['All', ...Array.from(new Set(selectedRoute.gasStationsList.map(s => s.brand)))];

  // Count available gas stations after filtering
  const filteredGasStations = filterBrand === 'All' 
    ? selectedRoute.gasStationsList 
    : selectedRoute.gasStationsList.filter(s => s.brand === filterBrand);

  const showNotification = (message: string, type: 'add' | 'remove') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 2800);
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map if not exists
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [16.8, 100.5],
        zoom: 7,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      markersGroupRef.current = L.featureGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    // Clear previous layers
    markersGroup.clearLayers();

    // 1. Draw Fallback Route Polyline (dashed)
    const fallbackPolyline = L.polyline(selectedRoute.routeCoordinates, {
      color: '#94a3b8',
      weight: 4,
      opacity: 0.5,
      dashArray: '8, 8',
    }).addTo(markersGroup);

    // Fetch Real Road Coordinates from OSRM
    let isMounted = true;
    const fetchRealRoute = async () => {
      try {
        const coordsString = selectedRoute.routeCoordinates.map(coord => `${coord[1]},${coord[0]}`).join(';');
        const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error('OSRM network error');
        
        const data = await res.json();
        if (data.code === 'Ok' && isMounted) {
          const geoJsonCoords = data.routes[0].geometry.coordinates;
          const leafletCoords = geoJsonCoords.map((coord: [number, number]) => [coord[1], coord[0]]);
          
          if (markersGroup.hasLayer(fallbackPolyline)) {
            markersGroup.removeLayer(fallbackPolyline);
          }
          
          L.polyline(leafletCoords, {
            color: '#2563eb', // Blue-600
            weight: 5,
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round',
            dashArray: selectedRoute.isShortest ? undefined : '8, 8',
          }).addTo(markersGroup);
        }
      } catch (e) {
        if (isMounted) {
          fallbackPolyline.setStyle({
            color: '#2563eb',
            weight: 5,
            opacity: 0.9,
            dashArray: selectedRoute.isShortest ? undefined : '8, 8',
          });
        }
      }
    };
    
    fetchRealRoute();

    // 2. Custom Icons
    const originIcon = L.divIcon({
      className: 'custom-pin',
      html: `
        <div style="background-color: #059669; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.35);">
          🏁
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    const destIcon = L.divIcon({
      className: 'custom-pin',
      html: `
        <div style="background-color: #e11d48; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 15px; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.35);">
          🎯
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    // Add Origin Marker (Big C Lamphun)
    L.marker(ORIGIN_INFO.coordinates, { icon: originIcon })
      .bindPopup(`
        <div style="padding: 4px; font-family: system-ui, sans-serif; min-width: 200px;">
          <div style="font-size: 11px; font-weight: bold; color: #059669; text-transform: uppercase;">จุดเริ่มต้น (กม. 0)</div>
          <div style="font-size: 14px; font-weight: bold; color: #0f172a; margin-top: 2px;">${ORIGIN_INFO.name}</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 2px;">${ORIGIN_INFO.address}</div>
          <div style="font-size: 11px; color: #059669; margin-top: 4px; font-weight: 600;">ออกเดินทาง: ${trip.departureTime}</div>
        </div>
      `)
      .addTo(markersGroup);

    // Add Destination Marker (ศฝร.ภ.3 นครราชสีมา)
    L.marker(DESTINATION_INFO.coordinates, { icon: destIcon })
      .bindPopup(`
        <div style="padding: 4px; font-family: system-ui, sans-serif; min-width: 220px;">
          <div style="font-size: 11px; font-weight: bold; color: #e11d48; text-transform: uppercase;">จุดหมายปลายทาง (กม. ${selectedRoute.totalDistanceKm})</div>
          <div style="font-size: 14px; font-weight: bold; color: #0f172a; margin-top: 2px;">${DESTINATION_INFO.name}</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 2px;">${DESTINATION_INFO.address} (ต.จอหอ)</div>
          <div style="font-size: 11px; color: #e11d48; margin-top: 4px; font-weight: 600;">ถึงโดยประมาณ: ${trip.arrivalTime}</div>
          <div style="margin-top: 6px; padding-top: 4px; border-top: 1px solid #e2e8f0;">
            <a href="${DESTINATION_INFO.googleMapsUrl}" target="_blank" style="font-size: 11px; color: #2563eb; text-decoration: underline; font-weight: bold;">เปิดดูพิกัด Google Maps จริง ↗</a>
          </div>
        </div>
      `)
      .addTo(markersGroup);

    // 3. Add Rest Stops Markers
    stops.forEach((stop, index) => {
      const stopIcon = L.divIcon({
        className: 'custom-pin',
        html: `
          <div style="background-color: #2563eb; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; border: 2.5px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3);">
            ${index + 1}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker(stop.coordinates, { icon: stopIcon }).addTo(markersGroup);
      
      const is24Hr = stop.amenities?.has24Hour ? '<div style="font-size: 10px; color: #fff; background: #1e293b; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 4px; margin-bottom: 2px; font-weight: bold;">24 ชม.</div>' : '';

      marker.bindPopup(`
        <div style="padding: 4px; font-family: system-ui, sans-serif; min-width: 220px;">
          <div style="font-size: 11px; font-weight: bold; color: #2563eb;">จุดพักที่ ${index + 1} (กม. ${stop.kmFromStart})</div>
          <div style="font-size: 13px; font-weight: bold; color: #0f172a; margin-top: 2px;">${stop.name}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${stop.location} (${stop.highwayNumber})</div>
          ${is24Hr}
          <div style="font-size: 12px; color: #059669; font-weight: bold; margin-top: 4px;">⏱ แผนพัก: ${stop.durationMinutes} นาที</div>
          <div style="font-size: 11px; color: #334155; margin-top: 2px;">กิจกรรม: ${stop.activity}</div>
          <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; color: #2563eb; font-weight: bold;">อยู่ในแผนพัก ✓</span>
            <button class="btn-popup-remove-stop" data-stop-id="${stop.id}" style="background-color: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 6px; cursor: pointer;">
              ลบจุดนี้
            </button>
          </div>
        </div>
      `);
    });

    // 4. Add Available Gas Stations Pins
    filteredGasStations.forEach((station) => {
      const isAlreadyStop = stops.some(s => s.stationId === station.id || s.name === station.name);
      if (isAlreadyStop) return;

      const stationIcon = L.divIcon({
        className: 'custom-pin',
        html: `
          <div style="background-color: #475569; color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; border: 1.5px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.25);">
            ⛽
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker(station.coordinates, { icon: stationIcon }).addTo(markersGroup);

      const is24Hr = station.amenities?.has24Hour ? '<div style="font-size: 10px; color: #fff; background: #1e293b; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 4px; font-weight: bold;">24 ชม.</div>' : '';

      marker.bindPopup(`
        <div style="padding: 4px; font-family: system-ui, sans-serif; min-width: 220px;">
          <div style="font-size: 10px; font-weight: bold; color: #64748b;">${station.brand} Station (กม. ${station.kmFromStart})</div>
          <div style="font-size: 13px; font-weight: bold; color: #0f172a; margin-top: 1px;">${station.name}</div>
          <div style="font-size: 11px; color: #64748b;">${station.location} (${station.highwayNumber})</div>
          <div style="font-size: 11px; color: #0284c7; margin-top: 3px;">💡 ${station.recommendedFor}</div>
          ${is24Hr}
          <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #e2e8f0; text-align: right;">
            <button class="btn-popup-add-station" data-station-id="${station.id}" style="background-color: #2563eb; color: white; border: none; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 6px; cursor: pointer;">
              + เพิ่มเป็นจุดพักรถ
            </button>
          </div>
        </div>
      `);
    });

    // Fit map bounds to show complete route
    try {
      map.fitBounds(markersGroup.getBounds(), { padding: [30, 30] });
    } catch (e) {
      // safe fallback
    }

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    // Popup clicks delegation
    const container = mapContainerRef.current;
    const handlePopupClicks = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const addBtn = target.closest('.btn-popup-add-station') as HTMLElement;
      if (addBtn) {
        const stId = addBtn.getAttribute('data-station-id');
        const st = selectedRoute.gasStationsList.find(s => s.id === stId);
        if (st) {
          onAddStation(st);
          showNotification(`เพิ่ม "${st.name}" เป็นจุดพักรถเรียบร้อยแล้ว`, 'add');
          map.closePopup();
        }
      }

      const removeBtn = target.closest('.btn-popup-remove-stop') as HTMLElement;
      if (removeBtn) {
        const stopId = removeBtn.getAttribute('data-stop-id');
        if (stopId) {
          const removedStop = stops.find(s => s.id === stopId);
          onRemoveStop(stopId);
          showNotification(`ลบจุดพัก "${removedStop?.name || ''}" แล้ว`, 'remove');
          map.closePopup();
        }
      }
    };

    container.addEventListener('click', handlePopupClicks);

    return () => {
      isMounted = false;
      resizeObserver.disconnect();
      container.removeEventListener('click', handlePopupClicks);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectedRoute, stops, filterBrand]);

  const handleResetBounds = () => {
    if (mapInstanceRef.current && markersGroupRef.current) {
      try {
        mapInstanceRef.current.fitBounds(markersGroupRef.current.getBounds(), { padding: [30, 30] });
      } catch (e) {
        // safe fallback
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 sm:gap-4">
      {/* Toast Notification */}
      {notification && (
        <div 
          className={`fixed top-14 sm:top-20 right-4 sm:right-6 z-50 px-3.5 py-2 rounded-xl shadow-lg border text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all transform animate-bounce ${
            notification.type === 'add'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-rose-600 text-white border-rose-500'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Single Map Card Container */}
      <div id="standalone-map-card" className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-1.5 sm:p-4 lg:p-5 flex flex-col">
        
        {/* ======================================================== */}
        {/* DESKTOP TOP BAR (>= sm)                                 */}
        {/* ======================================================== */}
        <div className="hidden sm:flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Navigation className="w-5 h-5" />
              </span>
              <h2 className="text-base lg:text-lg font-bold text-slate-900 tracking-tight">
                แผนที่แสดงพิกัดเส้นทางจริง & จุดปั๊มน้ำมันตลอดสาย
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              โครงข่ายถนนจริง (OSRM) • ลำพูน ➔ ศฝร.ภ.3 จอหอ นครราชสีมา พร้อมจุดพักและปั๊มน้ำมัน
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter ปั๊มน้ำมัน Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
              <Fuel className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <label htmlFor="standalone-gas-filter" className="font-bold text-slate-700 whitespace-nowrap">
                กรองปั๊ม:
              </label>
              <select
                id="standalone-gas-filter"
                value={filterBrand}
                onChange={(e) => onFilterBrandChange(e.target.value)}
                className="text-xs border-0 bg-transparent text-slate-800 font-bold focus:outline-none focus:ring-0 p-0 cursor-pointer"
              >
                {brands.map(brand => (
                  <option key={brand} value={brand}>
                    {brand === 'All' ? `ทุกยี่ห้อ (${selectedRoute.gasStationsList.length})` : `ปั๊ม ${brand}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Google Maps GPS Navigation link */}
            <a
              href={googleMapsNavUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-xs transition-colors shrink-0"
              title="เปิด Google Maps นำทางจริงพร้อมจุดพักทุกจุด"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>เปิด GPS</span>
            </a>

            {/* Button to go to full details */}
            <button
              onClick={onGoToFullView}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors shrink-0"
              title="สลับไปดูตารางสรุปละเอียดและไทม์ไลน์"
            >
              <span>สรุปเต็ม</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* DESKTOP ROUTE SWITCHER STRIP (>= sm)                    */}
        {/* ======================================================== */}
        <div className="hidden sm:flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-2.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap mr-1 flex items-center gap-1">
              <Route className="w-3.5 h-3.5 text-blue-600" />
              เส้นทาง:
            </span>
            {ROUTE_OPTIONS.map((r) => {
              const isSelected = r.id === selectedRoute.id;
              return (
                <button
                  key={r.id}
                  onClick={() => onSelectRoute(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{r.title.split(':')[0]}</span>
                  <span className={`text-[10px] px-1 py-0.2 rounded ${
                    isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {r.totalDistanceKm} กม.
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
            <span className="inline-flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              {trip.departureTime} ➔ {trip.arrivalTime} ({formatDurationThai(trip.totalDurationMinutes)})
            </span>
            <span>•</span>
            <span className="font-bold text-blue-700">
              พัก {stops.length} จุด
            </span>
            <span>•</span>
            <span className="text-slate-500">
              ปั๊ม {filteredGasStations.length} แห่ง
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* DESKTOP LEGEND BAR (>= sm)                              */}
        {/* ======================================================== */}
        <div className="hidden sm:flex items-center justify-between gap-1 py-2 text-xs flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              🏁 ลำพูน
            </span>
            <span className="inline-flex items-center gap-0.5 font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              🔵 จุดพัก ({stops.length})
            </span>
            <span className="inline-flex items-center gap-0.5 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              ⛽ ปั๊ม
            </span>
            <span className="inline-flex items-center gap-0.5 font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              🎯 ศฝร.ภ.3
            </span>
          </div>

          <button
            onClick={handleResetBounds}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md font-semibold text-xs transition-colors"
            title="รีเซ็ตมุมมองให้เห็นตลอดสาย"
          >
            <RotateCcw className="w-3 h-3" />
            <span>จัดมุมมองทั้งสาย</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* MAP CANVAS (FULL HEIGHT ON MOBILE, IMMERSIVE)            */}
        {/* ======================================================== */}
        <div className="relative w-full h-[calc(100vh-120px)] sm:h-[650px] lg:h-[calc(100vh-230px)] min-h-[460px] rounded-lg sm:rounded-xl overflow-hidden border border-slate-200 shadow-inner z-0">
          
          {/* MOBILE FLOATING COMPACT CONTROL BAR (Directly on Map) */}
          <div className="sm:hidden absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between gap-1.5 pointer-events-none">
            {/* Current Route & Distance Pill -> Opens Drawer */}
            <button
              onClick={onOpenMobileMenu}
              className="pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-xs font-bold text-slate-900 flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              <Route className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate max-w-[150px]">
                {selectedRoute.title.split(':')[0].replace('เส้นทาง ', '')} ({selectedRoute.totalDistanceKm} กม.)
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 pointer-events-auto">
              {/* Reset View Button */}
              <button
                onClick={handleResetBounds}
                className="bg-white/95 backdrop-blur-md p-2 rounded-xl border border-slate-200 shadow-md text-slate-700 active:scale-95 transition-transform"
                title="จัดมุมมองทั้งสาย"
                aria-label="จัดมุมมองทั้งสาย"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* All-in-One Menu Button on Map */}
              <button
                onClick={onOpenMobileMenu}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl shadow-md text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform"
                aria-label="เปิดเมนูการจัดการทริป"
              >
                <Menu className="w-3.5 h-3.5" />
                <span>เมนู</span>
              </button>
            </div>
          </div>

          {/* Leaflet Map DOM Element */}
          <div
            id="standalone-leaflet-map-canvas"
            ref={mapContainerRef}
            className="w-full h-full"
          />

          {/* Floating bottom-right quick hint */}
          <div className="absolute bottom-2.5 right-2.5 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-300 shadow-xs text-[10px] text-slate-600 hidden sm:flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping inline-block" />
            <span>ถนนจริง OSRM</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* DESKTOP BOTTOM HELPER BAR (>= sm)                       */}
        {/* ======================================================== */}
        <div className="hidden sm:flex mt-2.5 pt-2.5 border-t border-slate-100 items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            💡 แตะหมุดปั๊มน้ำมัน ⛽ เพื่อกด <em>"+ เพิ่มเป็นจุดพักรถ"</em> หรือแตะหมุดเลข 🔵 เพื่อกด <em>"ลบจุดนี้"</em>
          </div>
          <div>
            <a
              href={DESTINATION_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-bold flex items-center gap-1"
            >
              <span>พิกัด ศฝร.ภ.3 บน Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

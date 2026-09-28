import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RouteOption, RestStop, GasStation } from '../types';
import { DESTINATION_INFO, ORIGIN_INFO } from '../data/routeData';
import { MapPin, Navigation, ExternalLink, Sparkles, Fuel, Zap } from 'lucide-react';

interface MapInteractiveProps {
  route: RouteOption;
  stops: RestStop[];
  gasStations: GasStation[];
  onAddStation: (station: GasStation) => void;
  onRemoveStop: (stopId: string) => void;
}

export const MapInteractive: React.FC<MapInteractiveProps> = ({
  route,
  stops,
  gasStations,
  onAddStation,
  onRemoveStop,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);

  const [filterBrand, setFilterBrand] = useState<string>('All');
  const brands = ['All', ...Array.from(new Set(gasStations.map(s => s.brand)))];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create Map instance if not exists
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [16.8, 100.5],
        zoom: 7,
        scrollWheelZoom: true,
      });

      // Standard OSM Tile Layer with high contrast
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

    // 1. Draw Fallback Route Polyline (Straight lines) instantly so map isn't blank
    const fallbackPolyline = L.polyline(route.routeCoordinates, {
      color: '#94a3b8', // slate-400
      weight: 4,
      opacity: 0.5,
      dashArray: '8, 8',
    }).addTo(markersGroup);

    // Fetch Real Road Coordinates from OSRM
    let isMounted = true;
    const fetchRealRoute = async () => {
      try {
        // Convert [lat, lon] to lon,lat string
        const coordsString = route.routeCoordinates.map(coord => `${coord[1]},${coord[0]}`).join(';');
        const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error('OSRM network error');
        
        const data = await res.json();
        if (data.code === 'Ok' && isMounted) {
          // OSRM returns GeoJSON LineString coordinates as [lon, lat]
          const geoJsonCoords = data.routes[0].geometry.coordinates;
          // Leaflet polyline expects [lat, lon]
          const leafletCoords = geoJsonCoords.map((coord: [number, number]) => [coord[1], coord[0]]);
          
          // Remove the fallback
          if (markersGroup.hasLayer(fallbackPolyline)) {
            markersGroup.removeLayer(fallbackPolyline);
          }
          
          L.polyline(leafletCoords, {
            color: '#2563eb', // Blue-600
            weight: 5,
            opacity: 0.85,
            lineCap: 'round',
            lineJoin: 'round',
            dashArray: route.isShortest ? undefined : '8, 8',
          }).addTo(markersGroup);
        }
      } catch (e) {
        console.warn('Failed to fetch real route, falling back to straight lines:', e);
        // Leave the fallback line but make it primary color
        if (isMounted) {
          fallbackPolyline.setStyle({
            color: '#2563eb',
            weight: 5,
            opacity: 0.85,
            dashArray: route.isShortest ? undefined : '8, 8',
          });
        }
      }
    };
    
    fetchRealRoute();

    // 2. Custom Icons
    const originIcon = L.divIcon({
      className: 'custom-pin',
      html: `
        <div style="background-color: #059669; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
          🏁
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    const destIcon = L.divIcon({
      className: 'custom-pin',
      html: `
        <div style="background-color: #e11d48; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 15px; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
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
        </div>
      `)
      .addTo(markersGroup);

    // Add Destination Marker (ศฝร.ภ.3 นครราชสีมา)
    L.marker(DESTINATION_INFO.coordinates, { icon: destIcon })
      .bindPopup(`
        <div style="padding: 4px; font-family: system-ui, sans-serif; min-width: 220px;">
          <div style="font-size: 11px; font-weight: bold; color: #e11d48; text-transform: uppercase;">จุดหมายปลายทาง (กม. ${route.totalDistanceKm})</div>
          <div style="font-size: 14px; font-weight: bold; color: #0f172a; margin-top: 2px;">${DESTINATION_INFO.name}</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 2px;">${DESTINATION_INFO.address} (จอหอ)</div>
          <div style="margin-top: 6px;">
            <a href="${DESTINATION_INFO.googleMapsUrl}" target="_blank" style="font-size: 11px; color: #2563eb; text-decoration: underline; font-weight: bold;">เปิดดูพิกัด Google Maps จริง</a>
          </div>
        </div>
      `)
      .addTo(markersGroup);

    // 3. Add Rest Stops Markers
    stops.forEach((stop, index) => {
      const stopIcon = L.divIcon({
        className: 'custom-pin',
        html: `
          <div style="background-color: #2563eb; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; border: 2.5px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.25);">
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

    // 4. Add Other Available Gas Stations as small fuel pins
    const filteredGasStations = filterBrand === 'All' 
      ? gasStations 
      : gasStations.filter(s => s.brand === filterBrand);

    filteredGasStations.forEach((station) => {
      const isAlreadyStop = stops.some(s => s.stationId === station.id || s.name === station.name);
      if (isAlreadyStop) return;

      const stationIcon = L.divIcon({
        className: 'custom-pin',
        html: `
          <div style="background-color: #64748b; color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; border: 1.5px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); opacity: 0.9;">
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
      map.fitBounds(markersGroup.getBounds(), { padding: [40, 40] });
    } catch (e) {
      // safe fallback
    }

    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    // Event delegation for popup button clicks
    const container = mapContainerRef.current;
    const handlePopupClicks = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const addBtn = target.closest('.btn-popup-add-station') as HTMLElement;
      if (addBtn) {
        const stId = addBtn.getAttribute('data-station-id');
        const st = gasStations.find(s => s.id === stId);
        if (st) {
          onAddStation(st);
          map.closePopup();
        }
      }

      const removeBtn = target.closest('.btn-popup-remove-stop') as HTMLElement;
      if (removeBtn) {
        const stopId = removeBtn.getAttribute('data-stop-id');
        if (stopId) {
          onRemoveStop(stopId);
          map.closePopup();
        }
      }
    };

    container.addEventListener('click', handlePopupClicks);

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener('click', handlePopupClicks);
    };
  }, [route, stops, gasStations, onAddStation, onRemoveStop, filterBrand]);

  return (
    <div id="interactive-map-section" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            <span>แผนที่แสดงพิกัดเส้นทางจริง & จุดปั๊มน้ำมันตลอดสาย</span>
          </h3>
          <p className="text-xs text-slate-500">
            คลิกที่หมุดปั๊มน้ำมันใดๆ บนแผนที่เพื่อกด <strong>"+ เพิ่มเป็นจุดพักรถ"</strong> หรือ <strong>"ลบจุดนี้"</strong> ได้โดยตรง
          </p>
        </div>

        {/* Legend & Filter */}
        <div className="flex flex-col items-end gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span className="flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              🏁 บิ๊กซีลำพูน
            </span>
            <span className="flex items-center gap-1 font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              🔵 จุดพัก ({stops.length} จุด)
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              ⛽ หมุดปั๊ม
            </span>
            <span className="flex items-center gap-1 font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              🎯 ศฝร.ภ.3
            </span>
          </div>
          
          <select 
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="text-xs border border-slate-300 rounded-md px-2 py-1.5 bg-white text-slate-700 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {brands.map(brand => (
              <option key={brand} value={brand}>
                {brand === 'All' ? 'แสดงปั๊มน้ำมัน: ทั้งหมด' : `แสดงเฉพาะ: ปั๊ม ${brand}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div
        id="leaflet-map-canvas"
        ref={mapContainerRef}
        className="w-full h-[450px] sm:h-[520px] rounded-xl overflow-hidden border border-slate-200 shadow-inner z-0"
      />

      {/* Interactive Helper bar */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">
        <div>
          💡 <em>คลิกที่หมุดบนแผนที่เพื่อดูข้อมูลสิ่งอำนวยความสะดวก หรือกดเพิ่ม/ลดจุดพักได้ทันที</em>
        </div>
        <a
          href={DESTINATION_INFO.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-bold flex items-center gap-1 self-end sm:self-auto"
        >
          <span>เปิดพิกัดจริงบน Google Maps ทางการ</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

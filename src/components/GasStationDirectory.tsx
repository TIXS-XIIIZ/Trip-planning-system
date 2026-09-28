import React, { useState, useMemo } from 'react';
import { GasStation, RestStop, BrandType } from '../types';
import { 
  Fuel, 
  Search, 
  Filter, 
  Plus, 
  Check, 
  MapPin, 
  Zap, 
  Coffee, 
  Utensils, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Navigation,
  Clock
} from 'lucide-react';

interface GasStationDirectoryProps {
  gasStations: GasStation[];
  currentStops: RestStop[];
  onAddStationToStops: (station: GasStation, durationMinutes?: number) => void;
  onRemoveStationFromStops: (stationId: string) => void;
}

export const GasStationDirectory: React.FC<GasStationDirectoryProps> = ({
  gasStations,
  currentStops,
  onAddStationToStops,
  onRemoveStationFromStops,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [filterEVOnly, setFilterEVOnly] = useState(false);
  const [filter7ElevenOnly, setFilter7ElevenOnly] = useState(false);
  const [filterFoodCourtOnly, setFilterFoodCourtOnly] = useState(false);
  const [filterCoffeeOnly, setFilterCoffeeOnly] = useState(false);
  const [filter24HourOnly, setFilter24HourOnly] = useState(false);

  const brands: { label: string; value: string }[] = [
    { label: 'ทุกแบรนด์ (All)', value: 'ALL' },
    { label: 'ปตท. (PTT Station)', value: 'PTT' },
    { label: 'บางจาก (Bangchak)', value: 'Bangchak' },
    { label: 'เชลล์ (Shell)', value: 'Shell' },
    { label: 'คาลเท็กซ์ (Caltex)', value: 'Caltex' },
    { label: 'พีที (PT Max)', value: 'PT' },
  ];

  const filteredStations = useMemo(() => {
    return gasStations.filter((st) => {
      // Search
      const q = searchQuery.toLowerCase();
      const matchQuery = 
        st.name.toLowerCase().includes(q) ||
        st.location.toLowerCase().includes(q) ||
        st.highwayNumber.toLowerCase().includes(q) ||
        st.recommendedFor.toLowerCase().includes(q);

      if (!matchQuery) return false;

      // Brand
      if (selectedBrand !== 'ALL' && st.brand !== selectedBrand) return false;

      // Amenities
      if (filterEVOnly && !st.amenities.hasEVCharger) return false;
      if (filter7ElevenOnly && !st.amenities.has7Eleven) return false;
      if (filterFoodCourtOnly && !st.amenities.hasFoodCourt && !st.amenities.hasKfcOrMcdonalds) return false;
      if (filterCoffeeOnly && !st.amenities.hasCafeAmazon && !st.amenities.hasInthanin) return false;
      if (filter24HourOnly && !st.amenities.has24Hour) return false;

      return true;
    });
  }, [gasStations, searchQuery, selectedBrand, filterEVOnly, filter7ElevenOnly, filterFoodCourtOnly, filterCoffeeOnly, filter24HourOnly]);

  const isStationInStops = (stationId: string) => {
    return currentStops.some(s => s.stationId === stationId || s.name === stationId);
  };

  return (
    <div id="gas-stations-directory-section" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6">
      
      {/* Title & Introduction */}
      <div className="pb-4 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Fuel className="w-5 h-5 text-blue-600" />
              <span>ทำเนียบปั๊มน้ำมัน & จุดพักรถบนเส้นทางที่ใกล้ที่สุด (ทล.11 - 12 - 21 - 201)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              รวมปั๊ม ปตท., บางจาก, เชลล์, คาลเท็กซ์, พีที ตลอดเส้นทาง {gasStations.length} แห่ง พร้อมสิ่งอำนวยความสะดวก
            </p>
          </div>

          <div className="text-xs text-slate-500 font-semibold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
            อยู่ในแผนปัจจุบัน: <strong className="text-blue-700">{currentStops.length} จุด</strong>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="mt-4 space-y-3">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-gas-station"
              type="text"
              placeholder="ค้นหาชื่อปั๊ม, อำเภอ, จังหวัด (เช่น เด่นชัย, หล่มสัก, ชัยภูมิ, วังทอง, แม่ทะ)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Brand Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {brands.map((b) => (
              <button
                key={b.value}
                id={`filter-brand-${b.value.toLowerCase()}`}
                onClick={() => setSelectedBrand(b.value)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  selectedBrand === b.value
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Amenity Feature Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
            <span className="text-slate-400 font-medium">กรองเฉพาะ:</span>
            
            <button
              onClick={() => setFilterEVOnly(!filterEVOnly)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all border ${
                filterEVOnly 
                  ? 'bg-sky-100 text-sky-800 border-sky-300' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Zap className="w-3 h-3 text-sky-600" />
              <span>มีตู้ชาร์จ EV</span>
            </button>

            <button
              onClick={() => setFilter7ElevenOnly(!filter7ElevenOnly)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all border ${
                filter7ElevenOnly 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>มี 7-Eleven</span>
            </button>

            <button
              onClick={() => setFilterCoffeeOnly(!filterCoffeeOnly)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all border ${
                filterCoffeeOnly 
                  ? 'bg-amber-100 text-amber-800 border-amber-300' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Coffee className="w-3 h-3 text-amber-600" />
              <span>มี Cafe Amazon / Inthanin</span>
            </button>

            <button
              onClick={() => setFilterFoodCourtOnly(!filterFoodCourtOnly)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all border ${
                filterFoodCourtOnly 
                  ? 'bg-rose-100 text-rose-800 border-rose-300' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Utensils className="w-3 h-3 text-rose-600" />
              <span>ศูนย์อาหาร / ร้านข้าว</span>
            </button>

            <button
              onClick={() => setFilter24HourOnly(!filter24HourOnly)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all border ${
                filter24HourOnly 
                  ? 'bg-slate-800 text-white border-slate-700' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Clock className={`w-3 h-3 ${filter24HourOnly ? 'text-white' : 'text-slate-600'}`} />
              <span>เปิด 24 ชม.</span>
            </button>

            {(filterEVOnly || filter7ElevenOnly || filterCoffeeOnly || filterFoodCourtOnly || filter24HourOnly || searchQuery || selectedBrand !== 'ALL') && (
              <button
                onClick={() => {
                  setFilterEVOnly(false);
                  setFilter7ElevenOnly(false);
                  setFilterCoffeeOnly(false);
                  setFilterFoodCourtOnly(false);
                  setFilter24HourOnly(false);
                  setSearchQuery('');
                  setSelectedBrand('ALL');
                }}
                className="text-blue-600 hover:underline text-xs ml-auto font-medium"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Gas Station Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {filteredStations.map((station) => {
          const inItinerary = isStationInStops(station.id);

          return (
            <div
              key={station.id}
              id={`station-card-${station.id}`}
              className={`rounded-xl p-4 border transition-all flex flex-col justify-between ${
                inItinerary
                  ? 'bg-blue-50/40 border-blue-300 ring-1 ring-blue-300 shadow-xs'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        station.brand === 'PTT'
                          ? 'bg-blue-100 text-blue-800'
                          : station.brand === 'Bangchak'
                          ? 'bg-emerald-100 text-emerald-800'
                          : station.brand === 'Shell'
                          ? 'bg-amber-100 text-amber-800'
                          : station.brand === 'Caltex'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {station.brand} Station
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      กม. {station.kmFromStart} ({station.highwayNumber})
                    </span>
                  </div>

                  {inItinerary && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-2xs">
                      <Check className="w-3 h-3" /> อยู่ในแผนพัก
                    </span>
                  )}
                </div>

                {/* Station Name & Location */}
                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {station.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {station.location}
                </p>

                {/* Recommended reason */}
                <div className="mt-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100/90">
                  <strong className="text-slate-900">แนะนำสำหรับ: </strong>
                  {station.recommendedFor}
                </div>

                {/* Highlights */}
                {station.highlights && (
                  <ul className="mt-2 space-y-0.5 text-[11px] text-slate-600 pl-3 list-disc">
                    {station.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}

                {/* Amenities Badges */}
                <div className="flex items-center gap-1.5 flex-wrap mt-3">
                  {station.amenities.has24Hour && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-white flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> 24 ชม.
                    </span>
                  )}
                  {station.amenities.has7Eleven && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      7-Eleven
                    </span>
                  )}
                  {station.amenities.hasCafeAmazon && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      Cafe Amazon
                    </span>
                  )}
                  {station.amenities.hasInthanin && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Inthanin
                    </span>
                  )}
                  {station.amenities.hasEVCharger && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5 text-sky-600" /> ตู้ชาร์จ EV
                    </span>
                  )}
                  {station.amenities.hasFoodCourt && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      ศูนย์อาหาร
                    </span>
                  )}
                  {station.amenities.hasKfcOrMcdonalds && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      KFC / ไก่ย่าง
                    </span>
                  )}
                  {station.amenities.hasAirPump && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      เติมลมยาง
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.name + ' ' + station.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {inItinerary ? (
                  <button
                    onClick={() => onRemoveStationFromStops(station.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors border border-rose-200"
                  >
                    <span>นำออกจากแผน</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onAddStationToStops(station, 20)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>เพิ่มในแผนการเดินทาง</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredStations.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Fuel className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="font-semibold text-sm">ไม่พบปั๊มน้ำมันที่ตรงกับเงื่อนไขการค้นหา</p>
          <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหาหรือล้างตัวกรอง</p>
        </div>
      )}

    </div>
  );
};

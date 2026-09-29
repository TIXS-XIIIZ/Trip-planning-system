import React from 'react';
import { RouteOption, GasStation } from '../types';
import { ROUTE_OPTIONS, DESTINATION_INFO } from '../data/routeData';
import { 
  X, 
  MapPin, 
  Navigation, 
  Clock, 
  Fuel, 
  ShieldCheck, 
  Sparkles, 
  Printer, 
  ExternalLink, 
  Route, 
  Filter,
  CheckCircle2,
  ChevronRight,
  Search,
  Plus
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'map-only' | 'timeline' | 'map' | 'stations' | 'safety' | 'cost';
  setActiveTab: (tab: 'map-only' | 'timeline' | 'map' | 'stations' | 'safety' | 'cost') => void;
  selectedRoute: RouteOption;
  onSelectRoute: (route: RouteOption) => void;
  departureTime: string;
  onDepartureTimeChange: (time: string) => void;
  filterBrand: string;
  onFilterBrandChange: (brand: string) => void;
  onOpenAiAssistant: () => void;
  onOpenPrintReport: () => void;
  googleMapsUrl: string;
  allGasStations?: GasStation[];
  filterSearch?: string;
  onFilterSearchChange?: (val: string) => void;
  filter24HourOnly?: boolean;
  onFilter24HourToggle?: () => void;
  onOpenCustomStationModal?: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  selectedRoute,
  onSelectRoute,
  departureTime,
  onDepartureTimeChange,
  filterBrand,
  onFilterBrandChange,
  onOpenAiAssistant,
  onOpenPrintReport,
  googleMapsUrl,
  allGasStations,
  filterSearch,
  onFilterSearchChange,
  filter24HourOnly,
  onFilter24HourToggle,
  onOpenCustomStationModal,
}) => {
  if (!isOpen) return null;

  const quickTimePresets = ['05:00', '06:00', '09:00', '18:00', '20:00'];
  const stationsPool = allGasStations || selectedRoute.gasStationsList;
  const brands = ['All', ...Array.from(new Set(stationsPool.map(s => s.brand)))];

  const handleSelectTab = (tab: 'map-only' | 'timeline' | 'map' | 'stations' | 'safety' | 'cost') => {
    setActiveTab(tab);
    onClose();
  };

  const handleSelectRouteOption = (route: RouteOption) => {
    onSelectRoute(route);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden animate-slide-left">
        
        {/* Drawer Header */}
        <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm leading-tight">เมนู & จัดการทริป</div>
              <div className="text-[11px] text-slate-300">ลำพูน ➔ ศฝร.ภ.3 โคราช</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            aria-label="ปิดเมนู"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 text-slate-800">
          
          {/* Section 1: Navigation Tabs */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>เลือกหน้าแสดงผล</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSelectTab('map-only')}
                className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  activeTab === 'map-only'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  {activeTab === 'map-only' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <div className="font-bold text-xs">🗺️ แผนที่เดี่ยว</div>
                <div className="text-[10px] text-slate-500">เต็มตา ไม่รก</div>
              </button>

              <button
                onClick={() => handleSelectTab('map')}
                className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  activeTab === 'map'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  {activeTab === 'map' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <div className="font-bold text-xs">แผนที่ + สรุป</div>
                <div className="text-[10px] text-slate-500">พร้อมการ์ดข้อมูล</div>
              </button>

              <button
                onClick={() => handleSelectTab('timeline')}
                className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  activeTab === 'timeline'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  {activeTab === 'timeline' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <div className="font-bold text-xs">⏱️ ไทม์ไลน์</div>
                <div className="text-[10px] text-slate-500">ตารางจุดแวะพัก</div>
              </button>

              <button
                onClick={() => handleSelectTab('stations')}
                className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  activeTab === 'stations'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Fuel className="w-4 h-4 text-amber-600" />
                  {activeTab === 'stations' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <div className="font-bold text-xs">⛽ ปั๊มน้ำมัน</div>
                <div className="text-[10px] text-slate-500">รายชื่อตลอดสาย</div>
              </button>

              <button
                onClick={() => handleSelectTab('safety')}
                className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  activeTab === 'safety'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  {activeTab === 'safety' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <div className="font-bold text-xs">🛡️ จุดเสี่ยง</div>
                <div className="text-[10px] text-slate-500">ทางเขา & โค้งชัน</div>
              </button>

              <button
                onClick={() => handleSelectTab('cost')}
                className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  activeTab === 'cost'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Fuel className="w-4 h-4 text-emerald-600" />
                  {activeTab === 'cost' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <div className="font-bold text-xs">💰 ค่าน้ำมัน</div>
                <div className="text-[10px] text-slate-500">คำนวณเชื้อเพลิง</div>
              </button>
            </div>
          </div>

          {/* Section 2: Route Selection */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Route className="w-3.5 h-3.5 text-blue-600" />
                เลือกเส้นทาง
              </span>
              <span className="text-[10px] text-slate-400 font-normal">{ROUTE_OPTIONS.length} เส้นทาง</span>
            </div>

            <div className="space-y-2">
              {ROUTE_OPTIONS.map((r) => {
                const isSelected = r.id === selectedRoute.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRouteOption(r)}
                    className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <span>{r.title.split(':')[0]}</span>
                        {r.isShortest && (
                          <span className={`text-[10px] px-1 rounded font-semibold ${
                            isSelected ? 'bg-amber-400 text-amber-950' : 'bg-amber-100 text-amber-800'
                          }`}>
                            สั้นสุด
                          </span>
                        )}
                        {r.tagColor === 'purple' && (
                          <span className={`text-[10px] px-1 rounded font-semibold ${
                            isSelected ? 'bg-purple-300 text-purple-950' : 'bg-purple-100 text-purple-800'
                          }`}>
                            เริ่มต้น • ทางด่วน M6
                          </span>
                        )}
                      </div>
                      <div className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                        {r.description.slice(0, 35)}...
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-xs">{r.totalDistanceKm} กม.</div>
                      {isSelected && <span className="text-[10px] text-white">✓ ใช้งาน</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Gas Station Filter */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-amber-600" />
                <span>Filter ปั๊มน้ำมันบนแผนที่</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">
                {stationsPool.length} ปั๊ม
              </span>
            </div>

            {/* Keyword / Station Name Search */}
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="กรอกชื่อปั๊ม / อำเภอ เช่น บ้านตาก, สลกบาตร..."
                value={filterSearch || ''}
                onChange={(e) => onFilterSearchChange && onFilterSearchChange(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-slate-400"
              />
              {filterSearch && (
                <button
                  onClick={() => onFilterSearchChange && onFilterSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* 24-Hour Quick Toggle */}
            <button
              onClick={onFilter24HourToggle}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-between mb-2 active:scale-98 ${
                filter24HourOnly
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Clock className={`w-3.5 h-3.5 ${filter24HourOnly ? 'text-white' : 'text-amber-600'}`} />
                <span>ปั๊มที่เปิด 24 ชั่วโมงเท่านั้น</span>
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                filter24HourOnly ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {filter24HourOnly ? 'เปิดอยู่ ✓' : 'ปิด'}
              </span>
            </button>

            {/* Brand Dropdown */}
            <select
              value={filterBrand}
              onChange={(e) => onFilterBrandChange(e.target.value)}
              className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {brands.map(brand => (
                <option key={brand} value={brand}>
                  {brand === 'All' ? `แสดงทุกยี่ห้อ (${stationsPool.length} ปั๊ม)` : `แสดงเฉพาะ: ปั๊ม ${brand}`}
                </option>
              ))}
            </select>

            {/* + กรอกเพิ่มปั๊มน้ำมันเอง button */}
            <button
              onClick={() => {
                onClose();
                if (onOpenCustomStationModal) onOpenCustomStationModal();
              }}
              className="w-full mt-2 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors active:scale-98"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ กรอกเพิ่มปั๊มน้ำมันเอง</span>
            </button>
          </div>

          {/* Section 4: Departure Time */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>เวลาออกเดินทาง</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="time"
                value={departureTime}
                onChange={(e) => onDepartureTimeChange(e.target.value)}
                className="flex-1 text-sm font-bold border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[11px] text-slate-400 mr-1">ด่วน:</span>
              {quickTimePresets.map((t) => (
                <button
                  key={t}
                  onClick={() => onDepartureTimeChange(t)}
                  className={`text-xs px-2 py-1 rounded-lg font-medium transition-all ${
                    departureTime === t
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Extra Tools */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              เครื่องมือช่วยเหลือ
            </div>

            <button
              onClick={() => {
                onOpenAiAssistant();
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-purple-900 font-bold text-xs hover:from-purple-100 hover:to-indigo-100 transition-all"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>วิเคราะห์ทริปด้วย AI</span>
              </div>
              <ChevronRight className="w-4 h-4 text-purple-400" />
            </button>

            <button
              onClick={() => {
                onOpenPrintReport();
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-all"
            >
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-slate-600" />
                <span>พิมพ์รายงานสรุป</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <a
              href={DESTINATION_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-all"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>เปิดพิกัดจริง ศฝร.ภ.3 บน Google Maps</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

        </div>

        {/* Drawer Footer Navigation Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Navigation className="w-4 h-4" />
            <span>เปิดนำทาง GPS บน Google Maps</span>
          </a>
        </div>

      </div>
    </div>
  );
};

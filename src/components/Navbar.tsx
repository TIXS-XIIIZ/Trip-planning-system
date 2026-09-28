import React, { useState } from 'react';
import { 
  Navigation, 
  Clock, 
  Printer, 
  Share2, 
  ExternalLink, 
  Sparkles, 
  MapPin, 
  ShieldCheck,
  Fuel,
  Menu
} from 'lucide-react';
import { DESTINATION_INFO, ORIGIN_INFO } from '../data/routeData';
import { RouteOption } from '../types';
import { MobileDrawer } from './MobileDrawer';

interface NavbarProps {
  departureTime: string;
  onDepartureTimeChange: (time: string) => void;
  onOpenAiAssistant: () => void;
  onOpenPrintReport: () => void;
  googleMapsUrl: string;
  activeTab: 'map-only' | 'timeline' | 'map' | 'stations' | 'safety' | 'cost';
  setActiveTab: (tab: 'map-only' | 'timeline' | 'map' | 'stations' | 'safety' | 'cost') => void;
  selectedRoute: RouteOption;
  onSelectRoute: (route: RouteOption) => void;
  filterBrand: string;
  onFilterBrandChange: (brand: string) => void;
  isMobileDrawerOpen?: boolean;
  setIsMobileDrawerOpen?: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  departureTime,
  onDepartureTimeChange,
  onOpenAiAssistant,
  onOpenPrintReport,
  googleMapsUrl,
  activeTab,
  setActiveTab,
  selectedRoute,
  onSelectRoute,
  filterBrand,
  onFilterBrandChange,
  isMobileDrawerOpen: controlledDrawerOpen,
  setIsMobileDrawerOpen: controlledSetDrawerOpen,
}) => {
  const [internalDrawerOpen, setInternalDrawerOpen] = useState(false);
  const isDrawerOpen = controlledDrawerOpen !== undefined ? controlledDrawerOpen : internalDrawerOpen;
  const setIsDrawerOpen = controlledSetDrawerOpen || setInternalDrawerOpen;

  const quickTimePresets = ['05:00', '06:00', '09:00', '18:00', '20:00'];

  return (
    <>
      <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        
        {/* ======================================================== */}
        {/* MOBILE SLIM HEADER (< md)                                */}
        {/* Gather all clutter into single place via "☰ เมนู" button */}
        {/* ======================================================== */}
        <div className="md:hidden w-full px-3 py-2 flex items-center justify-between gap-2">
          {/* Logo & Route title */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Navigation className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-extrabold text-xs text-slate-900 tracking-tight truncate">
                  ลำพูน ➔ โคราช
                </span>
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200 shrink-0">
                  {selectedRoute.totalDistanceKm} กม.
                </span>
              </div>
              <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                <span>ออก {departureTime} น.</span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">{selectedRoute.title.split(':')[0].replace('เส้นทาง ', '')}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Menu Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick GPS Open */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-2xs"
              title="เปิด Google Maps GPS"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>GPS</span>
            </a>

            {/* Consolidated All-in-One Menu Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
              aria-label="เปิดเมนูการจัดการทริป"
            >
              <Menu className="w-4 h-4" />
              <span>เมนู</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* DESKTOP HEADER (>= md)                                   */}
        {/* Wide, spacious layout for PC screens                     */}
        {/* ======================================================== */}
        <div className="hidden md:block">
          {/* Top Banner with route info */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-3 sm:px-6 py-2 text-xs">
            <div className="w-full max-w-[1920px] mx-auto flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  แผนเดินทาง
                </span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <MapPin className="w-3 h-3" /> ลำพูน (บิ๊กซี)
                </span>
                <span className="text-slate-400">➔</span>
                <span className="text-sky-300 flex items-center gap-1 font-semibold">
                  <MapPin className="w-3 h-3" /> โคราช (ศฝร.ภ.3 จอหอ)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  id="btn-open-source-maps"
                  href={DESTINATION_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors border border-slate-700"
                >
                  <span>พิกัดปลายทางจริง</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>

                <a
                  id="btn-navigate-gps"
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-xs"
                >
                  <Navigation className="w-3 h-3" />
                  <span>เริ่มนำทาง GPS จริง</span>
                </a>
              </div>
            </div>
          </div>

          {/* Main Bar */}
          <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-6 py-3">
            <div className="flex items-center justify-between gap-3">
              
              {/* Logo & Title */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-100 shrink-0">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                      แผนเดินทาง ลำพูน ➔ นครราชสีมา
                    </h1>
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                      {selectedRoute.totalDistanceKm} กม.
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    บิ๊กซีลำพูน ➔ ศูนย์ฝึกอบรมตำรวจภูธรภาค 3 (จอหอ)
                  </p>
                </div>
              </div>

              {/* Time Picker & Action Toolbar */}
              <div className="flex items-center gap-2.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                {/* Departure Time Control */}
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs text-xs">
                  <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-bold text-slate-700 text-xs">เวลาออก:</span>
                  <input
                    id="departure-time-input"
                    type="time"
                    value={departureTime}
                    onChange={(e) => onDepartureTimeChange(e.target.value)}
                    className="text-xs font-bold text-slate-900 bg-transparent border-0 focus:ring-0 p-0 cursor-pointer w-[68px]"
                  />
                </div>

                {/* Quick preset buttons */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-slate-400 mr-0.5">ด่วน:</span>
                  {quickTimePresets.map((t) => (
                    <button
                      key={t}
                      id={`btn-time-preset-${t.replace(':', '')}`}
                      onClick={() => onDepartureTimeChange(t)}
                      className={`text-xs px-2 py-1 rounded-md font-medium transition-all ${
                        departureTime === t
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="h-6 w-px bg-slate-200" />

                {/* AI Assistant Button */}
                <button
                  id="btn-open-ai-assistant"
                  onClick={onOpenAiAssistant}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>วิเคราะห์ด้วย AI</span>
                </button>

                {/* Print Report */}
                <button
                  id="btn-open-print-modal"
                  onClick={onOpenPrintReport}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 shadow-2xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>พิมพ์</span>
                </button>
              </div>

            </div>

            {/* Desktop Horizontal Tabs */}
            <nav id="app-tabs" className="flex items-center gap-1 mt-2.5 pt-2 border-t border-slate-100 overflow-x-auto no-scrollbar">
              <button
                id="tab-map-only"
                onClick={() => setActiveTab('map-only')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'map-only'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>🗺️ แผนที่</span>
              </button>

              <button
                id="tab-map"
                onClick={() => setActiveTab('map')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'map'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>แผนที่ + สรุป</span>
              </button>

              <button
                id="tab-timeline"
                onClick={() => setActiveTab('timeline')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'timeline'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>⏱️ ไทม์ไลน์</span>
              </button>

              <button
                id="tab-stations"
                onClick={() => setActiveTab('stations')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'stations'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Fuel className="w-3.5 h-3.5" />
                <span>⛽ ปั๊มน้ำมัน</span>
              </button>

              <button
                id="tab-safety"
                onClick={() => setActiveTab('safety')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'safety'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>🛡️ จุดเสี่ยง</span>
              </button>

              <button
                id="tab-cost"
                onClick={() => setActiveTab('cost')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'cost'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Fuel className="w-3.5 h-3.5" />
                <span>💰 ค่าน้ำมัน</span>
              </button>
            </nav>
          </div>
        </div>

      </header>

      {/* Slide-Over Drawer for Mobile */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRoute={selectedRoute}
        onSelectRoute={onSelectRoute}
        departureTime={departureTime}
        onDepartureTimeChange={onDepartureTimeChange}
        filterBrand={filterBrand}
        onFilterBrandChange={onFilterBrandChange}
        onOpenAiAssistant={onOpenAiAssistant}
        onOpenPrintReport={onOpenPrintReport}
        googleMapsUrl={googleMapsUrl}
      />
    </>
  );
};

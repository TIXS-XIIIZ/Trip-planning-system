import React from 'react';
import { 
  Navigation, 
  Clock, 
  Printer, 
  Share2, 
  ExternalLink, 
  Sparkles, 
  MapPin, 
  ShieldCheck,
  Fuel
} from 'lucide-react';
import { DESTINATION_INFO, ORIGIN_INFO } from '../data/routeData';

interface NavbarProps {
  departureTime: string;
  onDepartureTimeChange: (time: string) => void;
  onOpenAiAssistant: () => void;
  onOpenPrintReport: () => void;
  googleMapsUrl: string;
  activeTab: 'timeline' | 'map' | 'stations' | 'safety' | 'cost';
  setActiveTab: (tab: 'timeline' | 'map' | 'stations' | 'safety' | 'cost') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  departureTime,
  onDepartureTimeChange,
  onOpenAiAssistant,
  onOpenPrintReport,
  googleMapsUrl,
  activeTab,
  setActiveTab,
}) => {
  const quickTimePresets = ['05:00', '06:00', '09:00', '18:00', '20:00'];

  return (
    <header id="main-header" className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner with route info */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-4 py-2.5 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              รายงานวางแผนการเดินทาง
            </span>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-emerald-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> ลำพูน (บิ๊กซี)
              </span>
              <span className="text-slate-400">➔</span>
              <span className="text-sky-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> โคราช (ศฝร.ภ.3 จอหอ)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <a
              id="btn-open-source-maps"
              href={DESTINATION_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700"
              title="เปิดพิกัดปลายทางจริงบน Google Maps"
            >
              <span>พิกัด Google Maps ปลายทาง</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              id="btn-navigate-gps"
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all shadow-xs"
              title="เริ่มนำทาง GPS ผ่าน Google Maps พร้อมจุดพักทุกจุด"
            >
              <Navigation className="w-3 h-3" />
              <span>เริ่มนำทาง GPS จริง</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-100 shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  ระบบวางแผนเดินทาง & สรุปจุดพักรถ
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                  ระยะทางสั้นที่สุด ~588 กม.
                </span>
              </div>
              <p className="text-xs text-slate-500">
                บิ๊กซีลำพูน ➔ ศูนย์ฝึกอบรมตำรวจภูธรภาค 3 (จอหอ นครราชสีมา)
              </p>
            </div>
          </div>

          {/* Time Picker & Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
            
            {/* Departure Time Control */}
            <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <label htmlFor="departure-time-input" className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                เวลาออกเดินทาง:
              </label>
              <input
                id="departure-time-input"
                type="time"
                value={departureTime}
                onChange={(e) => onDepartureTimeChange(e.target.value)}
                className="text-sm font-bold text-slate-900 bg-transparent border-0 focus:ring-0 p-0 cursor-pointer"
              />
            </div>

            {/* Quick preset buttons */}
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-[11px] text-slate-400 mr-0.5">ด่วน:</span>
              {quickTimePresets.map((t) => (
                <button
                  key={t}
                  id={`btn-time-preset-${t.replace(':', '')}`}
                  onClick={() => onDepartureTimeChange(t)}
                  className={`text-xs px-2 py-1 rounded-md font-medium transition-all ${
                    departureTime === t
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/80'
                  }`}
                >
                  {t} น.
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-200 hidden md:block" />

            {/* AI Assistant Button */}
            <button
              id="btn-open-ai-assistant"
              onClick={onOpenAiAssistant}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>วิเคราะห์ทริปด้วย AI</span>
            </button>

            {/* Print Report */}
            <button
              id="btn-open-print-modal"
              onClick={onOpenPrintReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>พิมพ์รายงานสรุป</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation */}
        <nav id="app-tabs" className="flex items-center gap-1 mt-3 pt-2 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <button
            id="tab-timeline"
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>ไทม์ไลน์ & ปรับแต่งจุดพัก</span>
          </button>

          <button
            id="tab-map"
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'map'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>แผนที่เส้นทาง & พิกัดสด</span>
          </button>

          <button
            id="tab-stations"
            onClick={() => setActiveTab('stations')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'stations'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Fuel className="w-3.5 h-3.5" />
            <span>รายชื่อปั๊มน้ำมันบนเส้นทาง</span>
          </button>

          <button
            id="tab-safety"
            onClick={() => setActiveTab('safety')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'safety'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ความปลอดภัย & จุดเสี่ยงทางเขา</span>
          </button>

          <button
            id="tab-cost"
            onClick={() => setActiveTab('cost')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'cost'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Fuel className="w-3.5 h-3.5" />
            <span>คำนวณค่าน้ำมัน / พลังงาน EV</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

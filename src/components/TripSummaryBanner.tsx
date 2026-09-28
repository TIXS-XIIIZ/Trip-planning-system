import React from 'react';
import { 
  Milestone, 
  Clock, 
  Coffee, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Sparkles,
  Zap,
  ShieldCheck,
  TrendingDown,
  Navigation
} from 'lucide-react';
import { CalculatedTrip, formatDurationThai } from '../utils/tripCalculator';
import { RouteOption, VehicleSetting } from '../types';
import { DESTINATION_INFO, ORIGIN_INFO } from '../data/routeData';

interface TripSummaryBannerProps {
  trip: CalculatedTrip;
  route: RouteOption;
  vehicle: VehicleSetting;
  onOpenAiModal: () => void;
  stopsCount: number;
}

export const TripSummaryBanner: React.FC<TripSummaryBannerProps> = ({
  trip,
  route,
  vehicle,
  onOpenAiModal,
  stopsCount,
}) => {
  return (
    <div id="trip-summary-container" className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-3.5 sm:p-5 mb-4 sm:mb-6">
      
      {/* Route Badge & Origin-Destination Title */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {route.isShortest ? "★ เส้นทางสั้นสุด" : route.tag}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
              ผ่าน {route.highways.join(' ➔ ')}
            </span>
          </div>

          <h2 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight">
            สรุปแผนเดินทาง: ลำพูน ➔ โคราช (ศฝร.ภ.3 จอหอ)
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 hidden sm:block">
            จาก {ORIGIN_INFO.name} สู่ {DESTINATION_INFO.name}
          </p>
        </div>

        {/* Action quick info */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-500">เวลาออกเดินทาง</div>
            <div className="text-base font-extrabold text-blue-700">{trip.departureTime}</div>
          </div>
          <div className="text-slate-300 hidden sm:block">➔</div>
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-500">คาดการณ์ถึงปลายทาง (ETA)</div>
            <div className="text-base font-extrabold text-emerald-700">{trip.arrivalTime}</div>
          </div>
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-5">
        
        {/* Metric 1: Distance */}
        <div id="metric-distance" className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-xl border border-slate-200/80 transition-colors">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Milestone className="w-3.5 h-3.5 text-blue-600" />
            <span>ระยะทางรวม</span>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900">
            {trip.totalDistanceKm} <span className="text-xs font-semibold text-slate-500">กม.</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> ประหยัดระยะทางสุด
          </div>
        </div>

        {/* Metric 2: Drive Time */}
        <div id="metric-drive-time" className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-xl border border-slate-200/80 transition-colors">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>เวลาขับขี่จริง</span>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900">
            {formatDurationThai(trip.totalDriveMinutes)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            ความเร็วเฉลี่ย ~75-80 กม./ชม.
          </div>
        </div>

        {/* Metric 3: Rest Stops & Duration */}
        <div id="metric-rest-stops" className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-xl border border-slate-200/80 transition-colors">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Coffee className="w-3.5 h-3.5 text-rose-600" />
            <span>จุดพักรถ / เวลาพัก</span>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900">
            {stopsCount} จุด <span className="text-xs font-semibold text-slate-500">({formatDurationThai(trip.totalRestMinutes)})</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
            ปลอดภัยตามเกณฑ์พักทุก 2 ชม.
          </div>
        </div>

        {/* Metric 4: Total Travel Time */}
        <div id="metric-total-time" className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200/80">
          <div className="flex items-center gap-1.5 text-xs text-blue-800 font-semibold mb-1">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>เวลารวมตลอดทริป</span>
          </div>
          <div className="text-lg sm:text-2xl font-black text-blue-950">
            {formatDurationThai(trip.totalDurationMinutes)}
          </div>
          <div className="text-[11px] text-blue-700 font-medium mt-0.5">
            ออก {trip.departureTime} ถึง {trip.arrivalTime}
          </div>
        </div>

        {/* Metric 5: Estimated Fuel / EV Cost */}
        <div id="metric-fuel-cost" className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-xl border border-slate-200/80 transition-colors">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>ค่าน้ำมัน / พลังงาน</span>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900">
            ≈ {trip.fuelCostBaht.toLocaleString()} <span className="text-xs font-semibold text-slate-500">บ.</span>
          </div>
          <div className="text-[11px] text-slate-500 truncate mt-0.5" title={vehicle.name}>
            {vehicle.name.split('(')[0]}
          </div>
        </div>

        {/* Metric 6: Safety Score */}
        <div id="metric-safety-score" className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-xl border border-slate-200/80 transition-colors">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>ดัชนีความปลอดภัย</span>
          </div>
          <div className="text-lg sm:text-2xl font-black text-emerald-600 flex items-center gap-1">
            {trip.safetyScore} <span className="text-xs font-bold text-slate-400">/ 100</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
            {trip.safetyScore >= 80 ? "✓ แผนพักรถมาตรฐานสูง" : "⚠ ควรเพิ่มจุดพัก"}
          </div>
        </div>

      </div>

      {/* Safety Warning notice if any long driving without rest exists */}
      {trip.safetyWarnings.length > 0 && (
        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-amber-900 text-xs sm:text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">ข้อควรระวัง: </span>
            {trip.safetyWarnings.join(' • ')}
          </div>
        </div>
      )}

      {/* Recommended Strategy Highlights Bar */}
      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/90 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap text-slate-700">
          <span className="font-bold text-slate-900 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> จุดพักหลัก 3 จุดที่วางไว้:
          </span>
          <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 font-medium">
            1. ปตท. เด่นชัย (กม. 142) พัก 20 น.
          </span>
          <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 font-medium">
            2. ปตท. สี่แยกหล่มสัก (กม. 338) พัก 45 น. (มื้อหลัก)
          </span>
          <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 font-medium">
            3. ปตท. เลี่ยงเมืองชัยภูมิ (กม. 508) พัก 25 น.
          </span>
        </div>

        <button
          onClick={onOpenAiModal}
          className="inline-flex items-center gap-1 text-purple-700 hover:text-purple-900 font-bold hover:underline self-end md:self-auto shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>ดูคำแนะนำความปลอดภัยเชิงลึกด้วย AI ➔</span>
        </button>
      </div>

    </div>
  );
};

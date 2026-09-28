import React from 'react';
import { RouteOption } from '../types';
import { CheckCircle2, ChevronRight, Navigation, Sparkles, AlertCircle, Mountain } from 'lucide-react';
import { ROUTE_OPTIONS } from '../data/routeData';

interface RouteSelectorProps {
  selectedRouteId: string;
  onSelectRoute: (route: RouteOption) => void;
}

export const RouteSelector: React.FC<RouteSelectorProps> = ({
  selectedRouteId,
  onSelectRoute,
}) => {
  return (
    <div id="route-selector-section" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3.5">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            <span>เลือกเส้นทางเดินทาง (เปรียบเทียบ 3 ตัวเลือก)</span>
          </h3>
          <p className="text-xs text-slate-500">
            ระบบแนะนำ <strong className="text-emerald-700">เส้นทาง 1</strong> ซึ่งเป็นเส้นทางที่สั้นและใกล้ที่สุดตามที่ท่านต้องการ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {ROUTE_OPTIONS.map((route) => {
          const isSelected = route.id === selectedRouteId;

          return (
            <div
              key={route.id}
              id={`route-card-${route.id}`}
              onClick={() => onSelectRoute(route)}
              className={`relative rounded-xl p-4 cursor-pointer transition-all border text-left flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                  : 'bg-white hover:bg-slate-50 border-slate-200/90'
              }`}
            >
              {/* Header Badges */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      route.isShortest
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : route.tagColor === 'blue'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {route.tag}
                  </span>

                  {isSelected && (
                    <span className="flex items-center gap-1 text-xs font-bold text-blue-600">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      เลือกอยู่
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                  {route.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {route.description}
                </p>
              </div>

              {/* Stats & Mountain alerts */}
              <div className="pt-2 border-t border-slate-100/90">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div>
                    <span className="text-slate-400">ระยะทาง: </span>
                    <strong className="text-slate-900 font-extrabold">{route.totalDistanceKm} กม.</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">ขับขี่จริง: </span>
                    <strong className="text-slate-900 font-extrabold">
                      {Math.floor(route.baseDriveTimeMinutes / 60)} ชม. {route.baseDriveTimeMinutes % 60} น.
                    </strong>
                  </div>
                </div>

                {/* Mountain warning badge */}
                {route.mountainSections.length > 0 && (
                  <div className="text-[11px] text-amber-700 bg-amber-50/80 px-2 py-1 rounded border border-amber-200/60 flex items-center gap-1">
                    <Mountain className="w-3 h-3 text-amber-600 shrink-0" />
                    <span className="truncate">{route.mountainSections[0].split(':')[0]}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

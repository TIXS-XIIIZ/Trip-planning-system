import React, { useState } from 'react';
import { 
  RestStop, 
  GasStation, 
  RouteOption 
} from '../types';
import { 
  CalculatedTrip, 
  CalculatedLeg, 
  formatDurationThai,
  getEstimatedDriveTimeFromStart 
} from '../utils/tripCalculator';
import { 
  MapPin, 
  Clock, 
  Coffee, 
  Fuel, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Edit3, 
  Check, 
  RotateCcw, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  Utensils,
  Sparkles,
  Zap,
  Info,
  XCircle,
  PlusCircle
} from 'lucide-react';
import { DESTINATION_INFO, ORIGIN_INFO } from '../data/routeData';

interface TimelineViewProps {
  trip: CalculatedTrip;
  route: RouteOption;
  stops: RestStop[];
  onUpdateStops: (newStops: RestStop[]) => void;
  onResetStops: () => void;
  onOpenStationPicker: (insertKm?: number) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  trip,
  route,
  stops,
  onUpdateStops,
  onResetStops,
  onOpenStationPicker,
}) => {
  const [editingStopId, setEditingStopId] = useState<string | null>(null);
  const [editDuration, setEditDuration] = useState<number>(20);
  const [editActivity, setEditActivity] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editName, setEditName] = useState<string>('');

  const handleStartEdit = (stop: RestStop) => {
    setEditingStopId(stop.id);
    setEditName(stop.name);
    setEditDuration(stop.durationMinutes);
    setEditActivity(stop.activity);
    setEditNotes(stop.notes || '');
  };

  const handleSaveEdit = (stopId: string) => {
    const updated = stops.map(s => {
      if (s.id === stopId) {
        return {
          ...s,
          name: editName.trim() || s.name,
          durationMinutes: Number(editDuration) || 15,
          activity: editActivity,
          notes: editNotes,
        };
      }
      return s;
    });
    onUpdateStops(updated);
    setEditingStopId(null);
  };

  const handleQuickDurationChange = (stopId: string, duration: number) => {
    const updated = stops.map(s => s.id === stopId ? { ...s, durationMinutes: duration } : s);
    onUpdateStops(updated);
  };

  const handleDeleteStop = (stopId: string) => {
    const updated = stops.filter(s => s.id !== stopId);
    onUpdateStops(updated);
  };

  const handleClearAllStops = () => {
    if (window.confirm('คุณต้องการลบจุดพักรถทั้งหมดในแผนออกใช่หรือไม่? (สามารถกดคืนค่าจุดพักแนะนำได้ตลอดเวลา)')) {
      onUpdateStops([]);
    }
  };

  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stops.length) return;
    const newStops = [...stops];
    const temp = newStops[index];
    newStops[index] = newStops[targetIndex];
    newStops[targetIndex] = temp;
    onUpdateStops(newStops);
  };

  return (
    <div id="timeline-view-container" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>ตารางเวลาการเดินทาง & แผนจุดพักรถ ({stops.length} จุดพัก)</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              กำหนดได้อิสระ ไม่จำกัดจำนวน
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            คุณสามารถเพิ่ม/ลดจุดพักรถ, ปรับเวลาพัก, สลับลำดับ, หรือเลือกใช้ปั๊มน้ำมันใดก็ได้ตามต้องการ
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-add-stop-main"
            onClick={() => onOpenStationPicker()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มจุดพักรถ (+ Add Stop)</span>
          </button>

          <button
            id="btn-reset-stops"
            onClick={onResetStops}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            title="คืนค่าจุดพักแนะนำตามมาตรฐานความปลอดภัย"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>คืนค่าจุดพักแนะนำ</span>
          </button>

          {stops.length > 0 && (
            <button
              onClick={handleClearAllStops}
              className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors border border-rose-200"
              title="ลบจุดพักทั้งหมดเพื่อจัดแผนใหม่ด้วยตนเอง"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>ล้างทั้งหมด</span>
            </button>
          )}
        </div>
      </div>

      {/* Vertical Stepper Timeline */}
      <div className="mt-6 relative pl-4 sm:pl-6 space-y-6 before:absolute before:left-8 sm:before:left-10 before:top-4 before:bottom-8 before:w-0.5 before:bg-slate-200">
        
        {/* ================= STEP 0: ORIGIN ================= */}
        <div id="timeline-step-origin" className="relative flex items-start gap-4">
          {/* Node Icon */}
          <div className="relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md ring-4 ring-emerald-100 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>

          {/* Node Content */}
          <div className="flex-1 bg-emerald-50/60 border border-emerald-200 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-600 text-white">
                  จุดเริ่มต้น (Origin)
                </span>
                <span className="text-xs font-semibold text-slate-500">กม. 0</span>
              </div>
              <div className="text-sm font-extrabold text-emerald-800">
                เวลาออกรถ: {trip.departureTime}
              </div>
            </div>

            <h4 className="text-base font-bold text-slate-900 mt-1.5">
              {ORIGIN_INFO.name}
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              {ORIGIN_INFO.address}
            </p>

            <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs text-emerald-900">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                คำแนะนำ: เติมน้ำมันเต็มถัง และเช็คลมยางก่อนสตาร์ทออกเดินทาง
              </span>
              <a
                href={ORIGIN_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:underline flex items-center gap-1 font-medium"
              >
                แผนที่ <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Empty Stops State Notice */}
        {stops.length === 0 && (
          <div className="ml-10 sm:ml-12 p-5 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-2">
            <AlertCircle className="w-6 h-6 text-amber-600 mx-auto" />
            <h4 className="text-sm font-bold text-amber-900">ยังไม่มีจุดพักรถในแผนการเดินทาง</h4>
            <p className="text-xs text-amber-700 max-w-md mx-auto">
              ระยะทางรวม {trip.totalDistanceKm} กม. ใช้เวลาขับต่อเนื่องประมาณ {trip.totalDriveDurationHours} ชม. แนะนำให้เพิ่มจุดพักอย่างน้อย 1-3 จุดเพื่อความปลอดภัย
            </p>
            <button
              onClick={() => onOpenStationPicker(200)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มจุดพักรถจุดแรก</span>
            </button>
          </div>
        )}

        {/* ================= INTERMEDIATE REST STOPS ================= */}
        {stops.map((stop, index) => {
          // Find calculated leg corresponding to this stop
          const leg = trip.legs.find(l => l.stopObject?.id === stop.id);
          const isEditing = editingStopId === stop.id;
          const prevKm = index === 0 ? 0 : stops[index - 1].kmFromStart;
          const midKm = Math.round((prevKm + stop.kmFromStart) / 2);

          return (
            <div key={stop.id} id={`timeline-step-stop-${stop.id}`} className="relative space-y-3">
              
              {/* Drive Leg info between nodes with quick insert stop button */}
              {leg && (
                <div className="ml-10 sm:ml-12 pl-4 py-2 border-l-2 border-dashed border-blue-300 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded border border-blue-200">
                      ขับช่วงที่ {index + 1}: {leg.legDistanceKm} กม.
                    </span>
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" /> ใช้เวลาประมาณ {formatDurationThai(leg.driveTimeMinutes)}
                    </span>
                    <span className="text-slate-400">
                      (วิ่งเส้น {stop.highwayNumber})
                    </span>

                    {leg.safetyAlert && (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        {leg.safetyAlert}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenStationPicker(midKm)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                    title="แทรกจุดพักรถเพิ่มในช่วงนี้"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ แทรกจุดพักช่วงนี้</span>
                  </button>
                </div>
              )}

              {/* Stop Card */}
              <div className="relative flex items-start gap-4">
                {/* Node Icon */}
                <div className="relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md ring-4 ring-blue-100 shrink-0">
                  {index + 1}
                </div>

                {/* Stop Card Box */}
                <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-all shadow-2xs">
                  
                  {/* Top Bar of Stop */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                        จุดพักที่ {index + 1}
                      </span>
                      {stop.brand && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                          {stop.brand} Station
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-medium">
                        กม. ที่ {stop.kmFromStart} ({stop.highwayNumber})
                      </span>
                      {stop.isMandatorySafetyStop && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          จุดพักแนะนำ
                        </span>
                      )}
                    </div>

                    {/* Arrival & Departure timing */}
                    {leg && (
                      <div className="text-xs sm:text-right font-medium text-slate-700">
                        ถึง: <strong className="text-blue-700 font-bold">{leg.arrivalTimeStr}</strong>
                        <span className="mx-1.5 text-slate-300">|</span>
                        พัก: <strong className="text-rose-600 font-bold">{stop.durationMinutes} น.</strong>
                        <span className="mx-1.5 text-slate-300">|</span>
                        ออกต่อ: <strong className="text-slate-900 font-bold">{leg.departureTimeStr}</strong>
                      </div>
                    )}
                  </div>

                  {/* Stop Title & Location */}
                  <div className="mt-2">
                    <h4 className="text-base font-bold text-slate-900">
                      {stop.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {stop.location}
                    </p>
                    {(() => {
                      const timeInfo = getEstimatedDriveTimeFromStart(stop.kmFromStart, route, trip.departureTime);
                      return (
                        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3 text-blue-600 shrink-0" />
                            ใช้เวลาขับจากจุด Start: ~{timeInfo.formattedDuration}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Amenities */}
                  {stop.amenities && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                      {stop.amenities.has24Hour && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-white flex items-center gap-1">
                          <Clock className="w-3 h-3" /> เปิด 24 ชม.
                        </span>
                      )}
                      {stop.amenities.has7Eleven && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          7-Eleven
                        </span>
                      )}
                      {stop.amenities.hasCafeAmazon && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          Cafe Amazon
                        </span>
                      )}
                      {stop.amenities.hasInthanin && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Inthanin Coffee
                        </span>
                      )}
                      {stop.amenities.hasFoodCourt && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          ศูนย์อาหาร / ร้านข้าว
                        </span>
                      )}
                      {stop.amenities.hasEVCharger && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-0.5">
                          <Zap className="w-2.5 h-2.5 text-sky-600" /> ตู้ชาร์จ EV
                        </span>
                      )}
                      {stop.amenities.hasCleanToilet && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                          ห้องน้ำมาตรฐาน
                        </span>
                      )}
                      {stop.amenities.hasKfcOrMcdonalds && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          KFC / Fast Food
                        </span>
                      )}
                    </div>
                  )}

                  {/* Activity & Note */}
                  {!isEditing ? (
                    <div className="mt-3 p-2.5 bg-slate-50 rounded-lg text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-900">กิจกรรม: </span>
                        <span>{stop.activity || "พักผ่อน เข้าห้องน้ำ"}</span>
                        {stop.notes && (
                          <div className="text-slate-500 text-[11px] mt-0.5 italic">
                            * {stop.notes}
                          </div>
                        )}
                      </div>

                      {/* Quick Duration Pills */}
                      <div className="flex items-center gap-1 self-end sm:self-auto shrink-0">
                        <span className="text-[11px] text-slate-400 mr-1">เวลาพัก:</span>
                        {[15, 20, 30, 45, 60].map((d) => (
                          <button
                            key={d}
                            onClick={() => handleQuickDurationChange(stop.id, d)}
                            className={`px-1.5 py-0.5 text-[11px] rounded font-medium transition-colors ${
                              stop.durationMinutes === d
                                ? 'bg-blue-600 text-white font-bold'
                                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                            }`}
                          >
                            {d}น.
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Inline Editing Form */
                    <div className="mt-3 p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          ชื่อจุดพัก / ปั๊ม:
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            ระยะเวลาพัก (นาที):
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="5"
                              max="180"
                              value={editDuration}
                              onChange={(e) => setEditDuration(Number(e.target.value))}
                              className="w-24 px-2 py-1 text-sm bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                            />
                            <div className="flex gap-1">
                              {[15, 20, 30, 45, 60].map((d) => (
                                <button
                                  key={d}
                                  type="button"
                                  onClick={() => setEditDuration(d)}
                                  className="px-1.5 py-0.5 text-xs bg-white hover:bg-blue-100 rounded border border-slate-200 font-medium"
                                >
                                  {d}น.
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            กิจกรรม / วัตถุประสงค์การพัก:
                          </label>
                          <input
                            type="text"
                            value={editActivity}
                            onChange={(e) => setEditActivity(e.target.value)}
                            placeholder="เช่น ทานมื้อเที่ยง, เติมน้ำมัน, พักสายตา"
                            className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          บันทึกความปลอดภัย / หมายเหตุเพิ่มเติม:
                        </label>
                        <input
                          type="text"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="เช่น ตรวจเช็คลมยางก่อนขึ้นเขา"
                          className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingStopId(null)}
                          className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
                        >
                          ยกเลิก
                        </button>
                        <button
                          onClick={() => handleSaveEdit(stop.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>บันทึก</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions Toolbar on Stop */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveStop(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        title="เลื่อนขึ้น"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveStop(index, 'down')}
                        disabled={index === stops.length - 1}
                        className="p-1 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        title="เลื่อนลง"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <span className="text-[11px] text-slate-400 ml-1">สลับลำดับ</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(stop)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-slate-700 hover:bg-slate-100 font-medium"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                        <span>แก้ไขจุดพัก</span>
                      </button>

                      <button
                        onClick={() => handleDeleteStop(stop.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-rose-600 hover:bg-rose-50 font-medium"
                        title="ลบจุดพักนี้ออกจากแผน"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ลบ</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}

        {/* ================= STEP FINAL: DESTINATION ================= */}
        <div id="timeline-step-destination" className="relative space-y-3">
          {/* Last Leg between last stop & destination */}
          {trip.legs.length > 0 && (
            <div className="ml-10 sm:ml-12 pl-4 py-2 border-l-2 border-dashed border-blue-300 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded border border-blue-200">
                  ขับช่วงสุดท้าย: {trip.legs[trip.legs.length - 1].legDistanceKm} กม.
                </span>
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" /> ใช้เวลาประมาณ {formatDurationThai(trip.legs[trip.legs.length - 1].driveTimeMinutes)}
                </span>
                <span className="text-slate-400">
                  (มุ่งหน้าสู่ถนนมิตรภาพ / ทางแยกจอหอ)
                </span>
              </div>

              <button
                onClick={() => onOpenStationPicker(Math.round(trip.totalDistanceKm - 100))}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                title="แทรกจุดพักรถเพิ่มก่อนถึงปลายทาง"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ แทรกจุดพักก่อนถึงปลายทาง</span>
              </button>
            </div>
          )}

          {/* Destination Node */}
          <div className="relative flex items-start gap-4">
            <div className="relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-md ring-4 ring-rose-100 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>

            <div className="flex-1 bg-rose-50/60 border border-rose-200 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-600 text-white">
                    จุดหมายปลายทาง (Destination)
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    กม. {trip.totalDistanceKm} (สิ้นสุดการเดินทาง)
                  </span>
                </div>
                <div className="text-sm font-extrabold text-rose-800">
                  คาดการณ์ถึงปลายทาง: {trip.arrivalTime}
                </div>
              </div>

              <h4 className="text-base font-bold text-slate-900 mt-1.5">
                {DESTINATION_INFO.name}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {DESTINATION_INFO.address} (Plus Code: {DESTINATION_INFO.plusCode})
              </p>

              <div className="mt-2.5 pt-2 border-t border-rose-200/60 flex items-center justify-between text-xs text-rose-900">
                <span className="flex items-center gap-1 font-medium">
                  ✓ เดินทางถึงอย่างปลอดภัย รวมระยะทาง {trip.totalDistanceKm} กม.
                </span>
                <a
                  href={DESTINATION_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-700 hover:underline flex items-center gap-1 font-bold"
                >
                  เปิดพิกัดจริงบน Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom helper prompt */}
      <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>ต้องการแวะปั๊มอื่นเพิ่มเติม? คลิก <strong>"เพิ่มจุดพักรถ (+ Add Stop)"</strong> หรือเลือกดูจากแถบ <strong>"รายชื่อปั๊มน้ำมัน"</strong></span>
        </div>
        <button
          onClick={() => onOpenStationPicker()}
          className="text-blue-600 hover:text-blue-800 font-bold underline self-end sm:self-auto"
        >
          เลือกปั๊ม ปตท./บางจาก/เชลล์/PT จากแคตตาล็อก ➔
        </button>
      </div>

    </div>
  );
};

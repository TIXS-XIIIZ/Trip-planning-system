import React from 'react';
import { VehicleSetting, RouteOption } from '../types';
import { DEFAULT_VEHICLE_SETTINGS, EMERGENCY_CONTACTS } from '../data/routeData';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Fuel, 
  Zap, 
  PhoneCall, 
  Copy, 
  Check, 
  Mountain, 
  Eye, 
  Wrench, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

interface SafetyAndCostSectionProps {
  vehicle: VehicleSetting;
  onVehicleChange: (vehicle: VehicleSetting) => void;
  route: RouteOption;
  totalDistanceKm: number;
}

export const SafetyAndCostSection: React.FC<SafetyAndCostSectionProps> = ({
  vehicle,
  onVehicleChange,
  route,
  totalDistanceKm,
}) => {
  const [copiedNumber, setCopiedNumber] = React.useState<string | null>(null);

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const fuelUnits = Number((totalDistanceKm / vehicle.consumptionRate).toFixed(1));
  const estimatedCost = Math.round(fuelUnits * vehicle.fuelPricePerUnit);

  return (
    <div id="safety-cost-section-container" className="space-y-6 mb-8">
      
      {/* 1. Vehicle & Fuel Calculator Card */}
      <div id="card-fuel-calculator" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Fuel className="w-5 h-5 text-emerald-600" />
              <span>คำนวณค่าน้ำมัน & ค่าพลังงานชาร์จไฟ EV</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              คำนวณตามระยะทางจริง {totalDistanceKm} กม. สามารถปรับเปลี่ยนประเภทรถและอัตราสิ้นเปลืองได้
            </p>
          </div>

          <div className="bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 text-right self-start sm:self-auto">
            <div className="text-[11px] text-emerald-800 font-semibold">ประมาณการค่าใช้จ่าย</div>
            <div className="text-xl font-black text-emerald-950">
              ≈ {estimatedCost.toLocaleString()} <span className="text-xs font-bold text-emerald-800">บาท</span>
            </div>
          </div>
        </div>

        {/* Vehicle Selection Grid */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            เลือกประเภทยานพาหนะที่ใช้เดินทาง:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {DEFAULT_VEHICLE_SETTINGS.map((v) => {
              const isSelected = vehicle.type === v.type;
              return (
                <button
                  key={v.type}
                  id={`btn-select-vehicle-${v.type}`}
                  type="button"
                  onClick={() => onVehicleChange(v)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 font-bold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="text-xs text-slate-900 font-bold leading-tight">
                    {v.name.split('/')[0]}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {v.consumptionRate} {v.type === 'ev' ? 'กม./kWh' : 'กม./ลิตร'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Customizable parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              อัตราสิ้นเปลือง ({vehicle.type === 'ev' ? 'กม./หน่วย kWh' : 'กม./ลิตร'}):
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              value={vehicle.consumptionRate}
              onChange={(e) => onVehicleChange({ ...vehicle, consumptionRate: Number(e.target.value) || 1 })}
              className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              ราคาพลังงาน ({vehicle.type === 'ev' ? 'บาท/kWh' : 'บาท/ลิตร'}):
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              value={vehicle.fuelPricePerUnit}
              onChange={(e) => onVehicleChange({ ...vehicle, fuelPricePerUnit: Number(e.target.value) || 1 })}
              className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              ปริมาณเชื้อเพลิงที่ต้องใช้โดยประมาณ:
            </label>
            <div className="px-3 py-1.5 text-sm bg-slate-100 border border-slate-200 rounded-lg font-extrabold text-slate-800">
              {fuelUnits} {vehicle.type === 'ev' ? 'kWh' : 'ลิตร'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mountain Driving & Highway Safety Guide Card */}
      <div id="card-safety-guide" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">
            ข้อแนะนำความปลอดภัย & จุดเสี่ยงบนเส้นทางลำพูน - โคราช
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          
          {/* Mountain sections warning */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-3">
            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <Mountain className="w-4 h-4 text-amber-700" />
              <span>จุดเสี่ยงทางเขาลาดชันที่ต้องระวังเป็นพิเศษ:</span>
            </h4>

            <div className="space-y-2.5 text-xs text-amber-950">
              <div className="p-2.5 bg-white/80 rounded-lg border border-amber-200/80">
                <strong className="text-amber-900">1. ทางขึ้น-ลงเขาพลึง (ทล.11 เด่นชัย แพร่ - ตรอน อุตรดิตถ์):</strong>
                <p className="text-slate-700 mt-1">
                  ทางโค้งลาดชันต่อเนื่อง ควรใช้เกียร์ต่ำ (Engine Brake) เพื่อช่วยชะลอความเร็ว <strong>ห้ามเหยียบเบรคแช่ยาวต่อเนื่อง</strong> เพื่อป้องกันอาการเบรกเฟด (Brake Fade)
                </p>
              </div>

              <div className="p-2.5 bg-white/80 rounded-lg border border-amber-200/80">
                <strong className="text-amber-900">2. ทางสาย 12 วังทอง - หล่มสัก (พิษณุโลก - เพชรบูรณ์):</strong>
                <p className="text-slate-700 mt-1">
                  ทางขึ้น-ลงเขาบรรยากาศสวยงามแต่มีโค้งหักศอก ระวังรถบรรทุกช้าในช่องทางซ้าย และระวังหมอกหนาในช่วงเช้าหรือฝนตก
                </p>
              </div>

              <div className="p-2.5 bg-white/80 rounded-lg border border-amber-200/80">
                <strong className="text-amber-900">3. ทางหลวง 201 ช่วงคอนสาร - ภูเขียว - ชัยภูมิ:</strong>
                <p className="text-slate-700 mt-1">
                  ถนนทางราบผ่านชุมชนและย่านเกษตรกรรม มีจุดกลับรถและรถจักรยานยนต์ในพื้นที่ ควรชะลอความเร็วเมื่อผ่านเขตเทศบาล
                </p>
              </div>
            </div>
          </div>

          {/* Pre-Trip Inspection Checklist */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" />
              <span>รายการตรวจเช็คสภาพรถก่อนเดินทางไกล (Pre-Trip Checklist):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>ลมยางทั้ง 4 ล้อ + ยางอะไหล่</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>น้ำมันเบรก & ผ้าเบรก</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>ระดับน้ำยาหม้อน้ำ/หล่อเย็น</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>ระดับน้ำมันเครื่อง</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>น้ำฉีดกระจก & ยางปัดน้ำฝน</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>ระบบไฟส่องสว่าง & ไฟเลี้ยวทุกดวง</span>
              </div>
            </div>

            <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200 text-xs text-blue-900">
              <span className="font-bold">กฎเหล็กป้องกันความง่วง (Driver Fatigue):</span> พักรถทุกๆ 2 - 2.5 ชม. (หรือประมาณ 150-200 กม.) นานอย่างน้อย 15-20 นาที หากมีอาการตาปรือให้จอดงีบ 15 นาทีทันที
            </div>
          </div>

        </div>
      </div>

      {/* 3. Emergency Contacts Directory */}
      <div id="card-emergency-contacts" className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-rose-400" />
              <span>เบอร์โทรฉุกเฉิน & ช่วยเหลือบนทางหลวง 24 ชั่วโมง</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              กดโทรออกหรือคัดลอกเบอร์โทรได้ทันทีเมื่อเกิดเหตุฉุกเฉินหรือต้องการสอบถามเส้นทาง
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {EMERGENCY_CONTACTS.map((c) => (
            <div
              key={c.number}
              className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-200">{c.name}</span>
                  <button
                    onClick={() => handleCopy(c.number)}
                    className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                    title="คัดลอกเบอร์โทร"
                  >
                    {copiedNumber === c.number ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{c.desc}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-lg font-black text-emerald-400 tracking-wider">
                  {c.number}
                </span>
                <a
                  href={`tel:${c.number.replace(/-/g, '')}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>โทรออก</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

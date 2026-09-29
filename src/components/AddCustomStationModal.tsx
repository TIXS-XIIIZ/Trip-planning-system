import React, { useState } from 'react';
import { GasStation, BrandType, RouteOption } from '../types';
import { X, Fuel, Plus, Clock, MapPin, Check, Sparkles } from 'lucide-react';

interface AddCustomStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomStation: (station: GasStation, addToStopsImmediately?: boolean) => void;
  route: RouteOption;
}

export const AddCustomStationModal: React.FC<AddCustomStationModalProps> = ({
  isOpen,
  onClose,
  onAddCustomStation,
  route,
}) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState<BrandType>('PTT');
  const [location, setLocation] = useState('');
  const [highwayNumber, setHighwayNumber] = useState('ทล.1');
  const [kmFromStart, setKmFromStart] = useState<number>(300);
  const [has24Hour, setHas24Hour] = useState(true);
  const [has7Eleven, setHas7Eleven] = useState(true);
  const [hasCoffee, setHasCoffee] = useState(true);
  const [hasEV, setHasEV] = useState(false);
  const [hasFood, setHasFood] = useState(false);
  const [recommendedFor, setRecommendedFor] = useState('ปั๊มเปิด 24 ชม. พักเข้าห้องน้ำและเติมน้ำมัน');
  const [addDirectlyAsStop, setAddDirectlyAsStop] = useState(false);

  if (!isOpen) return null;

  // Approximate coordinate interpolation along route Coordinates
  const getInterpolatedCoord = (km: number): [number, number] => {
    const coords = route.routeCoordinates;
    if (!coords || coords.length === 0) return [16.5, 100.0];
    const totalKm = route.totalDistanceKm || 700;
    const progress = Math.min(0.99, Math.max(0.01, km / totalKm));
    const targetIndexFloat = progress * (coords.length - 1);
    const lowerIdx = Math.floor(targetIndexFloat);
    const upperIdx = Math.min(coords.length - 1, lowerIdx + 1);
    const frac = targetIndexFloat - lowerIdx;

    const lat = coords[lowerIdx][0] + (coords[upperIdx][0] - coords[lowerIdx][0]) * frac;
    const lng = coords[lowerIdx][1] + (coords[upperIdx][1] - coords[lowerIdx][1]) * frac;
    return [Number(lat.toFixed(4)), Number(lng.toFixed(4))];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const km = Number(kmFromStart) || 100;
    const coord = getInterpolatedCoord(km);

    const newStation: GasStation = {
      id: `custom-station-${Date.now()}`,
      name: name.trim(),
      brand,
      location: location.trim() || `ริมถนน ${highwayNumber} (กม. ${km})`,
      highwayNumber: highwayNumber.trim() || 'ทล.หลัก',
      kmFromStart: km,
      coordinates: coord,
      amenities: {
        has24Hour,
        has7Eleven,
        hasCafeAmazon: hasCoffee && brand === 'PTT',
        hasInthanin: hasCoffee && brand === 'Bangchak',
        hasEVCharger: hasEV,
        hasFoodCourt: hasFood,
        hasCleanToilet: true,
        hasAirPump: true,
        hasAtm: true,
      },
      recommendedFor: recommendedFor.trim() || (has24Hour ? 'ปั๊มเปิด 24 ชม. พักผ่อนแก้ง่วง' : 'จุดแวะพักรถ'),
      highlights: [
        has24Hour ? 'เปิด 24 ชม.' : 'เปิดบริการตามเวลา',
        'ปั๊มที่คุณเพิ่มเอง ⭐',
        hasEV ? 'มีตู้ชาร์จ EV' : 'ห้องน้ำสะอาด',
      ],
    };

    onAddCustomStation(newStation, addDirectlyAsStop);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Fuel className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold">กรอกเพิ่มปั๊มน้ำมันเอง</h3>
              <p className="text-[11px] text-blue-100">
                เพิ่มพิกัดปั๊มที่เปิด 24 ชม. หรือจุดที่คุณรู้จักลงในแผนที่
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5 text-xs">
          
          {/* Station Name */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              ชื่อปั๊มน้ำมัน <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น ปตท. หนองแค 24 ชม., บางจาก ป่าโมก..."
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-slate-900 font-medium"
            />
          </div>

          {/* Brand & Highway */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ยี่ห้อ / แบรนด์</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value as BrandType)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="PTT">ปตท. (PTT Station)</option>
                <option value="Bangchak">บางจาก (Bangchak)</option>
                <option value="Shell">เชลล์ (Shell)</option>
                <option value="Caltex">คาลเท็กซ์ (Caltex)</option>
                <option value="PT">พีที (PT Max)</option>
                <option value="Other">ปั๊มอื่นๆ / จุดพักอิสระ</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ถนน / ทางหลวง</label>
              <input
                type="text"
                value={highwayNumber}
                onChange={(e) => setHighwayNumber(e.target.value)}
                placeholder="เช่น ทล.1, ทล.32, ทล.2"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Km from Start & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                กม. ที่ประมาณการ (จากจุดเริ่มต้น)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="5"
                  max={route.totalDistanceKm || 800}
                  value={kmFromStart}
                  onChange={(e) => setKmFromStart(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-slate-500 font-semibold shrink-0">กม.</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                (เส้นทางนี้ยาว {route.totalDistanceKm} กม.)
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">อำเภอ / จังหวัด</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="เช่น อ.เมืองนครสวรรค์, อ.บ้านตาก"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Open 24 Hours Highlight Toggle */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-950 text-xs">
              <input
                type="checkbox"
                checked={has24Hour}
                onChange={(e) => setHas24Hour(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <Clock className="w-4 h-4 text-amber-600" />
              <span>ปั๊มนี้เปิดให้บริการ 24 ชั่วโมง (24 Hours Open)</span>
            </label>
            <p className="text-[11px] text-amber-800 ml-6 mt-0.5">
              จะแสดงป้าย "24 ชม." บนหมุดแผนที่และติดสัญลักษณ์ในรายการ
            </p>
          </div>

          {/* Facilities Checkboxes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">สิ่งอำนวยความสะดวกในปั๊ม</label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer text-slate-800">
                <input
                  type="checkbox"
                  checked={has7Eleven}
                  onChange={(e) => setHas7Eleven(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>7-Eleven สะดวกซื้อ</span>
              </label>

              <label className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer text-slate-800">
                <input
                  type="checkbox"
                  checked={hasCoffee}
                  onChange={(e) => setHasCoffee(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>ร้านกาแฟ (Amazon/Inthanin)</span>
              </label>

              <label className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer text-slate-800">
                <input
                  type="checkbox"
                  checked={hasEV}
                  onChange={(e) => setHasEV(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>ตู้ชาร์จรถยนต์ไฟฟ้า (EV)</span>
              </label>

              <label className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer text-slate-800">
                <input
                  type="checkbox"
                  checked={hasFood}
                  onChange={(e) => setHasFood(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>ศูนย์อาหาร / ร้านข้าว</span>
              </label>
            </div>
          </div>

          {/* Notes / Reason */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">คำแนะนำ / จุดเด่นของปั๊ม</label>
            <input
              type="text"
              value={recommendedFor}
              onChange={(e) => setRecommendedFor(e.target.value)}
              placeholder="เช่น ห้องน้ำสะอาดมาก, มีร้านของฝาก, แวะพักทานข้าว"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Add directly as stop checkbox */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-slate-800 font-semibold">
              <input
                type="checkbox"
                checked={addDirectlyAsStop}
                onChange={(e) => setAddDirectlyAsStop(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>บรรจุเป็น "จุดพักรถในแผนการเดินทางทันที" (พัก 20 นาที)</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>บันทึกปั๊มลงแผนที่</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

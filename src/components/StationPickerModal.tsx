import React, { useState } from 'react';
import { GasStation, RestStop, BrandType } from '../types';
import { 
  X, 
  Search, 
  Plus, 
  Check, 
  Fuel, 
  MapPin, 
  Zap, 
  Coffee, 
  Utensils, 
  Edit3, 
  SlidersHorizontal,
  Navigation,
  Sparkles,
  Info,
  Clock
} from 'lucide-react';

interface StationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  gasStations: GasStation[];
  currentStops: RestStop[];
  onAddStation: (station: GasStation, durationMinutes: number) => void;
  onAddCustomStop?: (customStop: RestStop) => void;
  defaultInsertKm?: number;
}

export const StationPickerModal: React.FC<StationPickerModalProps> = ({
  isOpen,
  onClose,
  gasStations,
  currentStops,
  onAddStation,
  onAddCustomStop,
  defaultInsertKm,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'custom'>('catalog');
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedDuration, setSelectedDuration] = useState(20);

  // Custom Stop Form State
  const [customName, setCustomName] = useState('');
  const [customBrand, setCustomBrand] = useState<BrandType>('PTT');
  const [customLocation, setCustomLocation] = useState('');
  const [customHighway, setCustomHighway] = useState('ทล.11 / ทล.12 / ทล.21');
  const [customKm, setCustomKm] = useState<number>(defaultInsertKm || 250);
  const [customDuration, setCustomDuration] = useState<number>(20);
  const [customActivity, setCustomActivity] = useState('เข้าห้องน้ำ + เติมน้ำมัน / กาแฟ');
  const [customNotes, setCustomNotes] = useState('');
  const [has7Eleven, setHas7Eleven] = useState(true);
  const [hasCoffee, setHasCoffee] = useState(true);
  const [hasEV, setHasEV] = useState(false);
  const [hasFood, setHasFood] = useState(true);
  const [has24Hour, setHas24Hour] = useState(true);

  if (!isOpen) return null;

  const brands: { label: string; value: string }[] = [
    { label: 'ทุกแบรนด์ (All)', value: 'ALL' },
    { label: 'ปตท. (PTT)', value: 'PTT' },
    { label: 'บางจาก (Bangchak)', value: 'Bangchak' },
    { label: 'เชลล์ (Shell)', value: 'Shell' },
    { label: 'คาลเท็กซ์ (Caltex)', value: 'Caltex' },
    { label: 'พีที (PT)', value: 'PT' },
  ];

  const filteredStations = gasStations.filter(s => {
    const q = search.toLowerCase();
    const matchesSearch = 
      s.name.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q) ||
      s.highwayNumber.toLowerCase().includes(q) ||
      s.recommendedFor.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (selectedBrand !== 'ALL' && s.brand !== selectedBrand) return false;
    return true;
  });

  const isAdded = (stationId: string) => {
    return currentStops.some(s => s.stationId === stationId || s.name === stationId);
  };

  const handleCreateCustomStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newStop: RestStop = {
      id: `custom-stop-${Date.now()}`,
      stationId: `custom-${Date.now()}`,
      name: customName.trim(),
      brand: customBrand,
      location: customLocation.trim() || 'จุดแวะพักบนเส้นทาง',
      highwayNumber: customHighway.trim() || 'ทล.สายหลัก',
      kmFromStart: Number(customKm) || 200,
      driveTimeFromPrevMin: 60,
      durationMinutes: Number(customDuration) || 20,
      activity: customActivity.trim() || 'พักผ่อน / เข้าห้องน้ำ',
      notes: customNotes.trim() || undefined,
      coordinates: [16.8 + (Math.random() - 0.5) * 0.5, 100.5 + (Math.random() - 0.5) * 0.5],
      amenities: {
        hasCafeAmazon: hasCoffee && customBrand === 'PTT',
        hasInthanin: hasCoffee && customBrand === 'Bangchak',
        has7Eleven: has7Eleven,
        hasEVCharger: hasEV,
        hasCleanToilet: true,
        hasFoodCourt: hasFood,
        has24Hour: has24Hour,
      }
    };

    if (onAddCustomStop) {
      onAddCustomStop(newStop);
    } else {
      // Fallback: convert to station format
      const stationObj: GasStation = {
        id: newStop.stationId!,
        name: newStop.name,
        brand: newStop.brand || 'PTT',
        location: newStop.location,
        highwayNumber: newStop.highwayNumber,
        kmFromStart: newStop.kmFromStart,
        coordinates: newStop.coordinates,
        amenities: newStop.amenities || { has7Eleven: true, hasCafeAmazon: true, hasCleanToilet: true },
        recommendedFor: newStop.activity,
      };
      onAddStation(stationObj, newStop.durationMinutes);
    }

    onClose();
  };

  return (
    <div id="station-picker-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Fuel className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm sm:text-base font-bold">กำหนด & เพิ่มจุดพักรถในแผนการเดินทาง</h3>
              <p className="text-xs text-slate-400">เลือกปั๊มน้ำมันบนเส้นทาง หรือพิมพ์กำหนดจุดพักเองตามใจชอบ</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
          <button
            id="tab-btn-catalog"
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'catalog'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Fuel className="w-4 h-4" />
            <span>เลือกจากปั๊มน้ำมันบนเส้นทาง ({gasStations.length} แห่ง)</span>
          </button>

          <button
            id="tab-btn-custom"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'custom'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>กำหนดจุดพัก/ปั๊มเอง (Custom Stop)</span>
          </button>
        </div>

        {/* TAB 1: CATALOG OF GAS STATIONS */}
        {activeTab === 'catalog' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Search & Filters */}
            <div className="p-3 sm:p-4 border-b border-slate-100 space-y-3 bg-slate-50 shrink-0">
              
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-picker-search"
                  type="text"
                  placeholder="ค้นหาชื่อปั๊ม, จุดแวะ, อำเภอ (เด่นชัย, หล่มสัก, ชัยภูมิ, วังทอง, สากเหล็ก)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              {/* Brand Pills & Duration default */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
                  {brands.map(b => (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() => setSelectedBrand(b.value)}
                      className={`px-2.5 py-1 text-xs rounded-md font-semibold whitespace-nowrap transition-colors ${
                        selectedBrand === b.value
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs shrink-0 self-end sm:self-auto">
                  <span className="text-slate-500 font-medium">เวลาพัก:</span>
                  {[15, 20, 30, 45, 60].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDuration(d)}
                      className={`px-1.5 py-0.5 rounded text-xs font-bold transition-colors ${
                        selectedDuration === d 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {d}น.
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Station List */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
              {filteredStations.map(st => {
                const added = isAdded(st.id);
                return (
                  <div
                    key={st.id}
                    className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                      added ? 'bg-blue-50/60 border-blue-200 shadow-2xs' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          st.brand === 'PTT' ? 'bg-blue-100 text-blue-800' :
                          st.brand === 'Bangchak' ? 'bg-emerald-100 text-emerald-800' :
                          st.brand === 'Shell' ? 'bg-amber-100 text-amber-800' :
                          st.brand === 'Caltex' ? 'bg-rose-100 text-rose-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {st.brand} Station
                        </span>
                        <span className="text-xs font-extrabold text-slate-900">
                          กม. {st.kmFromStart} ({st.highwayNumber})
                        </span>
                      </div>
                      
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{st.name}</h4>
                      <p className="text-xs text-slate-500">{st.location}</p>
                      
                      {st.recommendedFor && (
                        <div className="text-[11px] text-blue-700 mt-1 font-medium">
                          💡 {st.recommendedFor}
                        </div>
                      )}

                      {/* Amenities pills */}
                      <div className="flex items-center gap-1 flex-wrap mt-1.5">
                        {st.amenities.has24Hour && (
                          <span className="text-[10px] bg-slate-800 text-white px-1.5 py-0.2 rounded border border-slate-700 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" /> 24 ชม.
                          </span>
                        )}
                        {st.amenities.has7Eleven && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">7-11</span>
                        )}
                        {st.amenities.hasCafeAmazon && (
                          <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200">Amazon</span>
                        )}
                        {st.amenities.hasInthanin && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">Inthanin</span>
                        )}
                        {st.amenities.hasEVCharger && (
                          <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.2 rounded border border-sky-200 flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5" /> EV
                          </span>
                        )}
                        {st.amenities.hasFoodCourt && (
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded border border-indigo-200">ศูนย์อาหาร</span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 self-end sm:self-auto">
                      {added ? (
                        <span className="text-xs font-bold text-blue-700 flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-blue-200 shadow-2xs">
                          <Check className="w-3.5 h-3.5" /> อยู่ในแผนแล้ว
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            onAddStation(st, selectedDuration);
                            onClose();
                          }}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>เพิ่มจุดนี้ ({selectedDuration}น.)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredStations.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                  <Fuel className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                  <p className="font-semibold text-xs">ไม่พบปั๊มน้ำมันตามคำค้นหา</p>
                  <button 
                    onClick={() => setActiveTab('custom')}
                    className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                  >
                    ต้องการกำหนดจุดพักเอง? คลิกที่นี่ ➔
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOM STOP FORM */}
        {activeTab === 'custom' && (
          <form onSubmit={handleCreateCustomStop} className="flex-1 flex flex-col min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>กำหนดจุดพักเองได้ตามใจชอบ:</strong> สามารถเพิ่มจุดแวะพักทานข้าว, ร้านกาแฟ, จุดชมวิว, หรือปั๊มน้ำมันสาขาเฉพาะที่คุณต้องการ ระบบจะคำนวณเวลาเดินทางและจัดลำดับให้อัตโนมัติ
              </div>
            </div>

            {/* Name & Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อจุดพัก / ชื่อปั๊ม / ร้านอาหาร *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ปั๊ม ปตท. สาขาวังทอง, ร้านไก่ย่างวิเชียรบุรี, จุดพักรถเขาพลึง"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  แบรนด์ / ประเภท
                </label>
                <select
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value as BrandType)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="PTT">ปตท. (PTT Station)</option>
                  <option value="Bangchak">บางจาก (Bangchak)</option>
                  <option value="Shell">เชลล์ (Shell)</option>
                  <option value="Caltex">คาลเท็กซ์ (Caltex)</option>
                  <option value="PT">พีที (PT)</option>
                </select>
              </div>
            </div>

            {/* Location & Highway & Kilometer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ตำแหน่ง / อำเภอ / จังหวัด
                </label>
                <input
                  type="text"
                  placeholder="เช่น อ.เด่นชัย จ.แพร่"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  หมายเลขทางหลวง
                </label>
                <input
                  type="text"
                  placeholder="เช่น ทล.11, ทล.12, ทล.21"
                  value={customHighway}
                  onChange={(e) => setCustomHighway(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  กิโลเมตรจากจุดเริ่มต้น (กม.)
                </label>
                <input
                  type="number"
                  min="1"
                  max="700"
                  required
                  value={customKm}
                  onChange={(e) => setCustomKm(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Duration & Activity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ระยะเวลาพัก (นาที)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(Number(e.target.value))}
                    className="w-24 px-3 py-1.5 text-xs sm:text-sm font-bold bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <div className="flex gap-1">
                    {[15, 20, 30, 45, 60].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setCustomDuration(d)}
                        className={`px-2 py-1 text-xs rounded border transition-colors ${
                          customDuration === d ? 'bg-blue-600 text-white font-bold' : 'bg-slate-50 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {d}น.
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  กิจกรรม / วัตถุประสงค์
                </label>
                <input
                  type="text"
                  placeholder="เช่น ทานอาหารกลางวัน, เติมน้ำมัน, พักสายตา"
                  value={customActivity}
                  onChange={(e) => setCustomActivity(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                สิ่งอำนวยความสะดวกในจุดนี้:
              </label>
              <div className="flex items-center gap-4 flex-wrap text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={has24Hour}
                    onChange={(e) => setHas24Hour(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>เปิด 24 ชม.</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={has7Eleven}
                    onChange={(e) => setHas7Eleven(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>7-Eleven</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasCoffee}
                    onChange={(e) => setHasCoffee(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>ร้านกาแฟ (Cafe Amazon/Inthanin)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasFood}
                    onChange={(e) => setHasFood(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>ศูนย์อาหาร / ร้านข้าว</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasEV}
                    onChange={(e) => setHasEV(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>ตู้ชาร์จ EV</span>
                </label>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                หมายเหตุเพิ่มเติม / ข้อควรระวัง (ถ้ามี)
              </label>
              <input
                type="text"
                placeholder="เช่น ทางเข้าอยู่ซ้ายมือก่อนถึงสะพาน, มีจุดจอดรถกว้างขวาง"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มจุดพักนี้ลงในแผน</span>
              </button>
            </div>

          </form>
        )}

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1 text-[11px]">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>จุดพักปัจจุบันในแผน: <strong>{currentStops.length} จุด</strong> (สามารถเพิ่มลดกี่จุดก็ได้)</span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};

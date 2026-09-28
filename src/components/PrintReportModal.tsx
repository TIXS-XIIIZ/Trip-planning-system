import React from 'react';
import { X, Printer, Navigation, MapPin, Clock, Fuel, ShieldCheck, PhoneCall } from 'lucide-react';
import { CalculatedTrip, formatDurationThai } from '../utils/tripCalculator';
import { RouteOption, VehicleSetting, RestStop } from '../types';
import { DESTINATION_INFO, ORIGIN_INFO, EMERGENCY_CONTACTS } from '../data/routeData';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: CalculatedTrip;
  route: RouteOption;
  vehicle: VehicleSetting;
  stops: RestStop[];
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  trip,
  route,
  vehicle,
  stops,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Actions header (Hidden on Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold">เอกสารรายงานสรุปแผนการเดินทาง (Print Preview)</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์เอกสาร / บันทึก PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div id="printable-report-area" className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 text-slate-900 bg-white">
          
          {/* Official Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              รายงานแผนการเดินทาง & สรุปจุดพักรถเพื่อความปลอดภัย
            </h1>
            <p className="text-sm text-slate-600 mt-1 font-medium">
              เส้นทาง: บิ๊กซี ลำพูน ➔ ศูนย์ฝึกอบรมตำรวจภูธรภาค 3 (จอหอ นครราชสีมา)
            </p>
            <div className="text-xs text-slate-500 mt-1">
              วันที่พิมพ์: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500">ระยะทางรวม:</span>
              <div className="text-base font-bold text-slate-900">{trip.totalDistanceKm} กิโลเมตร</div>
            </div>
            <div>
              <span className="text-slate-500">เวลาออกเดินทาง:</span>
              <div className="text-base font-bold text-blue-700">{trip.departureTime}</div>
            </div>
            <div>
              <span className="text-slate-500">คาดการณ์ถึงปลายทาง:</span>
              <div className="text-base font-bold text-emerald-700">{trip.arrivalTime}</div>
            </div>
            <div>
              <span className="text-slate-500">เวลารวมตลอดทริป:</span>
              <div className="text-base font-bold text-slate-900">
                {formatDurationThai(trip.totalDurationMinutes)}
              </div>
            </div>
          </div>

          {/* Locations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-emerald-800">จุดเริ่มต้น (Origin):</strong>
              <div className="font-bold text-slate-900 mt-0.5">{ORIGIN_INFO.name}</div>
              <div className="text-slate-600">{ORIGIN_INFO.address}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-rose-800">จุดหมายปลายทาง (Destination):</strong>
              <div className="font-bold text-slate-900 mt-0.5">{DESTINATION_INFO.name}</div>
              <div className="text-slate-600">{DESTINATION_INFO.address} (Plus Code: {DESTINATION_INFO.plusCode})</div>
            </div>
          </div>

          {/* Detailed Stops Table */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-2">
              ตารางเวลาการเดินทางและจุดพักรถ (Itinerary & Stop Schedule)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-300">
                <thead className="bg-slate-100 font-bold text-slate-800">
                  <tr>
                    <th className="border border-slate-300 p-2">ลำดับ</th>
                    <th className="border border-slate-300 p-2">จุดพัก / สถานที่</th>
                    <th className="border border-slate-300 p-2 text-center">กม.</th>
                    <th className="border border-slate-300 p-2 text-center">เวลาถึง</th>
                    <th className="border border-slate-300 p-2 text-center">พัก (นาที)</th>
                    <th className="border border-slate-300 p-2 text-center">เวลาออก</th>
                    <th className="border border-slate-300 p-2">กิจกรรม / วัตถุประสงค์</th>
                  </tr>
                </thead>
                <tbody>
                  {trip.legs.map((leg, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="border border-slate-300 p-2 text-center font-bold">
                        {leg.isOrigin ? 'ต้นทาง' : leg.isDestination ? 'ปลายทาง' : `พักที่ ${idx}`}
                      </td>
                      <td className="border border-slate-300 p-2 font-medium">
                        {leg.toName}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-bold text-slate-700">
                        {leg.cumulativeDistanceKm}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-semibold text-blue-700">
                        {leg.arrivalTimeStr}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-bold text-rose-600">
                        {leg.stopDurationMinutes > 0 ? `${leg.stopDurationMinutes} น.` : '-'}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-semibold text-slate-800">
                        {leg.isDestination ? '-' : leg.departureTimeStr}
                      </td>
                      <td className="border border-slate-300 p-2 text-slate-700">
                        {leg.activity || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Safety rules and Emergency numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 mb-1">กฎความปลอดภัย & จุดระวัง:</h3>
              <ul className="list-disc pl-4 space-y-1 text-slate-700">
                <li>ระวังทางโค้งลาดชันช่วง <strong>เขาพลึง (เด่นชัย - อุตรดิตถ์ ทล.11)</strong> ใช้เกียร์ต่ำ ห้ามแช่เบรก</li>
                <li>จุดกึ่งกลางพักทานอาหารหลักที่ <strong>ปตท. สี่แยกหล่มสัก (กม. 338)</strong></li>
                <li>ตรวจเช็คลมยางและระดับน้ำมันเครื่องก่อนออกเดินทาง</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-1">เบอร์โทรฉุกเฉินทางหลวง:</h3>
              <div className="grid grid-cols-2 gap-2 text-slate-800">
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <div>ตำรวจทางหลวง: <strong>1193</strong></div>
                  <div>กู้ชีพฉุกเฉิน: <strong>1669</strong></div>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <div>สายด่วนกรมทางหลวง: <strong>1586</strong></div>
                  <div>ศฝร.ภ.3 จอหอ: <strong>044-242-555</strong></div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

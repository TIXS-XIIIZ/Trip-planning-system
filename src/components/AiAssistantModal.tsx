import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  ShieldCheck, 
  Utensils, 
  Fuel, 
  AlertTriangle, 
  Loader2, 
  Bot,
  RefreshCw
} from 'lucide-react';
import { CalculatedTrip } from '../utils/tripCalculator';
import { RouteOption, VehicleSetting, RestStop } from '../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: CalculatedTrip;
  route: RouteOption;
  vehicle: VehicleSetting;
  stops: RestStop[];
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  trip,
  route,
  vehicle,
  stops,
}) => {
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [customResponse, setCustomResponse] = useState<string | null>(null);
  const [customLoading, setCustomLoading] = useState(false);

  const fetchAnalysis = async (userPref?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/analyze-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          routeTitle: route.title,
          departureTime: trip.departureTime,
          estimatedArrival: trip.arrivalTime,
          totalDistanceKm: trip.totalDistanceKm,
          totalDriveTimeMin: trip.totalDriveMinutes,
          totalRestTimeMin: trip.totalRestMinutes,
          stops: stops,
          vehicleType: vehicle.name,
          specialPreferences: userPref || 'วิเคราะห์ความปลอดภัย จุดพัก และของกินแนะนำ',
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysisData(data.analysis);
      }
    } catch (err) {
      console.error('Failed to analyze trip with AI:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !analysisData) {
      fetchAnalysis();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAskCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setCustomLoading(true);
    setCustomResponse(null);
    try {
      const res = await fetch('/api/ai/analyze-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          routeTitle: route.title,
          departureTime: trip.departureTime,
          estimatedArrival: trip.arrivalTime,
          totalDistanceKm: trip.totalDistanceKm,
          totalDriveTimeMin: trip.totalDriveMinutes,
          totalRestTimeMin: trip.totalRestMinutes,
          stops: stops,
          vehicleType: vehicle.name,
          specialPreferences: customPrompt,
        }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setCustomResponse(data.analysis.summary || JSON.stringify(data.analysis));
      }
    } catch (err) {
      setCustomResponse('เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI กรุณาลองใหม่อีกครั้ง');
    } finally {
      setCustomLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                ผู้ช่วยวิเคราะห์การเดินทางอัจฉริยะ (AI Road Navigator)
              </h3>
              <p className="text-xs text-purple-200">
                ขับเคลื่อนด้วย Gemini 3.7 Flash วิเคราะห์ความปลอดภัยและเส้นทางแบบเฉพาะตัว
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-800">
                กำลังให้ AI ประมวลผลเส้นทาง ลำพูน ➔ โคราช...
              </p>
              <p className="text-xs text-slate-500">
                คำนวณจุดพักรถ สภาพถนน และช่วงเวลาขับขี่ปลอดภัย
              </p>
            </div>
          ) : (
            <>
              {/* AI Summary Banner */}
              {analysisData?.summary && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-xs sm:text-sm text-purple-950">
                  <div className="flex items-center gap-1.5 font-bold text-purple-900 mb-1.5">
                    <Bot className="w-4 h-4 text-purple-700" />
                    <span>บทวิเคราะห์ภาพรวมจาก AI:</span>
                  </div>
                  <p className="leading-relaxed">{analysisData.summary}</p>
                </div>
              )}

              {/* Safety Tips */}
              {analysisData?.safetyTips && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>คำแนะนำความปลอดภัย & สภาพถนน (Safety & Road Warnings)</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {analysisData.safetyTips.map((tip: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fuel & Rest Rationale */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analysisData?.fuelStrategy && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                      <Fuel className="w-3.5 h-3.5 text-blue-600" />
                      <span>กลยุทธ์เติมน้ำมัน / ชาร์จไฟ</span>
                    </div>
                    <p className="leading-relaxed">{analysisData.fuelStrategy}</p>
                  </div>
                )}

                {analysisData?.recommendedStopsRationale && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>เหตุผลการจัดจุดพัก</span>
                    </div>
                    <p className="leading-relaxed">{analysisData.recommendedStopsRationale}</p>
                  </div>
                )}
              </div>

              {/* Food & Dining Recommendations */}
              {analysisData?.foodRecommendations && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-950">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                    <Utensils className="w-4 h-4 text-amber-700" />
                    <span>ของกินอร่อย & จุดแวะทานอาหารแนะนำตามเส้นทาง</span>
                  </div>
                  <ul className="space-y-1.5 pl-2">
                    {analysisData.foodRecommendations.map((f: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Custom Ask AI Form */}
              <div className="pt-3 border-t border-slate-200">
                <form onSubmit={handleAskCustom} className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    สอบถามหรือปรับความต้องการกับ AI เพิ่มเติม:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="เช่น มีผู้สูงอายุเดินทางด้วย, อยากแวะกินไก่ย่างวิเชียรบุรี, หรือขับรถกลางคืน..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      disabled={customLoading || !customPrompt.trim()}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                    >
                      {customLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>ถาม AI</span>
                    </button>
                  </div>
                </form>

                {customResponse && (
                  <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-950">
                    <div className="font-bold text-purple-900 mb-1">คำตอบจาก AI:</div>
                    <p className="leading-relaxed">{customResponse}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => fetchAnalysis()}
            disabled={loading}
            className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>รีเฟรชการวิเคราะห์</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};

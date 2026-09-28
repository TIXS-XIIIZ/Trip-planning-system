import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Healthcheck
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Trip Analysis & Safety Recommendations
app.post("/api/ai/analyze-trip", async (req, res) => {
  try {
    const {
      routeTitle,
      departureTime,
      estimatedArrival,
      totalDistanceKm,
      totalDriveTimeMin,
      totalRestTimeMin,
      stops,
      vehicleType,
      specialPreferences,
    } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // Return structured fallback if API key is unavailable
      return res.json({
        success: true,
        isFallback: true,
        analysis: {
          summary: `เส้นทาง ${routeTitle || "ลำพูน - โคราช"} รวมระยะทางประมาณ ${totalDistanceKm} กม. เวลาขับขี่จริงประมาณ ${Math.floor(totalDriveTimeMin / 60)} ชม. ${totalDriveTimeMin % 60} นาที พร้อมจุดพัก ${stops?.length || 0} จุด รวมเวลาพัก ${totalRestTimeMin} นาที`,
          safetyTips: [
            "ควรพักรถทุกๆ 2 - 2.5 ชม. เพื่อระบายความร้อนของยางและเบรก โดยเฉพาะช่วงข้ามเขาพลึง (เด่นชัย-อุตรดิตถ์)",
            "ระวังโค้งลาดชันช่วงรอยต่อลำปาง-แพร่ และช่วงเขาน้ำหนาว/หล่มสัก (หากใช้เส้นทางพิษณุโลก-หล่มสัก)",
            "ตรวจเช็คลมยาง น้ำมันเบรก และน้ำยาหล่อเย็นก่อนออกเดินทางจาก บิ๊กซี ลำพูน",
            "หากเริ่มรู้สึกง่วง ให้แวะดื่มน้ำ ล้างหน้า หรือพักงีบ 15 นาทีที่ปั๊ม ปตท. หรือบางจากหลักทันที"
          ],
          recommendedStopsRationale: "การวางจุดพักที่คัดเลือกไว้เน้นปั๊ม ปตท./บางจาก ขนาดใหญ่ที่มี 7-Eleven, Cafe Amazon, ห้องน้ำสะอาด และมีจุดตรวจเช็ครถเพื่อความสะดวกสบายและปลอดภัยสูงสุด",
          fuelStrategy: "แนะนำเติมน้ำมันให้เต็มถังก่อนออกจากลำพูน และแวะเติมอีกครั้งช่วงครึ่งทาง (พิษณุโลก หรือ หล่มสัก) เพื่อป้องกันน้ำมันตกเกจ์ช่วงขับขึ้นเขา",
          foodRecommendations: [
            "จุดพักที่ 1 (เด่นชัย/อุตรดิตถ์): กาแฟอเมซอนยามเช้า และอาหารพร้อมทานใน 7-Eleven",
            "จุดพักที่ 2 (หล่มสัก/พิษณุโลก): แวะทานมื้อหลัก เช่น ไก่ย่างวิเชียรบุรี ก๋วยเตี๋ยว หรือศูนย์อาหารในปั๊ม",
            "จุดพักที่ 3 (ชัยภูมิ/ด่านขุนทด): แวะพักคลายเมื่อย ดื่มเครื่องดื่มเย็นๆ ก่อนมุ่งหน้าเข้าโคราช"
          ],
        },
      });
    }

    const stopsSummary = Array.isArray(stops)
      ? stops.map((s: any, idx: number) => `${idx + 1}. ${s.name} (${s.location}) [พัก ${s.durationMinutes} นาที, กิจกรรม: ${s.activity || "พักผ่อน"}]`).join("\n")
      : "ไม่มีจุดพักที่ระบุ";

    const prompt = `คุณคือผู้เชี่ยวชาญด้านการวางแผนการเดินทางปลอดภัยและการท่องเที่ยวบนทางหลวงในประเทศไทย (Highway Road Trip & Safety Navigator)
ให้สรุปและวิเคราะห์รายงานการเดินทางอย่างละเอียด ชัดเจน และเข้าใจง่ายในรูปแบบ JSON โดยมีข้อมูลการเดินทางดังนี้:

- จุดเริ่มต้น: บิ๊กซี ซูเปอร์เซ็นเตอร์ ลำพูน (Big C Lamphun)
- จุดหมายปลายทาง: ศูนย์ฝึกอบรมตำรวจภูธรภาค 3 ตำบลจอหอ อำเภอเมืองนครราชสีมา (Provincial Police Training Center Region 3, Korat)
- เส้นทางที่เลือก: ${routeTitle || "เส้นทางหลักสั้นที่สุด"}
- เวลาเริ่มออกเดินทาง: ${departureTime || "06:00 น."}
- เวลาคาดว่าจะถึงปลายทาง: ${estimatedArrival || "16:30 น."}
- ระยะทางรวม: ${totalDistanceKm} กิโลเมตร
- เวลาขับขี่รวม: ${totalDriveTimeMin} นาที
- เวลาพักรวม: ${totalRestTimeMin} นาที
- ประเภทยานพาหนะ: ${vehicleType || "รถยนต์นั่งส่วนบุคคล"}
- ความต้องการเพิ่มเติม: ${specialPreferences || "ขับปลอดภัย สะดวก แวะปั๊มมาตรฐาน"}
- รายการจุดพักรถปัจจุบัน:
${stopsSummary}

จงตอบเป็น JSON รูปแบบนี้เท่านั้น:
{
  "summary": "สรุปภาพรวมการเดินทาง ระยะทาง เวลาเดินทางทั้งหมด และสภาพเส้นทางโดยสังเขป 2-3 ประโยค",
  "safetyTips": ["ข้อควรระวังสำคัญจุดที่ 1 โดยเฉพาะช่วงขึ้น-ลงเขา หรือจุดเสี่ยงบนเส้นนี้", "ข้อควรระวังจุดที่ 2", "คำแนะนำด้านความเหนื่อยล้าและเวลาพัก", "การตรวจเช็คสภาพรถสำหรับระยะทางไกล"],
  "recommendedStopsRationale": "เหตุผลและข้อดีของจุดพักรถและปั๊มน้ำมันที่จัดไว้ ทำไมจึงเหมาะสมและปลอดภัย",
  "fuelStrategy": "คำแนะนำการเติมน้ำมัน/ชาร์จไฟ EV สำหรับเส้นทางนี้ เพื่อให้ประหยัดและมั่นใจไม่ขาดตอน",
  "foodRecommendations": ["แนะนำอาหาร/ของฝากจุดพัก 1", "แนะนำอาหาร/ของฝากจุดพัก 2", "แนะนำของกินจุดพัก 3"],
  "emergencyAdvice": "คำแนะนำกรณีฉุกเฉินและเบอร์โทรสำคัญทางหลวง (เช่น 1193 ตำรวจทางหลวง, 1669 กู้ชีพ)"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const rawText = response.text || "{}";
    let parsedData = {};
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      parsedData = { raw: rawText };
    }

    res.json({
      success: true,
      analysis: parsedData,
    });
  } catch (error: any) {
    console.error("AI Analysis error:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Internal server error during AI analysis",
    });
  }
});

// Start Server & integrate Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Highway Road Trip Planner server running on port ${PORT}`);
  });
}

startServer();

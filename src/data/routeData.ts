import { RouteOption, GasStation, RestStop, VehicleSetting } from '../types';

export const ORIGIN_INFO = {
  name: "บิ๊กซี ซูเปอร์เซ็นเตอร์ ลำพูน (Big C Lamphun)",
  address: "ถนนซุปเปอร์ไฮเวย์ เชียงใหม่-ลำปาง ตำบลบ้านกลาง อำเภอเมืองลำพูน ลำพูน 51000",
  coordinates: [18.5755, 99.0163] as [number, number],
  googleMapsUrl: "https://maps.google.com/?q=18.5755,99.0163",
};

export const DESTINATION_INFO = {
  name: "ศูนย์ฝึกอบรมตำรวจภูธรภาค 3 (ศฝร.ภ.3)",
  address: "ตำบลจอหอ อำเภอเมืองนครราชสีมา นครราชสีมา 30310",
  googleMapsUrl: "https://maps.app.goo.gl/xSb94j1KWNckyHjb6?g_st=ac",
  coordinates: [15.0445, 102.1382] as [number, number],
  plusCode: "24MQ+3P5 ตำบล จอหอ อำเภอเมืองนครราชสีมา",
};

export const DEFAULT_VEHICLE_SETTINGS: VehicleSetting[] = [
  {
    type: 'sedan',
    name: 'รถเก๋ง / Sedan (1,200 - 1,800 cc)',
    fuelType: 'gasohol95',
    fuelPricePerUnit: 37.5,
    consumptionRate: 15.0, // km/L
  },
  {
    type: 'suv',
    name: 'รถ SUV / Crossover',
    fuelType: 'gasohol95',
    fuelPricePerUnit: 37.5,
    consumptionRate: 12.5, // km/L
  },
  {
    type: 'pickup',
    name: 'รถกระบะ / PPV ดีเซล',
    fuelType: 'diesel',
    fuelPricePerUnit: 32.94,
    consumptionRate: 13.5, // km/L
  },
  {
    type: 'van',
    name: 'รถตู้ / รถครอบครัว 7-11 ที่นั่ง',
    fuelType: 'diesel',
    fuelPricePerUnit: 32.94,
    consumptionRate: 10.5, // km/L
  },
  {
    type: 'ev',
    name: 'รถยนต์ไฟฟ้า (EV / 100% Electric)',
    fuelType: 'ev_kwh',
    fuelPricePerUnit: 7.5, // Baht per kWh (DC Fast Charge)
    consumptionRate: 6.2, // km / kWh
  },
  {
    type: 'motorcycle',
    name: 'บิ๊กไบค์ / มอเตอร์ไซค์ (BigBike)',
    fuelType: 'gasohol95',
    fuelPricePerUnit: 37.5,
    consumptionRate: 22.0, // km/L
  },
];

// Shortest Route Gas Stations (Route 1: ลำพูน - พิษณุโลก - หล่มสัก - ชัยภูมิ - โคราช)
export const SHORTEST_ROUTE_GAS_STATIONS: GasStation[] = [
  {
    id: "ptt-lamphun-super",
    name: "ปตท. ลำพูน-ดอยติ (PTT Station Doiti)",
    brand: "PTT",
    location: "อ.เมืองลำพูน (ทล.11 กม.4)",
    highwayNumber: "ทล.11",
    kmFromStart: 6,
    coordinates: [18.552, 99.041],
    amenities: {
      has7Eleven: true,
      hasCafeAmazon: true,
      hasCleanToilet: true,
      hasAirPump: true,
      hasEVCharger: true,
      has24Hour: true,
      hasAtm: true,
    },
    recommendedFor: "เติมน้ำมันเต็มถัง + ซื้อของกินเล่นก่อนเริ่มทริป",
    highlights: ["มี EV Station PluZ", "ห้องน้ำมาตรฐาน PTT Life Station", "7-Eleven ขนาดใหญ่"],
  },
  {
    id: "bangchak-hangchat",
    name: "บางจาก ห้างฉัตร ลำปาง",
    brand: "Bangchak",
    location: "อ.ห้างฉัตร จ.ลำปาง (ทล.11)",
    highwayNumber: "ทล.11",
    kmFromStart: 52,
    coordinates: [18.318, 99.345],
    amenities: {
      hasInthanin: true,
      hasCleanToilet: true,
      hasAirPump: true,
      hasEVCharger: true,
      has24Hour: true,
    },
    recommendedFor: "พักระยะสั้นก่อนเข้าเมืองลำปาง",
    highlights: ["Inthanin Coffee", "จุดชาร์จ EV Quick Charge"],
  },
  {
    id: "ptt-maetha-lampang",
    name: "ปตท. แม่ทะ ลำปาง (PTT Mae Tha)",
    brand: "PTT",
    location: "อ.แม่ทะ จ.ลำปาง (ทล.11)",
    highwayNumber: "ทล.11",
    kmFromStart: 88,
    coordinates: [18.152, 99.553],
    amenities: {
      has7Eleven: true,
      hasCafeAmazon: true,
      hasCleanToilet: true,
      hasAirPump: true,
      hasFoodCourt: true,
      has24Hour: true,
    },
    recommendedFor: "เช็คแรงดันลมยางและระบายความร้อนเบรก",
    highlights: ["Amazon กาแฟสด", "7-Eleven สะดวกซื้อ"],
  },
  {
    id: "ptt-denchai-phrae",
    name: "ปตท. เด่นชัย แพร่ (PTT Den Chai - จุดเช็คพอยต์ 1)",
    brand: "PTT",
    location: "อ.เด่นชัย จ.แพร่ (สามแยกเด่นชัย ทล.11)",
    highwayNumber: "ทล.11",
    kmFromStart: 142,
    coordinates: [17.978, 100.054],
    amenities: {
      has7Eleven: true,
      hasCafeAmazon: true,
      hasCleanToilet: true,
      hasFoodCourt: true,
      hasEVCharger: true,
      hasAirPump: true,
      has24Hour: true,
      hasAtm: true,
    },
    recommendedFor: "จุดพักรถแนะนำที่ 1 (ขับมาแล้ว ~2 ชม. 15 นาที)",
    highlights: [
      "พักรถก่อนขึ้นเขาพลึง (จุดลาดชัน)",
      "ศูนย์อาหารข้าวแกงเมืองแพร่/ไส้อั่วเด่นชัย",
      "ห้องน้ำคนพิการและผู้สูงอายุ",
      "EV Station PluZ 120kW",
    ],
  },
  {
    id: "shell-denchai",
    name: "เชลล์ เด่นชัย (Shell V-Power)",
    brand: "Shell",
    location: "สามแยกเด่นชัย จ.แพร่",
    highwayNumber: "ทล.11",
    kmFromStart: 145,
    coordinates: [17.971, 100.062],
    amenities: {
      hasCleanToilet: true,
      hasAirPump: true,
      has24Hour: true,
      hasAtm: true,
    },
    recommendedFor: "เติมน้ำมันพรีเมียม เชลล์ วี-เพาเวอร์",
    highlights: ["Shell Cafe", "ห้องน้ำสะอาด Deli Cafe"],
  },
  {
    id: "ptt-uttaradit-tron",
    name: "ปตท. ตรอน อุตรดิตถ์ (PTT Tron Uttaradit)",
    brand: "PTT",
    location: "อ.ตรอน จ.อุตรดิตถ์ (ทล.11)",
    highwayNumber: "ทล.11",
    kmFromStart: 198,
    coordinates: [17.472, 100.125],
    amenities: {
      has7Eleven: true,
      hasCafeAmazon: true,
      hasCleanToilet: true,
      hasAirPump: true,
      hasEVCharger: true,
      has24Hour: true,
    },
    recommendedFor: "พักผ่อนหลังผ่านช่วงลงเขาพลึง",
    highlights: ["จุดพักปลอดภัยช่วงทางตรงยาว", "ของฝากเมืองอุตรดิตถ์ ข้าวแคบ กล้วยกวน ลางสาด"],
  },
  {
    id: "ptt-wangthong-phitsanulok",
    name: "ปตท. วังทอง พิษณุโลก (PTT Wang Thong)",
    brand: "PTT",
    location: "อ.วังทอง จ.พิษณุโลก (ทล.12)",
    highwayNumber: "ทล.12",
    kmFromStart: 272,
    coordinates: [16.818, 100.435],
    amenities: {
      has7Eleven: true,
      hasCafeAmazon: true,
      hasCleanToilet: true,
      hasFoodCourt: true,
      hasAirPump: true,
      hasEVCharger: true,
      has24Hour: true,
      hasAtm: true,
    },
    recommendedFor: "เตรียมพร้อมก่อนขึ้นสู่เส้นทางสาย 12 (พิษณุโลก - หล่มสัก)",
    highlights: ["ใกล้แหล่งท่องเที่ยวแม่น้ำเข็ก", "EV Charger 160kW", "ศูนย์อาหาร"],
  },
  {
    id: "caltex-wangthong",
    name: "คาลเท็กซ์ วังทอง (Caltex Techron)",
    brand: "Caltex",
    location: "ริมทางหลวง 12 อ.วังทอง จ.พิษณุโลก",
    highwayNumber: "ทล.12",
    kmFromStart: 278,
    coordinates: [16.825, 100.468],
    amenities: {
      hasCleanToilet: true,
      hasAirPump: true,
      has24Hour: true,
    },
    recommendedFor: "ปั๊มคนไม่พลุกพล่าน เข้าห้องน้ำรวดเร็ว",
    highlights: ["น้ำมัน Techron", "ร้านสะดวกซื้อ"],
  },
  {
    id: "ptt-lomsak-junction",
    name: "ปตท. สี่แยกหล่มสัก เพชรบูรณ์ (PTT Lom Sak - จุดเช็คพอยต์ 2 แนะนำพักทานอาหาร)",
    brand: "PTT",
    location: "สี่แยกพ่อขุนผาเมือง อ.หล่มสัก จ.เพชรบูรณ์ (ตัด ทล.12 / ทล.21)",
    highwayNumber: "ทล.21",
    kmFromStart: 338,
    coordinates: [16.772, 101.242],
    amenities: {
      has7Eleven: true,
      hasCafeAmazon: true,
      hasCleanToilet: true,
      hasFoodCourt: true,
      hasEVCharger: true,
      hasAirPump: true,
      has24Hour: true,
      hasAtm: true,
      hasKfcOrMcdonalds: true,
    },
    recommendedFor: "จุดพักครึ่งทางหลัก แนะนำพัก 45-60 นาที (ทานมื้อกลางวัน/มื้อหลัก)",
    highlights: [
      "จุดกึ่งกลางการเดินทางอย่างแท้จริง (~340 กม.)",
      "มีร้าน KFC, S&P, ศูนย์อาหารไก่ย่างวิเชียรบุรี และของฝากมะขามหวานเพชรบูรณ์",
      "EV Station PluZ 6 หัวชาร์จ",
      "ห้องน้ำขนาดใหญ่ สะอาดระดับ 5 ดาว",
    ],
  },
  {
    id: "bangchak-lomsak",
    name: "บางจาก หล่มสัก กรีนพาร์ค",
    brand: "Bangchak",
    location: "อ.หล่มสัก จ.เพชรบูรณ์ (ทล.21)",
    highwayNumber: "ทล.21",
    kmFromStart: 342,
    coordinates: [16.745, 101.228],
    amenities: {
      hasInthanin: true,
      hasCleanToilet: true,
      hasAirPump: true,
      hasEVCharger: true,
      has24Hour: true,
    },
    recommendedFor: "ทางเลือกพักผ่อนเงียบสงบ จิบกาแฟอินทนิล",
    highlights: ["Inthanin Specialty", "จุดชาร์จ EV Quick Charge"],
  },
  {
    id: "pt-lomkao",
    name: "พีที หล่มสัก-ชุมแพ (PT Max Station)",
    brand: "PT",
    location: "อ.หล่มสัก จ.เพชรบูรณ์ (ทล.12 มุ่งหน้าคอนสาร)",
    highwayNumber: "ทล.12",
    kmFromStart: 365,
    coordinates: [16.762, 101.458],
    amenities: {
      hasCleanToilet: true,
      hasAirPump: true,
      has24Hour: true,
      hasAtm: true,
    },
    recommendedFor: "แวะเติมน้ำมันสะสมแต้ม PT Max Card",
    highlights: ["กาแฟพันธุ์ไทย (PunThai Coffee)", "Max Mart สะดวกซื้อ"],
  },
  {
    id: "ptt-khonsan-chaiyaphum",
    name: "ปตท. คอนสาร ชัยภูมิ (PTT Khon San)",
    brand: "PTT",
    location: "อ.คอนสาร จ.ชัยภูมิ (ทล.12 ตัด ทล.201)",
    highwayNumber: "ทล.201",
    kmFromStart: 412,
    coordinates: [16.612, 101.915],
    amenities: {
      has7Eleven: true,
      hasCafeAmazon: true,
      hasCleanToilet: true,
      hasAirPump: true,
      hasEVCharger: true,
      has24Hour: true,
    },
    recommendedFor: "จุดเลี้ยวเข้าสู่ ทล.201 มุ่งหน้าลงใต้สู่ชัยภูมิ-โคราช",
    highlights: ["จุดพักคลายเมื่อย", "Cafe Amazon", "ห้องน้ำสะอาด"],
  },
  {
    id: "ptt-phukhieo",
    name: "ปตท. ภูเขียว ชัยภูมิ (PTT Phu Khieo)",
    brand: "PTT",
    location: "อ.ภูเขียว จ.ชัยภูมิ (ทล.201)",
    highwayNumber: "ทล.201",
    kmFromStart: 442,
    coordinates: [16.375, 102.132],
    amenities: {
      has7Eleven: true,
      hasCafeAmazon: true,
      hasCleanToilet: true,
      hasFoodCourt: true,
      hasAirPump: true,
      has24Hour: true,
      hasAtm: true,
    },
    recommendedFor: "แวะพักยืดเส้นยืดสาย ดื่มเครื่องดื่มเติมความสดชื่น",
    highlights: ["7-Eleven", "ของฝากอีสาน หม่ำชัยภูมิ/กุนเชียง", "Cafe Amazon"],
  },
  {
    id: "ptt-chaiyaphum-bypass",
    name: "ปตท. เลี่ยงเมืองชัยภูมิ (PTT Chaiyaphum Bypass - จุดเช็คพอยต์ 3)",
    brand: "PTT",
    location: "ถนนเลี่ยงเมืองชัยภูมิ (ทล.201)",
    highwayNumber: "ทล.201",
    kmFromStart: 508,
    coordinates: [15.828, 102.045],
    amenities: {
      has7Eleven: true,
      hasCafeAmazon: true,
      hasCleanToilet: true,
      hasFoodCourt: true,
      hasEVCharger: true,
      hasAirPump: true,
      has24Hour: true,
      hasAtm: true,
    },
    recommendedFor: "จุดพักรถแนะนำที่ 3 (ขับมาแล้ว ~7 ชม. 15 นาที พัก 20-30 นาที)",
    highlights: [
      "จุดพักสุดท้ายก่อนเข้าเขตจังหวัดนครราชสีมา (~80 กม. สุดท้าย)",
      "เติมน้ำมันให้พร้อม และล้างหน้ากระตุ้นความตื่นตัว",
      "EV Station PluZ ชาร์จด่วน",
    ],
  },
  {
    id: "ptt-dankhunthot",
    name: "ปตท. ด่านขุนทด นครราชสีมา (PTT Dan Khun Thot)",
    brand: "PTT",
    location: "อ.ด่านขุนทด จ.นครราชสีมา (ทล.201)",
    highwayNumber: "ทล.201",
    kmFromStart: 546,
    coordinates: [15.205, 101.768],
    amenities: {
      has7Eleven: true,
      hasCafeAmazon: true,
      hasCleanToilet: true,
      hasAirPump: true,
      has24Hour: true,
    },
    recommendedFor: "จุดแวะฉุกเฉิน / เข้าห้องน้ำก่อนเข้าตัวเมืองโคราช",
    highlights: ["ห้องน้ำสะอาด", "7-Eleven สะดวกซื้อ"],
  },
  {
    id: "ptt-choho-korat",
    name: "ปตท. จอหอ นครราชสีมา (PTT Cho Ho)",
    brand: "PTT",
    location: "ต.จอหอ อ.เมืองนครราชสีมา (ถนนมิตรภาพ ก่อนถึงศูนย์ฝึกตำรวจ 3 กม.)",
    highwayNumber: "ทล.2",
    kmFromStart: 585,
    coordinates: [15.025, 102.128],
    amenities: {
      has7Eleven: true,
      hasCafeAmazon: true,
      hasCleanToilet: true,
      hasFoodCourt: true,
      hasEVCharger: true,
      hasAirPump: true,
      has24Hour: true,
      hasAtm: true,
    },
    recommendedFor: "ปั๊มน้ำมันใกล้จุดหมายปลายทางที่สุด (ห่างเพียง 3 กม.)",
    highlights: ["ล้างรถ/เติมน้ำมัน/เตรียมความพร้อมก่อนเข้ารายงานตัวหรือปฏิบัติงาน"],
  },
];

// Default Recommended Stops for Shortest Route
export const DEFAULT_SHORTEST_STOPS: RestStop[] = [
  {
    id: "stop-1",
    name: "ปตท. ตรอน อุตรดิตถ์ (PTT Tron Uttaradit)",
    stationId: "ptt-uttaradit-tron",
    brand: "PTT",
    location: "อ.ตรอน จ.อุตรดิตถ์ (ทล.11)",
    highwayNumber: "ทล.11",
    kmFromStart: 198,
    driveTimeFromPrevMin: 180, // ~3h
    durationMinutes: 20,
    activity: "เข้าห้องน้ำ + กาแฟ + พักผ่อนหลังผ่านช่วงลงเขาพลึง",
    coordinates: [17.472, 100.125],
    isMandatorySafetyStop: true,
    notes: "พักเพื่อความปลอดภัยหลังขับขี่ผ่านเขายาว (จุดพักปลอดภัยช่วงทางตรงยาว)",
    amenities: {
      has7Eleven: true,
      hasCafeAmazon: true,
      hasCleanToilet: true,
      hasEVCharger: true,
      hasAirPump: true,
      has24Hour: true,
    },
  },
  {
    id: "stop-2",
    name: "ปตท. สี่แยกหล่มสัก เพชรบูรณ์ (PTT Lom Sak Junction)",
    stationId: "ptt-lomsak-junction",
    brand: "PTT",
    location: "สี่แยกพ่อขุนผาเมือง อ.หล่มสัก จ.เพชรบูรณ์",
    highwayNumber: "ทล.21",
    kmFromStart: 338,
    driveTimeFromPrevMin: 130, // ~2h 10m from Tron
    durationMinutes: 45,
    activity: "พักทานอาหารกลางวัน + พักระบายความร้อนเครื่องยนต์/ยาง + ซื้อของฝาก",
    coordinates: [16.772, 101.242],
    isMandatorySafetyStop: true,
    notes: "จุดกึ่งกลางการเดินทางหลัก มีศูนย์อาหาร ไก่ย่างวิเชียรบุรี KFC และห้องน้ำมาตรฐาน 5 ดาว",
    amenities: {
      has7Eleven: true,
      hasCafeAmazon: true,
      hasCleanToilet: true,
      hasFoodCourt: true,
      hasEVCharger: true,
      hasKfcOrMcdonalds: true,
      has24Hour: true,
    },
  }
];

// All 3 Route Options
export const ROUTE_OPTIONS: RouteOption[] = [
  {
    id: "route-shortest",
    title: "เส้นทาง 1: สายสั้นที่สุด (ผ่าน พิษณุโลก - หล่มสัก - ชัยภูมิ)",
    tag: "สั้นที่สุด & ประหยัดเวลา",
    tagColor: "emerald",
    description: "วิ่งทางหลวง 11 -> ทางหลวง 12 -> ทางหลวง 21 -> ทางหลวง 201 ลำพูน-เด่นชัย-วังทอง-หล่มสัก-คอนสาร-ชัยภูมิ-ด่านขุนทด-จอหอ โคราช",
    isShortest: true,
    isRecommended: true,
    totalDistanceKm: 588,
    baseDriveTimeMinutes: 515, // 8 hr 35 min
    highways: ["ทล.11", "ทล.12", "ทล.21", "ทล.201", "ทล.205", "ทล.2"],
    keyWaypoints: [
      "บิ๊กซี ลำพูน",
      "ลำปาง (แม่ทะ)",
      "เด่นชัย (แพร่)",
      "อุตรดิตถ์",
      "พิษณุโลก (วังทอง)",
      "หล่มสัก (เพชรบูรณ์)",
      "คอนสาร / ภูเขียว (ชัยภูมิ)",
      "เมืองชัยภูมิ",
      "ด่านขุนทด / พระทองคำ",
      "ศฝร.ภ.3 ต.จอหอ โคราช",
    ],
    mountainSections: [
      "ช่วงเขาพลึง (รอยต่อ เด่นชัย แพร่ - อุตรดิตถ์ ทล.11): ทางโค้งลาดชัน ควรใช้เกียร์ต่ำระวังเบรกร้อน",
      "ช่วงเขาแม่น้ำเข็ก / แคมป์สน (พิษณุโลก มุ่งหน้า หล่มสัก ทล.12): ทางขึ้นเขาสวยงามแต่มีโค้งยาว",
    ],
    defaultStops: DEFAULT_SHORTEST_STOPS,
    gasStationsList: SHORTEST_ROUTE_GAS_STATIONS,
    routeCoordinates: [
      [18.5755, 99.0163], // Big C Lamphun
      [18.452, 99.185],
      [18.291, 99.492], // Lampang
      [18.152, 99.553], // Mae Tha
      [17.978, 100.054], // Den Chai (Stop 1)
      [17.625, 100.098], // Uttaradit
      [17.155, 100.185], // Phichai / Phitsanulok border
      [16.825, 100.265], // Phitsanulok City Bypass
      [16.818, 100.435], // Wang Thong (Hwy 12)
      [16.792, 100.825], // Khao Kho foothills
      [16.772, 101.242], // Lom Sak (Stop 2)
      [16.612, 101.915], // Khon San
      [16.375, 102.132], // Phu Khieo
      [15.828, 102.045], // Chaiyaphum (Stop 3)
      [15.205, 101.768], // Dan Khun Thot
      [15.125, 102.015], // Non Thai
      [15.0445, 102.1382], // Provincial Police Training Center Region 3, Cho Ho
    ],
  },
  {
    id: "route-highway1",
    title: "เส้นทาง 2: สายเอเชียขับสบาย (ผ่าน นครสวรรค์ - สิงห์บุรี - สระบุรี - มิตรภาพ)",
    tag: "ทางราบ 4-8 เลนตลอดสาย",
    tagColor: "blue",
    description: "วิ่งทางหลวง 1 -> ทางหลวง 32 (สายเอเชีย) -> ทางหลวง 1 พหลโยธิน -> ทางหลวง 2 มิตรภาพ ผ่านนครสวรรค์ อยุธยา สระบุรี ปากช่อง โคราช",
    isShortest: false,
    isRecommended: false,
    totalDistanceKm: 698,
    baseDriveTimeMinutes: 555, // 9 hr 15 min
    highways: ["ทล.1", "ทล.11", "ทล.32", "ทล.1", "ทล.2 (มิตรภาพ)"],
    keyWaypoints: [
      "บิ๊กซี ลำพูน",
      "ลำปาง",
      "ตาก",
      "กำแพงเพชร",
      "นครสวรรค์ (แยกเดชาติวงศ์)",
      "สิงห์บุรี",
      "สระบุรี (แยกบายพาส)",
      "ปากช่อง / ลำตะคอง",
      "สีคิ้ว",
      "ศฝร.ภ.3 ต.จอหอ โคราช",
    ],
    mountainSections: [
      "ช่วงขุนตาน (ลำพูน - ลำปาง)",
      "ช่วงลำตะคอง (มิตรภาพ สระบุรี - โคราช): รถหนาแน่นช่วงวันหยุด มอเตอร์เวย์ M6 อาจเปิดให้บริการบางช่วง",
    ],
    defaultStops: [
      {
        id: "stop-h1-1",
        name: "ปตท. เถิน ลำปาง",
        brand: "PTT",
        location: "อ.เถิน จ.ลำปาง (ทล.1)",
        highwayNumber: "ทล.1",
        kmFromStart: 155,
        driveTimeFromPrevMin: 125,
        durationMinutes: 20,
        activity: "เข้าห้องน้ำ + ซื้อกาแฟ",
        coordinates: [17.615, 99.215],
        amenities: { has7Eleven: true, hasCafeAmazon: true, hasCleanToilet: true, has24Hour: true },
      },
      {
        id: "stop-h1-2",
        name: "ปตท. เลี่ยงเมืองนครสวรรค์ (The Walk)",
        brand: "PTT",
        location: "อ.เมืองนครสวรรค์",
        highwayNumber: "ทล.1",
        kmFromStart: 345,
        driveTimeFromPrevMin: 165,
        durationMinutes: 45,
        activity: "พักทานอาหารมื้อกลางวัน + ซื้อโมจินครสวรรค์",
        coordinates: [15.712, 100.115],
        amenities: { has7Eleven: true, hasCafeAmazon: true, hasFoodCourt: true, hasEVCharger: true, has24Hour: true },
      },
      {
        id: "stop-h1-3",
        name: "ปตท. ปากช่อง / ไฮเวย์ ลำตะคอง",
        brand: "PTT",
        location: "อ.ปากช่อง จ.นครราชสีมา (ทล.2 มิตรภาพ)",
        highwayNumber: "ทล.2",
        kmFromStart: 590,
        driveTimeFromPrevMin: 175,
        durationMinutes: 30,
        activity: "พักชมวิวเขื่อนลำตะคอง + เติมน้ำมัน",
        coordinates: [14.705, 101.425],
        amenities: { has7Eleven: true, hasCafeAmazon: true, hasCleanToilet: true, hasEVCharger: true, has24Hour: true },
      },
    ],
    gasStationsList: SHORTEST_ROUTE_GAS_STATIONS, // subset / available
    routeCoordinates: [
      [18.5755, 99.0163],
      [18.291, 99.492],
      [17.615, 99.215], // Thoen
      [16.883, 99.125], // Tak
      [16.482, 99.525], // Kamphaeng Phet
      [15.712, 100.115], // Nakhon Sawan
      [14.885, 100.412], // Sing Buri
      [14.525, 100.912], // Saraburi
      [14.705, 101.425], // Pak Chong / Lam Takhong
      [14.885, 101.715], // Sikhio
      [15.0445, 102.1382], // Cho Ho
    ],
  },
  {
    id: "route-bypass11",
    title: "เส้นทาง 3: สายเลี่ยงเมืองพิจิตร-ตากฟ้า-โคกสำโรง",
    tag: "เลี่ยงการจราจรสายเอเชีย",
    tagColor: "amber",
    description: "วิ่งทางหลวง 11 ลำพูน-พิษณุโลก -> ทล.11 ลงใต้ผ่าน พิจิตร-ตากฟ้า-โคกสำโรง-ม่วงค่อม-ด่านขุนทด-จอหอ โคราช ทางตรงรถไม่ติด",
    isShortest: false,
    isRecommended: false,
    totalDistanceKm: 622,
    baseDriveTimeMinutes: 535, // 8 hr 55 min
    highways: ["ทล.11", "ทล.12", "ทล.11", "ทล.333", "ทล.205", "ทล.201", "ทล.2"],
    keyWaypoints: [
      "บิ๊กซี ลำพูน",
      "เด่นชัย (แพร่)",
      "พิษณุโลก (สากเหล็ก)",
      "เขาทราย (พิจิตร)",
      "ตากฟ้า (นครสวรรค์)",
      "โคกสำโรง (ลพบุรี)",
      "ม่วงค่อม / ลำสนธิ",
      "ด่านขุนทด",
      "ศฝร.ภ.3 ต.จอหอ โคราช",
    ],
    mountainSections: [
      "ช่วงเขาพลึง (เด่นชัย - อุตรดิตถ์)",
      "ช่วงช่องเขาม่วงค่อม (ลพบุรี - ด่านขุนทด)",
    ],
    defaultStops: [
      {
        id: "stop-b11-1",
        name: "ปตท. เด่นชัย แพร่",
        brand: "PTT",
        location: "อ.เด่นชัย จ.แพร่ (ทล.11)",
        highwayNumber: "ทล.11",
        kmFromStart: 142,
        driveTimeFromPrevMin: 135,
        durationMinutes: 20,
        activity: "เข้าห้องน้ำ + กาแฟ",
        coordinates: [17.978, 100.054],
        amenities: { has7Eleven: true, hasCafeAmazon: true, hasCleanToilet: true, has24Hour: true },
      },
      {
        id: "stop-b11-2",
        name: "ปตท. เขาทราย พิจิตร",
        brand: "PTT",
        location: "สี่แยกเขาทราย อ.ทับคล้อ จ.พิจิตร (ทล.11)",
        highwayNumber: "ทล.11",
        kmFromStart: 310,
        driveTimeFromPrevMin: 160,
        durationMinutes: 45,
        activity: "พักทานอาหารมื้อกลางวัน + เช็ครถ",
        coordinates: [16.145, 100.625],
        amenities: { has7Eleven: true, hasCafeAmazon: true, hasFoodCourt: true, has24Hour: true },
      },
      {
        id: "stop-b11-3",
        name: "ปตท. ม่วงค่อม ลพบุรี",
        brand: "PTT",
        location: "สามแยกม่วงค่อม อ.ชัยบาดาล จ.ลพบุรี (ทล.205)",
        highwayNumber: "ทล.205",
        kmFromStart: 495,
        driveTimeFromPrevMin: 155,
        durationMinutes: 25,
        activity: "เข้าห้องน้ำ + เครื่องดื่มชูกำลัง",
        coordinates: [15.155, 101.125],
        amenities: { has7Eleven: true, hasCafeAmazon: true, hasCleanToilet: true, has24Hour: true },
      },
    ],
    gasStationsList: SHORTEST_ROUTE_GAS_STATIONS,
    routeCoordinates: [
      [18.5755, 99.0163],
      [17.978, 100.054],
      [17.472, 100.125],
      [16.825, 100.265],
      [16.145, 100.625], // Khao Sai
      [15.352, 100.585], // Tak Fa
      [15.155, 101.125], // Muang Khom
      [15.205, 101.768], // Dan Khun Thot
      [15.0445, 102.1382], // Cho Ho
    ],
  },
];

export const EMERGENCY_CONTACTS = [
  { name: "ตำรวจทางหลวง (Highway Police)", number: "1193", desc: "แจ้งอุบัติเหตุ ขอความช่วยเหลือบนทางหลวงทั่วประเทศ 24 ชม." },
  { name: "ศูนย์กู้ชีพการแพทย์ฉุกเฉิน", number: "1669", desc: "อุบัติเหตุบาดเจ็บ เจ็บป่วยฉุกเฉิน เรียกรถพยาบาลฟรี 24 ชม." },
  { name: "สายด่วนกรมทางหลวง", number: "1586", desc: "สอบถามเส้นทาง สภาพผิวถนน น้ำท่วม หรือรถเสียบนทางหลวง" },
  { name: "ศูนย์ฝึกอบรมตำรวจภูธรภาค 3 (ศฝร.ภ.3)", number: "044-242-555", desc: "ติดต่อสอบถามจุดหมายปลายทาง ต.จอหอ จ.นครราชสีมา" },
  { name: "กู้ภัยสว่างเมตตาธรรมสถาน โคราช", number: "044-252-595", desc: "หน่วยกู้ภัยหลักประจำเขตเมืองนครราชสีมาและจอหอ" },
  { name: "ศูนย์บริการช่วยเหลือฉุกเฉิน PTT EV PluZ", number: "1365", desc: "สอบถามสถานะตู้ชาร์จไฟหรือแจ้งปัญหาตู้ EV" },
];

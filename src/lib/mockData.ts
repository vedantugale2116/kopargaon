// Realistic Demo Data for Kopargaon Connect Smart Mobility Platform

export interface BusRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  origin: string;
  destination: string;
  stops: string[];
  distanceKm: number;
  avgDurationMins: number;
}

export interface Bus {
  id: string;
  busNumber: string;
  driverName: string;
  contactNumber: string;
  routeId: string;
  currentStop: string;
  destination: string;
  lat: number;
  lng: number;
  speed: number;
  status: 'ACTIVE' | 'DELAYED' | 'AT DEPOT' | 'MAINTENANCE' | 'OUT OF SERVICE';
  delayMins: number;
  passengerCapacity: number;
  passengerOccupied: number;
  totalCargoKg: number;
  usedCargoKg: number;
  availableCargoKg: number;
  nextDeparture?: string;
  depotBay?: string;
}

export interface BusSchedule {
  id: string;
  busId: string;
  busNumber: string;
  routeId: string;
  origin: string;
  destination: string;
  stops: string[];
  departureTime: string;
  arrivalTime: string;
  date: string;
  passengerCapacity: number;
  availableSeats: number;
  totalCargoKg: number;
  availableCargoKg: number;
  fare: number;
  cargoRatePerKg: number;
  status: 'PUBLISHED' | 'DRAFT' | 'DELAYED' | 'CANCELLED';
}

export interface PassengerBooking {
  id: string;
  bookingId: string;
  transactionId: string;
  busNumber: string;
  routeId?: string;
  origin: string;
  destination: string;
  stops?: string[];
  date: string;
  departureTime: string;
  arrivalTime: string;
  passengerCount: number;
  farePerPassenger: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'Net Banking';
  paymentStatus: 'PAID';
  bookingStatus: 'CONFIRMED';
  bookedAt: string;
  userName: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  origin: string;
  destination: string;
  goodsType: string;
  quantity: string;
  weightKg: number;
  preferredDate: string;
  preferredTime: string;
  specialNotes?: string;
  assignedType?: 'PUBLIC_BUS' | 'PRIVATE_TRANSPORTER';
  transporterId?: string;
  transporterName?: string;
  transporterVehicle?: string;
  transporterPhone?: string;
  busScheduleId?: string;
  estimatedCost: number;
  currentStatus: 'REQUESTED' | 'MATCHED' | 'ACCEPTED' | 'PICKUP' | 'IN TRANSIT' | 'DELIVERED';
  timeline: {
    status: string;
    timestamp: string;
    description: string;
    completed: boolean;
    current: boolean;
  }[];
  createdAt: string;
  estimatedDelivery: string;
}

export interface TransporterTrip {
  id: string;
  transporterId: string;
  transporterName: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  origin: string;
  destination: string;
  date: string;
  departureTime: string;
  estimatedArrival: string;
  totalCapacityKg: number;
  availableCapacityKg: number;
  acceptedGoodsTypes: string[];
  chargePerKg: number;
  notes?: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface ShipmentRequest {
  id: string;
  tripId: string;
  shipmentId: string;
  farmerName: string;
  farmerPhone: string;
  pickupLocation: string;
  dropLocation: string;
  goodsType: string;
  weightKg: number;
  offeredPrice: number;
  preferredTime: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export type VerificationStatus = 'VERIFIED' | 'UNDER_REVIEW' | 'UNVERIFIED' | 'REJECTED' | 'OUTDATED';

export interface TrafficReport {
  id: string;
  userId: string;
  userName: string;
  roadName: string;
  regionKey: string;
  locationDescription: string;
  description: string;
  photoUrl: string;
  timestamp: string;
  severity: 'LOW' | 'MODERATE' | 'HEAVY' | 'SEVERE';
  status: 'REPORTED' | 'ACKNOWLEDGED' | 'ALERT_ISSUED' | 'RESOLVED';
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  verificationNotes?: string;
  duplicateCount?: number;
  relatedReportId?: string;
  reportType?: 'TRAFFIC' | 'ROAD_INCIDENT' | 'BUS_DISRUPTION' | 'EV_STATION' | 'LOGISTICS';
}

export interface TrafficRegion {
  id: string;
  name: string;
  coordinates: [number, number][]; // Polyline coords for Leaflet
  center: [number, number];
  reportCount: number;
  currentTraffic: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  avgSpeedKmph: number;
  statusMessage: string;
}

export interface SafetyAlert {
  id: string;
  title: string;
  category: 'TRAFFIC' | 'ROAD_CLOSURE' | 'BUS_DELAY' | 'WEATHER' | 'SAFETY_ADVISORY';
  severity: 'CRITICAL' | 'WARNING' | 'ADVISORY' | 'INFO';
  location: string;
  description: string;
  issuedBy: string;
  timestamp: string;
  expiresAt: string;
  active: boolean;
}

export interface EVStation {
  id: string;
  name: string;
  location: string;
  address: string;
  lat: number;
  lng: number;
  distanceKm: number;
  chargerType: 'DC Fast (60kW)' | 'DC Ultra (120kW)' | 'AC Type 2 (22kW)' | 'Dual (AC/DC)';
  availableChargers: number;
  totalChargers: number;
  powerOutputKw: number;
  pricingPerKwh: string;
  operatingHours: string;
  status: 'OPERATIONAL' | 'BUSY' | 'MAINTENANCE';
  nearHighway: boolean;
}

export interface UserNotification {
  id: string;
  targetRole: 'CITIZEN' | 'FARMER' | 'TRANSPORTER' | 'OFFICIAL' | 'ALL';
  title: string;
  message: string;
  category: 'BUS' | 'SHIPMENT' | 'TRAFFIC' | 'ALERT' | 'SYSTEM';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// Initial Mock Datasets
export const initialRoutes: BusRoute[] = [
  {
    id: 'route-1',
    routeNumber: 'KP-101',
    routeName: 'Kopargaon Central — Shirdi Temple — Sangamner',
    origin: 'Kopargaon Bus Station',
    destination: 'Sangamner Central Depot',
    stops: ['Kopargaon Central', 'Sanvatsar', 'Rahata Bypass', 'Shirdi Temple Gate 2', 'Nighoj', 'Sangamner'],
    distanceKm: 46,
    avgDurationMins: 75
  },
  {
    id: 'route-2',
    routeNumber: 'KP-204',
    routeName: 'Kopargaon — Yeola — Nashik Highway',
    origin: 'Kopargaon Bus Station',
    destination: 'Nashik CBS',
    stops: ['Kopargaon', 'Godavari Bridge', 'Yeola Bypass', 'Niphad Mandi', 'Ozar Air Cargo', 'Nashik CBS'],
    distanceKm: 88,
    avgDurationMins: 110
  },
  {
    id: 'route-3',
    routeNumber: 'KP-305',
    routeName: 'Kopargaon Rural Ring — Puntamba — Rahata APMC',
    origin: 'Kopargaon APMC Yard',
    destination: 'Rahata Mandi',
    stops: ['Kopargaon APMC', 'Dhamori', 'Puntamba Station', 'Chitali Sugar Mill', 'Rahata Mandi'],
    distanceKm: 32,
    avgDurationMins: 55
  },
  {
    id: 'route-4',
    routeNumber: 'KP-410',
    routeName: 'Kopargaon — Sangamner — Pune Express Cargo',
    origin: 'Kopargaon Depot',
    destination: 'Pune Swargate',
    stops: ['Kopargaon Depot', 'Shirdi Interchange', 'Sangamner Depot', 'Narayangaon', 'Bhosari', 'Pune Swargate'],
    distanceKm: 195,
    avgDurationMins: 240
  }
];

export const initialBuses: Bus[] = [
  {
    id: 'bus-1',
    busNumber: 'MH-17-BT-4512',
    driverName: 'Suresh Gaikwad',
    contactNumber: '+91 98221 45012',
    routeId: 'route-1',
    currentStop: 'Sanvatsar Naka',
    destination: 'Sangamner Depot',
    lat: 19.8710,
    lng: 74.4530,
    speed: 48,
    status: 'ACTIVE',
    delayMins: 0,
    passengerCapacity: 45,
    passengerOccupied: 32,
    totalCargoKg: 500,
    usedCargoKg: 280,
    availableCargoKg: 220,
    nextDeparture: '08:30 AM'
  },
  {
    id: 'bus-2',
    busNumber: 'MH-17-BT-9821',
    driverName: 'Rameshwar Pawar',
    contactNumber: '+91 94231 88710',
    routeId: 'route-2',
    currentStop: 'Yeola Phata',
    destination: 'Nashik CBS',
    lat: 19.9520,
    lng: 74.4890,
    speed: 55,
    status: 'DELAYED',
    delayMins: 18,
    passengerCapacity: 45,
    passengerOccupied: 40,
    totalCargoKg: 600,
    usedCargoKg: 450,
    availableCargoKg: 150,
    nextDeparture: '09:15 AM'
  },
  {
    id: 'bus-3',
    busNumber: 'MH-17-BT-3304',
    driverName: 'Anil Shinde',
    contactNumber: '+91 98602 11923',
    routeId: 'route-3',
    currentStop: 'Kopargaon Bus Station',
    destination: 'Rahata Mandi',
    lat: 19.8928,
    lng: 74.4789,
    speed: 0,
    status: 'AT DEPOT',
    delayMins: 0,
    passengerCapacity: 40,
    passengerOccupied: 0,
    totalCargoKg: 450,
    usedCargoKg: 0,
    availableCargoKg: 450,
    nextDeparture: '10:00 AM',
    depotBay: 'Platform 3'
  },
  {
    id: 'bus-4',
    busNumber: 'MH-17-BT-7719',
    driverName: 'Dattatray Kadam',
    contactNumber: '+91 97654 32109',
    routeId: 'route-4',
    currentStop: 'Kopargaon Workshop',
    destination: 'Pune Swargate',
    lat: 19.8890,
    lng: 74.4710,
    speed: 0,
    status: 'MAINTENANCE',
    delayMins: 0,
    passengerCapacity: 50,
    passengerOccupied: 0,
    totalCargoKg: 800,
    usedCargoKg: 0,
    availableCargoKg: 800,
    depotBay: 'Bay 5 (Service)'
  },
  {
    id: 'bus-5',
    busNumber: 'MH-17-BT-6218',
    driverName: 'Vikas Jadhav',
    contactNumber: '+91 99701 44521',
    routeId: 'route-1',
    currentStop: 'Shirdi Gate 2',
    destination: 'Kopargaon Central',
    lat: 19.7680,
    lng: 74.4760,
    speed: 42,
    status: 'ACTIVE',
    delayMins: 4,
    passengerCapacity: 45,
    passengerOccupied: 38,
    totalCargoKg: 500,
    usedCargoKg: 310,
    availableCargoKg: 190,
    nextDeparture: '09:45 AM'
  }
];

export const initialSchedules: BusSchedule[] = [
  {
    id: 'sched-1',
    busId: 'bus-1',
    busNumber: 'MH-17-BT-4512',
    routeId: 'route-1',
    origin: 'Kopargaon Central',
    destination: 'Sangamner Depot',
    stops: ['Kopargaon', 'Sanvatsar', 'Rahata', 'Shirdi', 'Sangamner'],
    departureTime: '08:30 AM',
    arrivalTime: '09:45 AM',
    date: '2026-08-30',
    passengerCapacity: 45,
    availableSeats: 13,
    totalCargoKg: 500,
    availableCargoKg: 220,
    fare: 65,
    cargoRatePerKg: 3.5,
    status: 'PUBLISHED'
  },
  {
    id: 'sched-2',
    busId: 'bus-2',
    busNumber: 'MH-17-BT-9821',
    routeId: 'route-2',
    origin: 'Kopargaon Bus Station',
    destination: 'Nashik CBS',
    stops: ['Kopargaon', 'Yeola Bypass', 'Niphad Mandi', 'Nashik CBS'],
    departureTime: '09:15 AM',
    arrivalTime: '11:05 AM',
    date: '2026-08-30',
    passengerCapacity: 45,
    availableSeats: 5,
    totalCargoKg: 600,
    availableCargoKg: 150,
    fare: 110,
    cargoRatePerKg: 4.0,
    status: 'DELAYED'
  },
  {
    id: 'sched-3',
    busId: 'bus-3',
    busNumber: 'MH-17-BT-3304',
    routeId: 'route-3',
    origin: 'Kopargaon APMC',
    destination: 'Rahata Mandi',
    stops: ['Kopargaon APMC', 'Dhamori', 'Puntamba', 'Rahata Mandi'],
    departureTime: '10:00 AM',
    arrivalTime: '10:55 AM',
    date: '2026-08-30',
    passengerCapacity: 40,
    availableSeats: 40,
    totalCargoKg: 450,
    availableCargoKg: 450,
    fare: 40,
    cargoRatePerKg: 2.5,
    status: 'PUBLISHED'
  },
  {
    id: 'sched-4',
    busId: 'bus-5',
    busNumber: 'MH-17-BT-6218',
    routeId: 'route-1',
    origin: 'Kopargaon Central',
    destination: 'Shirdi Temple',
    stops: ['Kopargaon Central', 'Sanvatsar', 'Shirdi Temple'],
    departureTime: '11:30 AM',
    arrivalTime: '12:15 PM',
    date: '2026-08-30',
    passengerCapacity: 45,
    availableSeats: 22,
    totalCargoKg: 500,
    availableCargoKg: 300,
    fare: 35,
    cargoRatePerKg: 2.0,
    status: 'PUBLISHED'
  },
  {
    id: 'sched-5',
    busId: 'bus-draft',
    busNumber: 'MH-17-BT-8890',
    routeId: 'route-4',
    origin: 'Kopargaon Depot',
    destination: 'Pune Swargate',
    stops: ['Kopargaon', 'Sangamner', 'Narayangaon', 'Pune'],
    departureTime: '01:00 PM',
    arrivalTime: '05:00 PM',
    date: '2026-08-30',
    passengerCapacity: 50,
    availableSeats: 50,
    totalCargoKg: 750,
    availableCargoKg: 750,
    fare: 260,
    cargoRatePerKg: 6.0,
    status: 'DRAFT'
  }
];

export const initialTrips: TransporterTrip[] = [
  {
    id: 'trip-1',
    transporterId: 'trans-1',
    transporterName: 'Santosh Tribhuvan',
    phone: '+91 98223 90112',
    vehicleType: 'Mahindra Bolero Maxi Truck (Pickup)',
    vehicleNumber: 'MH-17-AG-8821',
    origin: 'Kopargaon APMC Yard',
    destination: 'Nashik Agriculture Produce Market',
    date: '2026-08-30',
    departureTime: '09:00 AM',
    estimatedArrival: '11:15 AM',
    totalCapacityKg: 1200,
    availableCapacityKg: 750,
    acceptedGoodsTypes: ['Onions', 'Grapes', 'Pomegranates', 'Vegetables', 'Grain Sacks'],
    chargePerKg: 3.2,
    notes: 'Covered tarpaulin available. Direct route via Niphad.',
    status: 'SCHEDULED'
  },
  {
    id: 'trip-2',
    transporterId: 'trans-2',
    transporterName: 'Ganesh Deshmukh',
    phone: '+91 94220 77154',
    vehicleType: 'Tata Ace Gold (Chhota Hathi)',
    vehicleNumber: 'MH-17-CB-4490',
    origin: 'Kopargaon Bus Stand Area',
    destination: 'Shirdi & Rahata Mandi',
    date: '2026-08-30',
    departureTime: '10:30 AM',
    estimatedArrival: '11:20 AM',
    totalCapacityKg: 750,
    availableCapacityKg: 400,
    acceptedGoodsTypes: ['Flowers (Shirdi Offerings)', 'Vegetables', 'Dairy Crates'],
    chargePerKg: 2.5,
    notes: 'Daily morning transit. Gentle handling guaranteed.',
    status: 'SCHEDULED'
  },
  {
    id: 'trip-3',
    transporterId: 'trans-3',
    transporterName: 'Mahesh Borawake',
    phone: '+91 98901 22345',
    vehicleType: 'Ashok Leyland Dost+',
    vehicleNumber: 'MH-17-BY-1234',
    origin: 'Sanvatsar Village, Kopargaon',
    destination: 'Sangamner APMC Market',
    date: '2026-08-30',
    departureTime: '11:00 AM',
    estimatedArrival: '12:30 PM',
    totalCapacityKg: 1500,
    availableCapacityKg: 1100,
    acceptedGoodsTypes: ['Sugarcane Seedlings', 'Guavas', 'Sweet Limes', 'General Cargo'],
    chargePerKg: 2.8,
    notes: 'Can pickup from farm gate along Sanvatsar road.',
    status: 'SCHEDULED'
  }
];

export const initialShipments: Shipment[] = [
  {
    id: 'ship-101',
    trackingNumber: 'KC-2026-78901',
    farmerId: 'farmer-1',
    farmerName: 'Balasaheb Vikhe',
    farmerPhone: '+91 98220 11223',
    origin: 'Kopargaon APMC Yard',
    destination: 'Nashik Agriculture Market',
    goodsType: 'Pomegranate Crates (Fresh Harvest)',
    quantity: '25 crates',
    weightKg: 250,
    preferredDate: '2026-08-30',
    preferredTime: 'Morning (09:00 AM)',
    specialNotes: 'Perishable goods. Keep upright.',
    assignedType: 'PUBLIC_BUS',
    busScheduleId: 'sched-2',
    transporterName: 'Public Bus Cargo (MH-17-BT-9821)',
    transporterPhone: '+91 94231 88710',
    transporterVehicle: 'MSRTC Semi-Luxury Express',
    estimatedCost: 1000,
    currentStatus: 'IN TRANSIT',
    timeline: [
      { status: 'REQUESTED', timestamp: '2026-08-29 04:30 PM', description: 'Shipment request submitted by farmer', completed: true, current: false },
      { status: 'MATCHED', timestamp: '2026-08-29 05:15 PM', description: 'Matched with Public Bus MH-17-BT-9821 Cargo Bay', completed: true, current: false },
      { status: 'ACCEPTED', timestamp: '2026-08-29 06:00 PM', description: 'Depot official confirmed cargo bay space', completed: true, current: false },
      { status: 'PICKUP', timestamp: '2026-08-30 08:45 AM', description: 'Goods loaded at Kopargaon Central Cargo Counter', completed: true, current: false },
      { status: 'IN TRANSIT', timestamp: '2026-08-30 09:20 AM', description: 'Bus en-route to Nashik via Niphad', completed: true, current: true },
      { status: 'DELIVERED', timestamp: 'Expected 11:30 AM', description: 'Pending unloading at Nashik CBS Bay 4', completed: false, current: false }
    ],
    createdAt: '2026-08-29 16:30',
    estimatedDelivery: '2026-08-30 11:30 AM'
  },
  {
    id: 'ship-102',
    trackingNumber: 'KC-2026-78902',
    farmerId: 'farmer-1',
    farmerName: 'Balasaheb Vikhe',
    farmerPhone: '+91 98220 11223',
    origin: 'Sanvatsar Village',
    destination: 'Shirdi Temple Supply Depot',
    goodsType: 'Fresh Marigold Flowers & Tulsi',
    quantity: '12 bags',
    weightKg: 90,
    preferredDate: '2026-08-30',
    preferredTime: '10:30 AM',
    specialNotes: 'Early morning temple dispatch.',
    assignedType: 'PRIVATE_TRANSPORTER',
    transporterId: 'trans-2',
    transporterName: 'Ganesh Deshmukh',
    transporterVehicle: 'Tata Ace Gold (MH-17-CB-4490)',
    transporterPhone: '+91 94220 77154',
    estimatedCost: 225,
    currentStatus: 'ACCEPTED',
    timeline: [
      { status: 'REQUESTED', timestamp: '2026-08-29 07:00 PM', description: 'Farmer requested transport to Shirdi', completed: true, current: false },
      { status: 'MATCHED', timestamp: '2026-08-29 07:10 PM', description: 'AI matched with Ganesh Deshmukh (Tata Ace)', completed: true, current: false },
      { status: 'ACCEPTED', timestamp: '2026-08-29 07:45 PM', description: 'Transporter accepted shipment request', completed: true, current: true },
      { status: 'PICKUP', timestamp: 'Scheduled 10:15 AM', description: 'Pickup at Sanvatsar Chowk', completed: false, current: false },
      { status: 'IN TRANSIT', timestamp: 'Pending', description: 'Transit along Kopargaon-Shirdi Highway', completed: false, current: false },
      { status: 'DELIVERED', timestamp: 'Expected 11:30 AM', description: 'Delivery at Shirdi Gate 2', completed: false, current: false }
    ],
    createdAt: '2026-08-29 19:00',
    estimatedDelivery: '2026-08-30 11:30 AM'
  },
  {
    id: 'ship-103',
    trackingNumber: 'KC-2026-78850',
    farmerId: 'farmer-1',
    farmerName: 'Balasaheb Vikhe',
    farmerPhone: '+91 98220 11223',
    origin: 'Kopargaon Rural Mandi',
    destination: 'Sangamner Cold Storage',
    goodsType: 'Organic Guava Crates',
    quantity: '40 boxes',
    weightKg: 400,
    preferredDate: '2026-08-28',
    preferredTime: '11:00 AM',
    assignedType: 'PRIVATE_TRANSPORTER',
    transporterName: 'Mahesh Borawake (Dost+)',
    transporterVehicle: 'Ashok Leyland Dost+ (MH-17-BY-1234)',
    estimatedCost: 1120,
    currentStatus: 'DELIVERED',
    timeline: [
      { status: 'REQUESTED', timestamp: '2026-08-28 08:00 AM', description: 'Shipment created', completed: true, current: false },
      { status: 'MATCHED', timestamp: '2026-08-28 08:15 AM', description: 'Matched with Transporter', completed: true, current: false },
      { status: 'ACCEPTED', timestamp: '2026-08-28 08:30 AM', description: 'Accepted by driver', completed: true, current: false },
      { status: 'PICKUP', timestamp: '2026-08-28 11:15 AM', description: 'Picked up at Mandi Yard', completed: true, current: false },
      { status: 'IN TRANSIT', timestamp: '2026-08-28 11:45 AM', description: 'In transit on SH-10', completed: true, current: false },
      { status: 'DELIVERED', timestamp: '2026-08-28 01:10 PM', description: 'Successfully delivered and signed', completed: true, current: true }
    ],
    createdAt: '2026-08-28 08:00',
    estimatedDelivery: '2026-08-28 01:10 PM'
  }
];

export const initialRequests: ShipmentRequest[] = [
  {
    id: 'req-1',
    tripId: 'trip-1',
    shipmentId: 'ship-201',
    farmerName: 'Dnyaneshwar Kale',
    farmerPhone: '+91 97651 22340',
    pickupLocation: 'Puntamba Sugar Road',
    dropLocation: 'Nashik Agricultural Produce Market',
    goodsType: 'Red Onion Sacks (50kg x 6)',
    weightKg: 300,
    offeredPrice: 960,
    preferredTime: '09:15 AM',
    status: 'PENDING',
    createdAt: '2026-08-29 20:30'
  },
  {
    id: 'req-2',
    tripId: 'trip-1',
    shipmentId: 'ship-202',
    farmerName: 'Kishor Kolpe',
    farmerPhone: '+91 98224 88901',
    pickupLocation: 'Kopargaon Bypass Mandi',
    dropLocation: 'Yeola Onion Market',
    goodsType: 'Sweet Lime Crates (20 boxes)',
    weightKg: 200,
    offeredPrice: 650,
    preferredTime: '09:00 AM',
    status: 'PENDING',
    createdAt: '2026-08-29 21:00'
  }
];

export const initialTrafficRegions: TrafficRegion[] = [
  {
    id: 'reg-godavari',
    name: 'Godavari Bridge — Kopargaon Bypass',
    center: [19.8985, 74.4820],
    coordinates: [
      [19.8920, 74.4760],
      [19.8960, 74.4800],
      [19.9010, 74.4850],
      [19.9060, 74.4910]
    ],
    reportCount: 3,
    currentTraffic: 'YELLOW',
    avgSpeedKmph: 24,
    statusMessage: 'Moderate congestion near river crossing due to bridge inspection.'
  },
  {
    id: 'reg-shirdi-hwy',
    name: 'Kopargaon — Shirdi Main Highway (SH-10)',
    center: [19.8300, 74.4750],
    coordinates: [
      [19.8900, 74.4780],
      [19.8500, 74.4760],
      [19.8100, 74.4740],
      [19.7700, 74.4760]
    ],
    reportCount: 1,
    currentTraffic: 'GREEN',
    avgSpeedKmph: 52,
    statusMessage: 'Smooth flow of pilgrim traffic and freight.'
  },
  {
    id: 'reg-apmc-market',
    name: 'APMC Market Yard & Station Road',
    center: [19.8940, 74.4720],
    coordinates: [
      [19.8910, 74.4690],
      [19.8935, 74.4725],
      [19.8960, 74.4760]
    ],
    reportCount: 4,
    currentTraffic: 'ORANGE',
    avgSpeedKmph: 14,
    statusMessage: 'Heavy farm tractor and truck queuing at vegetable auction yard.'
  },
  {
    id: 'reg-yeola-junc',
    name: 'Yeola Phata / North Toll Approach',
    center: [19.9400, 74.4920],
    coordinates: [
      [19.9100, 74.4880],
      [19.9350, 74.4920],
      [19.9600, 74.4970]
    ],
    reportCount: 0,
    currentTraffic: 'GREEN',
    avgSpeedKmph: 60,
    statusMessage: 'Clear and free flowing.'
  }
];

export const initialTrafficReports: TrafficReport[] = [
  {
    id: 'traf-1',
    userId: 'cit-101',
    userName: 'Sachin Thorat',
    roadName: 'APMC Market Yard & Station Road',
    regionKey: 'reg-apmc-market',
    locationDescription: 'Gate 2 APMC Main Entry, Kopargaon',
    description: 'Onion auction trucks blocking single-lane entry causing 20 min bottleneck.',
    photoUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80',
    timestamp: '2026-08-29 08:30 AM',
    severity: 'HEAVY',
    status: 'ACKNOWLEDGED',
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Municipal Police Dispatch',
    verifiedAt: '2026-08-29 08:35 AM',
    duplicateCount: 2,
    reportType: 'TRAFFIC'
  },
  {
    id: 'traf-2',
    userId: 'cit-102',
    userName: 'Vijay Chavan',
    roadName: 'APMC Market Yard & Station Road',
    regionKey: 'reg-apmc-market',
    locationDescription: 'Station road railway crossing approach',
    description: 'Tractor broken down near level crossing gate.',
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80',
    timestamp: '2026-08-29 08:45 AM',
    severity: 'HEAVY',
    status: 'ALERT_ISSUED',
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Traffic Command HQ',
    verifiedAt: '2026-08-29 08:50 AM',
    duplicateCount: 2,
    relatedReportId: 'traf-1',
    reportType: 'ROAD_INCIDENT'
  },
  {
    id: 'traf-3',
    userId: 'cit-103',
    userName: 'Rohan Shinde',
    roadName: 'Godavari Bridge — Kopargaon Bypass',
    regionKey: 'reg-godavari',
    locationDescription: 'North side ramp of old bridge',
    description: 'Minor road pothole patch work underway on left lane.',
    photoUrl: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80',
    timestamp: '2026-08-29 07:15 AM',
    severity: 'MODERATE',
    status: 'REPORTED',
    verificationStatus: 'UNDER_REVIEW',
    duplicateCount: 1,
    reportType: 'ROAD_INCIDENT'
  }
];

export const initialSafetyAlerts: SafetyAlert[] = [
  {
    id: 'alt-1',
    title: 'Heavy Market Congestion at Kopargaon APMC',
    category: 'TRAFFIC',
    severity: 'WARNING',
    location: 'APMC Yard / Station Road',
    description: 'High volume of agricultural vehicles causing slow movement. Commercial logistics advised to use bypass via Sanvatsar.',
    issuedBy: 'Kopargaon Traffic Control Division',
    timestamp: '2026-08-29 08:50 AM',
    expiresAt: '2026-08-30 02:00 PM',
    active: true
  },
  {
    id: 'alt-2',
    title: 'Bus Route KP-204 (Nashik CBS) 18-Min Delay',
    category: 'BUS_DELAY',
    severity: 'ADVISORY',
    location: 'Yeola Highway Section',
    description: 'Scheduled bus MH-17-BT-9821 delayed due to pipeline maintenance on Niphad stretch. Cargo pickup timing updated.',
    issuedBy: 'Depot Operations Central',
    timestamp: '2026-08-29 09:20 AM',
    expiresAt: '2026-08-29 01:00 PM',
    active: true
  },
  {
    id: 'alt-3',
    title: 'Caution: Monsoon Mist & Reduced Visibility on Shirdi Link',
    category: 'WEATHER',
    severity: 'INFO',
    location: 'SH-10 Kopargaon — Shirdi Stretch',
    description: 'Early morning fog between 05:30 AM to 07:30 AM. Maintain safe stopping distances and use low-beam headlights.',
    issuedBy: 'District Safety & Highway Police',
    timestamp: '2026-08-29 06:00 AM',
    expiresAt: '2026-08-31 10:00 AM',
    active: true
  }
];

export const initialEVStations: EVStation[] = [
  {
    id: 'ev-1',
    name: 'Kopargaon Central MSRTC Depot EV Hub',
    location: 'Kopargaon Bus Station, Station Road',
    address: 'Near Platform 6, Kopargaon Central Depot, Maharashtra 423601',
    lat: 19.8932,
    lng: 74.4795,
    distanceKm: 0.4,
    chargerType: 'DC Fast (60kW)',
    availableChargers: 3,
    totalChargers: 4,
    powerOutputKw: 60,
    pricingPerKwh: '₹14.50 / kWh',
    operatingHours: '24 Hours Open',
    status: 'OPERATIONAL',
    nearHighway: false
  },
  {
    id: 'ev-2',
    name: 'Shirdi Highway Toll Plaza Green Energy Hub',
    location: 'Kopargaon-Shirdi Highway (SH-10), Sanvatsar',
    address: 'Survey No. 44, SH-10 Highway, Sanvatsar Toll Plaza, Kopargaon',
    lat: 19.8450,
    lng: 74.4755,
    distanceKm: 6.8,
    chargerType: 'DC Ultra (120kW)',
    availableChargers: 2,
    totalChargers: 2,
    powerOutputKw: 120,
    pricingPerKwh: '₹17.00 / kWh',
    operatingHours: '24 Hours Open',
    status: 'OPERATIONAL',
    nearHighway: true
  },
  {
    id: 'ev-3',
    name: 'APMC Krushi Mandi Solar Fast Charger',
    location: 'APMC Market Yard Gate 1',
    address: 'Krushi Utpanna Bajar Samiti, Kopargaon, Maharashtra 423601',
    lat: 19.8950,
    lng: 74.4710,
    distanceKm: 1.2,
    chargerType: 'Dual (AC/DC)',
    availableChargers: 1,
    totalChargers: 2,
    powerOutputKw: 50,
    pricingPerKwh: '₹13.00 / kWh (Subsidized for Agri)',
    operatingHours: '06:00 AM - 10:00 PM',
    status: 'OPERATIONAL',
    nearHighway: false
  },
  {
    id: 'ev-4',
    name: 'Godavari Riverside Agro-Tourism Charging Point',
    location: 'Puntamba Road Bypass',
    address: 'Near Godavari Sugar Mill Crossing, Kopargaon',
    lat: 19.8820,
    lng: 74.4920,
    distanceKm: 3.5,
    chargerType: 'AC Type 2 (22kW)',
    availableChargers: 2,
    totalChargers: 2,
    powerOutputKw: 22,
    pricingPerKwh: '₹12.00 / kWh',
    operatingHours: '07:00 AM - 11:00 PM',
    status: 'OPERATIONAL',
    nearHighway: false
  }
];

export const initialNotifications: UserNotification[] = [
  {
    id: 'notif-1',
    targetRole: 'FARMER',
    title: 'Shipment KC-2026-78901 in Transit',
    message: 'Your pomegranate shipment (250 kg) is currently aboard Bus MH-17-BT-9821 passing Yeola Phata.',
    category: 'SHIPMENT',
    timestamp: '10 mins ago',
    read: false,
    actionUrl: '/citizen/farmer/track'
  },
  {
    id: 'notif-2',
    targetRole: 'TRANSPORTER',
    title: 'New Shipment Request (300 kg Onion)',
    message: 'Farmer Dnyaneshwar Kale requested transport for Red Onions from Puntamba to Nashik APMC.',
    category: 'SHIPMENT',
    timestamp: '25 mins ago',
    read: false,
    actionUrl: '/citizen/transporter/requests'
  },
  {
    id: 'notif-3',
    targetRole: 'CITIZEN',
    title: 'Bus Delay Notice: Route KP-204',
    message: 'Bus to Nashik CBS is currently delayed by 18 minutes due to roadwork near Niphad.',
    category: 'BUS',
    timestamp: '40 mins ago',
    read: false,
    actionUrl: '/citizen/bus-schedules'
  },
  {
    id: 'notif-4',
    targetRole: 'OFFICIAL',
    title: 'High Traffic Alert Reported',
    message: 'Multiple citizen reports received for APMC Market Yard road congestion (Severity: Orange).',
    category: 'TRAFFIC',
    timestamp: '1 hour ago',
    read: false,
    actionUrl: '/official/traffic-safety'
  }
];

export const initialPassengerBookings: PassengerBooking[] = [
  {
    id: 'bk-1',
    bookingId: 'BK-2026-0810-1250',
    transactionId: 'UPI-428951905621',
    busNumber: 'MH-17-BT-5540',
    routeId: 'KP-101',
    origin: 'Kopargaon Central Bus Station',
    destination: 'Shirdi Temple',
    stops: ['Sanvatsar Phata', 'Shirdi Temple', 'Rahata'],
    date: '30 Aug 2026',
    departureTime: '12:30 PM',
    arrivalTime: '01:45 PM',
    passengerCount: 1,
    farePerPassenger: 45,
    totalAmount: 45,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    bookingStatus: 'CONFIRMED',
    bookedAt: '30 Aug 2026, 11:20 AM',
    userName: 'Kopargaon Citizen'
  }
];


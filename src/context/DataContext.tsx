import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Bus,
  BusRoute,
  BusSchedule,
  PassengerBooking,
  Shipment,
  TransporterTrip,
  ShipmentRequest,
  TrafficReport,
  TrafficRegion,
  SafetyAlert,
  EVStation,
  UserNotification,
  initialBuses,
  initialRoutes,
  initialSchedules,
  initialPassengerBookings,
  initialTrips,
  initialShipments,
  initialRequests,
  initialTrafficRegions,
  initialTrafficReports,
  initialSafetyAlerts,
  initialEVStations,
  initialNotifications
} from '../lib/mockData';
import { getStorageItem, setStorageItem } from '../lib/supabase';

interface DataContextType {
  buses: Bus[];
  routes: BusRoute[];
  schedules: BusSchedule[];
  passengerBookings: PassengerBooking[];
  trips: TransporterTrip[];
  shipments: Shipment[];
  requests: ShipmentRequest[];
  trafficRegions: TrafficRegion[];
  trafficReports: TrafficReport[];
  safetyAlerts: SafetyAlert[];
  evStations: EVStation[];
  notifications: UserNotification[];

  // Dynamic Actions
  createSchedule: (schedule: Omit<BusSchedule, 'id'>) => void;
  updateScheduleStatus: (id: string, status: BusSchedule['status']) => void;
  updateBusStatus: (busId: string, status: Bus['status'], delayMins?: number) => void;
  bookBusTicket: (bookingData: Omit<PassengerBooking, 'id' | 'bookingId' | 'transactionId' | 'bookedAt' | 'paymentStatus' | 'bookingStatus'>) => PassengerBooking;
  bookBusCargo: (cargoData: {
    scheduleId: string;
    busNumber: string;
    route: string;
    weightKg: number;
    ratePerKg: number;
    totalCharge: number;
    senderName: string;
    senderPhone: string;
    goodsType: string;
    pickupLocation?: string;
    dropLocation?: string;
  }) => Shipment;
  publishTrip: (trip: Omit<TransporterTrip, 'id' | 'status'>) => void;
  createShipment: (shipment: Omit<Shipment, 'id' | 'trackingNumber' | 'timeline' | 'createdAt'>) => string;
  updateShipmentStatus: (id: string, status: Shipment['currentStatus'], description?: string) => void;
  requestShipmentForTrip: (tripId: string, details: {
    farmerName: string;
    farmerPhone: string;
    pickupLocation: string;
    dropLocation: string;
    goodsType: string;
    weightKg: number;
    offeredPrice: number;
    preferredTime: string;
  }) => void;
  acceptShipmentRequest: (requestId: string) => void;
  rejectShipmentRequest: (requestId: string) => void;
  addTrafficReport: (report: {
    userName: string;
    roadName: string;
    regionKey?: string;
    locationDescription: string;
    description: string;
    photoUrl?: string;
  }) => void;
  acknowledgeTrafficReport: (id: string) => void;
  issueAlertFromTraffic: (reportId: string, alertTitle: string, alertDesc: string) => void;
  resolveTrafficReport: (id: string) => void;
  createSafetyAlert: (alert: Omit<SafetyAlert, 'id' | 'timestamp' | 'active'>) => void;
  toggleAlertActive: (id: string) => void;
  addNotification: (notif: Omit<UserNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetToDemoDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Traffic severity calculation function based on the exact rule:
// 0–1 reports: GREEN
// 2–3 reports: YELLOW
// 4 reports: ORANGE
// 5+ reports: RED
export function calculateTrafficColor(reportCount: number): 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' {
  if (reportCount <= 1) return 'GREEN';
  if (reportCount <= 3) return 'YELLOW';
  if (reportCount === 4) return 'ORANGE';
  return 'RED';
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buses, setBuses] = useState<Bus[]>(() => getStorageItem('buses', initialBuses));
  const [routes] = useState<BusRoute[]>(() => getStorageItem('routes', initialRoutes));
  const [schedules, setSchedules] = useState<BusSchedule[]>(() => getStorageItem('schedules', initialSchedules));
  const [passengerBookings, setPassengerBookings] = useState<PassengerBooking[]>(() => getStorageItem('passengerBookings', initialPassengerBookings));
  const [trips, setTrips] = useState<TransporterTrip[]>(() => getStorageItem('trips', initialTrips));
  const [shipments, setShipments] = useState<Shipment[]>(() => getStorageItem('shipments', initialShipments));
  const [requests, setRequests] = useState<ShipmentRequest[]>(() => getStorageItem('requests', initialRequests));
  const [trafficRegions, setTrafficRegions] = useState<TrafficRegion[]>(() => getStorageItem('trafficRegions', initialTrafficRegions));
  const [trafficReports, setTrafficReports] = useState<TrafficReport[]>(() => getStorageItem('trafficReports', initialTrafficReports));
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>(() => getStorageItem('safetyAlerts', initialSafetyAlerts));
  const [evStations, setEvStations] = useState<EVStation[]>(() => getStorageItem('evStations', initialEVStations));
  const [notifications, setNotifications] = useState<UserNotification[]>(() => getStorageItem('notifications', initialNotifications));

  // Sync to local storage
  useEffect(() => setStorageItem('buses', buses), [buses]);
  useEffect(() => setStorageItem('schedules', schedules), [schedules]);
  useEffect(() => setStorageItem('passengerBookings', passengerBookings), [passengerBookings]);
  useEffect(() => setStorageItem('trips', trips), [trips]);
  useEffect(() => setStorageItem('shipments', shipments), [shipments]);
  useEffect(() => setStorageItem('requests', requests), [requests]);
  useEffect(() => setStorageItem('trafficRegions', trafficRegions), [trafficRegions]);
  useEffect(() => setStorageItem('trafficReports', trafficReports), [trafficReports]);
  useEffect(() => setStorageItem('safetyAlerts', safetyAlerts), [safetyAlerts]);
  useEffect(() => setStorageItem('evStations', evStations), [evStations]);
  useEffect(() => setStorageItem('notifications', notifications), [notifications]);

  // Dynamic Actions
  const createSchedule = (newSchedData: Omit<BusSchedule, 'id'>) => {
    const newSched: BusSchedule = {
      ...newSchedData,
      id: `sched-${Date.now()}`
    };
    setSchedules(prev => [newSched, ...prev]);

    // Send notification to citizens
    addNotification({
      targetRole: 'CITIZEN',
      title: `New Bus Schedule Published: ${newSched.busNumber}`,
      message: `Direct transit from ${newSched.origin} to ${newSched.destination} departing at ${newSched.departureTime}. Passenger seats & ${newSched.availableCargoKg}kg cargo bay space available.`,
      category: 'BUS'
    });
  };

  const updateScheduleStatus = (id: string, status: BusSchedule['status']) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const updateBusStatus = (busId: string, status: Bus['status'], delayMins = 0) => {
    setBuses(prev => prev.map(b => {
      if (b.id === busId) {
        return { ...b, status, delayMins };
      }
      return b;
    }));

    if (status === 'DELAYED' && delayMins > 0) {
      addNotification({
        targetRole: 'CITIZEN',
        title: `Bus Delay Alert: ${busId}`,
        message: `Bus delay reported: ${delayMins} minutes. Updated arrival timings reflected on Live Map and Bus Schedules.`,
        category: 'BUS'
      });
    }
  };

  // Passenger Bus Ticket Booking with seat deduction and realistic ID generation
  const bookBusTicket = (bookingData: Omit<PassengerBooking, 'id' | 'bookingId' | 'transactionId' | 'bookedAt' | 'paymentStatus' | 'bookingStatus'>): PassengerBooking => {
    const bookingId = `BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const prefix = bookingData.paymentMethod === 'UPI' ? 'UPI' : bookingData.paymentMethod === 'Card' ? 'CARD' : 'NET';
    const transactionId = `${prefix}-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newBooking: PassengerBooking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingId,
      transactionId,
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
      bookedAt: nowStr
    };

    // Deduct available seats in schedules
    setSchedules(prev => prev.map(s => {
      if (s.busNumber === bookingData.busNumber) {
        const newSeats = Math.max(0, s.availableSeats - bookingData.passengerCount);
        return { ...s, availableSeats: newSeats };
      }
      return s;
    }));

    // Update matching bus passenger load
    setBuses(prev => prev.map(b => {
      if (b.busNumber === bookingData.busNumber) {
        const newOccupied = Math.min(b.passengerCapacity, b.passengerOccupied + bookingData.passengerCount);
        return { ...b, passengerOccupied: newOccupied };
      }
      return b;
    }));

    setPassengerBookings(prev => [newBooking, ...prev]);

    // Send confirmation notification
    addNotification({
      targetRole: 'CITIZEN',
      title: `Ticket Confirmed: ${bookingId}`,
      message: `Confirmed ${bookingData.passengerCount} seat(s) on ${bookingData.busNumber} (${bookingData.origin} → ${bookingData.destination}) for ₹${bookingData.totalAmount}. Payment Status: PAID.`,
      category: 'BUS'
    });

    return newBooking;
  };

  // Cargo Booking on Public Bus Cargo Bay
  const bookBusCargo = (cargoData: {
    scheduleId: string;
    busNumber: string;
    route: string;
    weightKg: number;
    ratePerKg: number;
    totalCharge: number;
    senderName: string;
    senderPhone: string;
    goodsType: string;
    pickupLocation?: string;
    dropLocation?: string;
  }): Shipment => {
    // Deduct cargo capacity
    setSchedules(prev => prev.map(s => {
      if (s.id === cargoData.scheduleId || s.busNumber === cargoData.busNumber) {
        const newAvail = Math.max(0, s.availableCargoKg - cargoData.weightKg);
        return { ...s, availableCargoKg: newAvail };
      }
      return s;
    }));

    setBuses(prev => prev.map(b => {
      if (b.busNumber === cargoData.busNumber) {
        const newAvail = Math.max(0, b.availableCargoKg - cargoData.weightKg);
        const newUsed = Math.min(b.totalCargoKg, b.usedCargoKg + cargoData.weightKg);
        return { ...b, availableCargoKg: newAvail, usedCargoKg: newUsed };
      }
      return b;
    }));

    const originDest = cargoData.route.split('→').map(s => s.trim());
    const origin = cargoData.pickupLocation || originDest[0] || 'Kopargaon Central Bus Station';
    const destination = cargoData.dropLocation || originDest[1] || 'Destination Depot';

    const shipmentId = createShipment({
      farmerId: 'cit-current',
      farmerName: cargoData.senderName,
      farmerPhone: cargoData.senderPhone,
      origin,
      destination,
      goodsType: cargoData.goodsType,
      quantity: `${cargoData.weightKg} kg in Bus Cargo Bay`,
      weightKg: cargoData.weightKg,
      preferredDate: 'Today',
      preferredTime: 'Scheduled Bus Departure',
      assignedType: 'PUBLIC_BUS',
      transporterName: `MSRTC Bus (${cargoData.busNumber})`,
      transporterVehicle: `MSRTC Bus Cargo Bay (${cargoData.busNumber})`,
      estimatedCost: cargoData.totalCharge,
      currentStatus: 'ACCEPTED',
      estimatedDelivery: 'Today (Same Day Scheduled Arrival)',
      busScheduleId: cargoData.scheduleId
    });

    const createdShipment = shipments.find(s => s.id === shipmentId) || {
      id: shipmentId,
      trackingNumber: `KC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      farmerId: 'cit-current',
      farmerName: cargoData.senderName,
      farmerPhone: cargoData.senderPhone,
      origin,
      destination,
      goodsType: cargoData.goodsType,
      quantity: `${cargoData.weightKg} kg in Bus Cargo Bay`,
      weightKg: cargoData.weightKg,
      preferredDate: 'Today',
      preferredTime: 'Scheduled Bus Departure',
      assignedType: 'PUBLIC_BUS',
      transporterName: `MSRTC Bus (${cargoData.busNumber})`,
      transporterVehicle: `MSRTC Bus Cargo Bay (${cargoData.busNumber})`,
      estimatedCost: cargoData.totalCharge,
      currentStatus: 'ACCEPTED',
      createdAt: new Date().toLocaleDateString(),
      estimatedDelivery: 'Today (Same Day)',
      timeline: []
    };

    return createdShipment;
  };

  const publishTrip = (tripData: Omit<TransporterTrip, 'id' | 'status'>) => {
    const newTrip: TransporterTrip = {
      ...tripData,
      id: `trip-${Date.now()}`,
      status: 'SCHEDULED'
    };
    setTrips(prev => [newTrip, ...prev]);

    // Notify Farmers
    addNotification({
      targetRole: 'FARMER',
      title: `New Transport Available: ${tripData.origin} → ${tripData.destination}`,
      message: `${tripData.transporterName} (${tripData.vehicleType}) has published ${tripData.availableCapacityKg} kg available capacity on ${tripData.date}.`,
      category: 'SHIPMENT'
    });
  };

  const createShipment = (shipmentData: Omit<Shipment, 'id' | 'trackingNumber' | 'timeline' | 'createdAt'>): string => {
    const id = `ship-${Date.now()}`;
    const trackingNumber = `KC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newShipment: Shipment = {
      ...shipmentData,
      id,
      trackingNumber,
      createdAt: `${new Date().toISOString().split('T')[0]} ${nowStr}`,
      timeline: [
        {
          status: 'REQUESTED',
          timestamp: `${new Date().toLocaleDateString()} ${nowStr}`,
          description: `Shipment booked by ${shipmentData.farmerName} for ${shipmentData.weightKg} kg ${shipmentData.goodsType}.`,
          completed: true,
          current: shipmentData.currentStatus === 'REQUESTED'
        },
        {
          status: 'MATCHED',
          timestamp: shipmentData.currentStatus !== 'REQUESTED' ? `${new Date().toLocaleDateString()} ${nowStr}` : 'Pending assignment',
          description: shipmentData.transporterName ? `Matched with ${shipmentData.transporterName}` : 'Matching with optimal rural carrier',
          completed: shipmentData.currentStatus !== 'REQUESTED',
          current: shipmentData.currentStatus === 'MATCHED'
        },
        {
          status: 'ACCEPTED',
          timestamp: shipmentData.currentStatus === 'ACCEPTED' || shipmentData.currentStatus === 'IN TRANSIT' ? `${new Date().toLocaleDateString()} ${nowStr}` : 'Awaiting confirmation',
          description: 'Carrier confirmed cargo bay allocation',
          completed: shipmentData.currentStatus === 'ACCEPTED' || shipmentData.currentStatus === 'IN TRANSIT' || shipmentData.currentStatus === 'DELIVERED',
          current: shipmentData.currentStatus === 'ACCEPTED'
        },
        {
          status: 'PICKUP',
          timestamp: 'Scheduled',
          description: `Pickup at ${shipmentData.origin}`,
          completed: shipmentData.currentStatus === 'IN TRANSIT' || shipmentData.currentStatus === 'DELIVERED',
          current: shipmentData.currentStatus === 'PICKUP'
        },
        {
          status: 'IN TRANSIT',
          timestamp: shipmentData.currentStatus === 'IN TRANSIT' ? 'Active' : 'Pending dispatch',
          description: `In transit to ${shipmentData.destination}`,
          completed: shipmentData.currentStatus === 'IN TRANSIT' || shipmentData.currentStatus === 'DELIVERED',
          current: shipmentData.currentStatus === 'IN TRANSIT'
        },
        {
          status: 'DELIVERED',
          timestamp: shipmentData.estimatedDelivery,
          description: `Drop-off at ${shipmentData.destination}`,
          completed: shipmentData.currentStatus === 'DELIVERED',
          current: false
        }
      ]
    };

    setShipments(prev => [newShipment, ...prev]);

    // If assigned to private transporter, create a request record
    if (shipmentData.transporterId) {
      const trip = trips.find(t => t.transporterId === shipmentData.transporterId);
      if (trip) {
        setRequests(prev => [
          {
            id: `req-${Date.now()}`,
            tripId: trip.id,
            shipmentId: id,
            farmerName: shipmentData.farmerName,
            farmerPhone: shipmentData.farmerPhone,
            pickupLocation: shipmentData.origin,
            dropLocation: shipmentData.destination,
            goodsType: shipmentData.goodsType,
            weightKg: shipmentData.weightKg,
            offeredPrice: shipmentData.estimatedCost,
            preferredTime: shipmentData.preferredTime,
            status: 'PENDING',
            createdAt: 'Just now'
          },
          ...prev
        ]);

        addNotification({
          targetRole: 'TRANSPORTER',
          title: `New Shipment Request (${shipmentData.weightKg} kg)`,
          message: `${shipmentData.farmerName} requested cargo transport for ${shipmentData.goodsType} from ${shipmentData.origin} to ${shipmentData.destination}.`,
          category: 'SHIPMENT'
        });
      }
    }

    addNotification({
      targetRole: 'FARMER',
      title: `Shipment Created: ${trackingNumber}`,
      message: `Your booking for ${shipmentData.weightKg} kg ${shipmentData.goodsType} has been recorded. Tracking is now active.`,
      category: 'SHIPMENT'
    });

    return id;
  };

  const updateShipmentStatus = (id: string, status: Shipment['currentStatus'], description?: string) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setShipments(prev => prev.map(s => {
      if (s.id === id) {
        const updatedTimeline = s.timeline.map(step => {
          if (step.status === status) {
            return {
              ...step,
              completed: true,
              current: true,
              timestamp: `${new Date().toLocaleDateString()} ${nowStr}`,
              description: description || step.description
            };
          }
          if (['REQUESTED', 'MATCHED', 'ACCEPTED', 'PICKUP', 'IN TRANSIT', 'DELIVERED'].indexOf(step.status) < ['REQUESTED', 'MATCHED', 'ACCEPTED', 'PICKUP', 'IN TRANSIT', 'DELIVERED'].indexOf(status)) {
            return { ...step, completed: true, current: false };
          }
          return { ...step, current: false };
        });

        return {
          ...s,
          currentStatus: status,
          timeline: updatedTimeline
        };
      }
      return s;
    }));

    addNotification({
      targetRole: 'FARMER',
      title: `Shipment Status Updated: ${status}`,
      message: `Your shipment is now in status: ${status}.`,
      category: 'SHIPMENT'
    });
  };

  const requestShipmentForTrip = (tripId: string, details: {
    farmerName: string;
    farmerPhone: string;
    pickupLocation: string;
    dropLocation: string;
    goodsType: string;
    weightKg: number;
    offeredPrice: number;
    preferredTime: string;
  }) => {
    const newReqId = `req-${Date.now()}`;
    const newReq: ShipmentRequest = {
      id: newReqId,
      tripId,
      shipmentId: `ship-${Date.now()}`,
      ...details,
      status: 'PENDING',
      createdAt: 'Just now'
    };
    setRequests(prev => [newReq, ...prev]);

    addNotification({
      targetRole: 'TRANSPORTER',
      title: `New Shipment Request (${details.weightKg} kg)`,
      message: `${details.farmerName} requested cargo transit for ${details.goodsType} from ${details.pickupLocation}.`,
      category: 'SHIPMENT'
    });
  };

  const acceptShipmentRequest = (requestId: string) => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    // Update request status
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'ACCEPTED' } : r));

    // Deduct available capacity from trip
    setTrips(prev => prev.map(t => {
      if (t.id === req.tripId) {
        const newAvail = Math.max(0, t.availableCapacityKg - req.weightKg);
        return { ...t, availableCapacityKg: newAvail };
      }
      return t;
    }));

    // If shipment exists, update its status
    updateShipmentStatus(req.shipmentId, 'ACCEPTED', 'Transporter accepted cargo booking');

    // Notify farmer
    addNotification({
      targetRole: 'FARMER',
      title: 'Shipment Request Accepted!',
      message: `Transporter has confirmed your cargo request for ${req.goodsType} (${req.weightKg} kg). Pickup will proceed as scheduled.`,
      category: 'SHIPMENT'
    });
  };

  const rejectShipmentRequest = (requestId: string) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'REJECTED' } : r));
    addNotification({
      targetRole: 'FARMER',
      title: 'Shipment Request Declined',
      message: 'The transporter was unable to accommodate this cargo request. Please select an alternate carrier or public bus.',
      category: 'SHIPMENT'
    });
  };

  // Dynamic Traffic Logic
  const addTrafficReport = (reportData: {
    userName: string;
    roadName: string;
    regionKey?: string;
    locationDescription: string;
    description: string;
    photoUrl?: string;
  }) => {
    // Determine target region
    let targetRegion = trafficRegions.find(r => 
      (reportData.regionKey && r.id === reportData.regionKey) || 
      r.name.toLowerCase().includes(reportData.roadName.toLowerCase()) ||
      reportData.roadName.toLowerCase().includes(r.name.toLowerCase())
    );

    if (!targetRegion) {
      targetRegion = trafficRegions[0]; // default to APMC / Godavari
    }

    const updatedReportCount = targetRegion.reportCount + 1;
    const newTrafficColor = calculateTrafficColor(updatedReportCount);

    const newReport: TrafficReport = {
      id: `traf-${Date.now()}`,
      userId: `cit-${Math.floor(100 + Math.random() * 900)}`,
      userName: reportData.userName || 'Local Citizen',
      roadName: targetRegion.name,
      regionKey: targetRegion.id,
      locationDescription: reportData.locationDescription,
      description: reportData.description,
      photoUrl: reportData.photoUrl || 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      severity: newTrafficColor === 'RED' ? 'SEVERE' : newTrafficColor === 'ORANGE' ? 'HEAVY' : newTrafficColor === 'YELLOW' ? 'MODERATE' : 'LOW',
      status: 'REPORTED'
    };

    setTrafficReports(prev => [newReport, ...prev]);

    // Update traffic region count and color
    setTrafficRegions(prev => prev.map(r => {
      if (r.id === targetRegion!.id) {
        return {
          ...r,
          reportCount: updatedReportCount,
          currentTraffic: newTrafficColor,
          statusMessage: `${updatedReportCount} citizen reports received. Road traffic condition: ${newTrafficColor}.`
        };
      }
      return r;
    }));

    // Notify Official Command Center
    addNotification({
      targetRole: 'OFFICIAL',
      title: `Traffic Alert Reported: ${targetRegion.name}`,
      message: `${reportData.userName} submitted a traffic photo report. Active report count is now ${updatedReportCount} (${newTrafficColor} status).`,
      category: 'TRAFFIC'
    });
  };

  const acknowledgeTrafficReport = (id: string) => {
    setTrafficReports(prev => prev.map(r => r.id === id ? { ...r, status: 'ACKNOWLEDGED' } : r));
  };

  const issueAlertFromTraffic = (reportId: string, alertTitle: string, alertDesc: string) => {
    const report = trafficReports.find(r => r.id === reportId);
    if (!report) return;

    setTrafficReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'ALERT_ISSUED' } : r));

    createSafetyAlert({
      title: alertTitle || `Traffic Warning: ${report.roadName}`,
      category: 'TRAFFIC',
      severity: 'WARNING',
      location: report.locationDescription || report.roadName,
      description: alertDesc || report.description,
      issuedBy: 'Kopargaon Traffic & Safety Bureau',
      expiresAt: 'Today, 06:00 PM'
    });
  };

  const resolveTrafficReport = (id: string) => {
    const report = trafficReports.find(r => r.id === id);
    if (!report) return;

    setTrafficReports(prev => prev.map(r => r.id === id ? { ...r, status: 'RESOLVED' } : r));

    // Decrement region report count
    setTrafficRegions(prev => prev.map(r => {
      if (r.id === report.regionKey) {
        const newCount = Math.max(0, r.reportCount - 1);
        const newColor = calculateTrafficColor(newCount);
        return {
          ...r,
          reportCount: newCount,
          currentTraffic: newColor,
          statusMessage: newCount === 0 ? 'Clear and normal traffic flow.' : `${newCount} reports active (${newColor}).`
        };
      }
      return r;
    }));
  };

  const createSafetyAlert = (alertData: Omit<SafetyAlert, 'id' | 'timestamp' | 'active'>) => {
    const newAlert: SafetyAlert = {
      ...alertData,
      id: `alt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      active: true
    };
    setSafetyAlerts(prev => [newAlert, ...prev]);

    // Broadcast notification to all citizens
    addNotification({
      targetRole: 'ALL',
      title: `Official Safety Alert: ${alertData.title}`,
      message: `${alertData.description} — Location: ${alertData.location}`,
      category: 'ALERT'
    });
  };

  const toggleAlertActive = (id: string) => {
    setSafetyAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const addNotification = (notifData: Omit<UserNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: UserNotification = {
      ...notifData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const resetToDemoDefaults = () => {
    setBuses(initialBuses);
    setSchedules(initialSchedules);
    setPassengerBookings(initialPassengerBookings);
    setTrips(initialTrips);
    setShipments(initialShipments);
    setRequests(initialRequests);
    setTrafficRegions(initialTrafficRegions);
    setTrafficReports(initialTrafficReports);
    setSafetyAlerts(initialSafetyAlerts);
    setEvStations(initialEVStations);
    setNotifications(initialNotifications);
  };

  return (
    <DataContext.Provider
      value={{
        buses,
        routes,
        schedules,
        passengerBookings,
        trips,
        shipments,
        requests,
        trafficRegions,
        trafficReports,
        safetyAlerts,
        evStations,
        notifications,
        createSchedule,
        updateScheduleStatus,
        updateBusStatus,
        bookBusTicket,
        bookBusCargo,
        publishTrip,
        createShipment,
        updateShipmentStatus,
        requestShipmentForTrip,
        acceptShipmentRequest,
        rejectShipmentRequest,
        addTrafficReport,
        acknowledgeTrafficReport,
        issueAlertFromTraffic,
        resolveTrafficReport,
        createSafetyAlert,
        toggleAlertActive,
        addNotification,
        markNotificationRead,
        clearAllNotifications,
        resetToDemoDefaults
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

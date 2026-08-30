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
import { supabase, isSupabaseConfigured, getStorageItem, setStorageItem } from '../lib/supabase';
import { logJournalOperation } from '../lib/resilienceEngine';

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
  updateShipmentStatus: (shipmentId: string, status: Shipment['currentStatus'], note?: string) => void;
  createShipmentRequest: (req: Omit<ShipmentRequest, 'id' | 'status' | 'createdAt'>) => void;
  acceptShipmentRequest: (requestId: string) => void;
  rejectShipmentRequest: (requestId: string) => void;
  addTrafficReport: (report: {
    userName: string;
    roadName: string;
    regionKey?: string;
    locationDescription: string;
    description: string;
    photoUrl?: string;
    reportType?: 'TRAFFIC' | 'ROAD_INCIDENT' | 'BUS_DISRUPTION' | 'EV_STATION' | 'LOGISTICS';
  }) => void;
  acknowledgeTrafficReport: (id: string) => void;
  verifyReport: (id: string, verifiedBy?: string, notes?: string) => void;
  rejectReport: (id: string, reason?: string) => void;
  markReportOutdated: (id: string) => void;
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

// Traffic severity calculation function based on:
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

const mergeWithDefaults = <T extends { id: string }>(key: string, defaults: T[]): T[] => {
  const stored = getStorageItem<T[]>(key, defaults);
  if (!Array.isArray(stored) || stored.length === 0) return defaults;
  const storedIds = new Set(stored.map(s => s.id));
  const missingDefaults = defaults.filter(d => !storedIds.has(d.id));
  return [...stored, ...missingDefaults];
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buses, setBuses] = useState<Bus[]>(() => mergeWithDefaults('buses', initialBuses));
  const [routes] = useState<BusRoute[]>(() => mergeWithDefaults('routes', initialRoutes));
  const [schedules, setSchedules] = useState<BusSchedule[]>(() => mergeWithDefaults('schedules', initialSchedules));
  const [passengerBookings, setPassengerBookings] = useState<PassengerBooking[]>(() => getStorageItem('passengerBookings', initialPassengerBookings));
  const [trips, setTrips] = useState<TransporterTrip[]>(() => mergeWithDefaults('trips', initialTrips));
  const [shipments, setShipments] = useState<Shipment[]>(() => getStorageItem('shipments', initialShipments));
  const [requests, setRequests] = useState<ShipmentRequest[]>(() => getStorageItem('requests', initialRequests));
  const [trafficRegions, setTrafficRegions] = useState<TrafficRegion[]>(() => mergeWithDefaults('trafficRegions', initialTrafficRegions));
  const [trafficReports, setTrafficReports] = useState<TrafficReport[]>(() => mergeWithDefaults('trafficReports', initialTrafficReports));
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>(() => mergeWithDefaults('safetyAlerts', initialSafetyAlerts));
  const [evStations, setEvStations] = useState<EVStation[]>(() => mergeWithDefaults('evStations', initialEVStations));
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

  // Supabase Realtime and Data Synchronization
  useEffect(() => {
    const client = supabase;
    if (!client || !isSupabaseConfigured) return;

    // Fetch initial records from Supabase tables if present
    client.from('traffic_reports').select('*').then(({ data }) => {
      if (data && data.length > 0) {
        const mapped: TrafficReport[] = data.map((r: any) => ({
          id: String(r.id),
          userId: r.reporter_phone || 'citizen',
          userName: r.reporter_name,
          roadName: r.location_name,
          regionKey: r.location_name.toLowerCase().replace(/\s+/g, '_'),
          locationDescription: r.description || r.location_name,
          description: r.description || '',
          photoUrl: r.photo_url || '',
          timestamp: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          severity: r.congestion_level === 'RED' ? 'SEVERE' : r.congestion_level === 'ORANGE' ? 'HEAVY' : r.congestion_level === 'YELLOW' ? 'MODERATE' : 'LOW',
          status: (r.status === 'CLEARED' ? 'RESOLVED' : r.status) || 'REPORTED',
          verificationStatus: (r.verification_status as any) || 'UNDER_REVIEW',
          verifiedBy: r.verified_by,
          verifiedAt: r.verified_at ? new Date(r.verified_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
          duplicateCount: r.duplicate_count || 1
        }));
        setTrafficReports(prev => {
          const ids = new Set(prev.map(p => p.id));
          const newItems = mapped.filter(m => !ids.has(m.id));
          return [...newItems, ...prev];
        });
      }
    });

    client.from('safety_alerts').select('*').then(({ data }) => {
      if (data && data.length > 0) {
        const mapped: SafetyAlert[] = data.map((a: any) => ({
          id: String(a.id),
          title: a.title,
          description: a.message || a.description || '',
          severity: a.severity || 'WARNING',
          category: a.category || 'TRAFFIC',
          location: a.affected_area || a.location || 'Kopargaon',
          timestamp: new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          expiresAt: '24 hours',
          active: a.is_active ?? true,
          issuedBy: a.issued_by || 'Kopargaon Police Sub-Division'
        }));
        setSafetyAlerts(prev => {
          const ids = new Set(prev.map(p => p.id));
          const newItems = mapped.filter(m => !ids.has(m.id));
          return [...newItems, ...prev];
        });
      }
    });

    // Supabase Realtime Channels
    const channel = client
      .channel('kopargaon-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'traffic_reports' }, payload => {
        if (payload.new) {
          const r: any = payload.new;
          const newRep: TrafficReport = {
            id: String(r.id),
            userId: r.reporter_phone || 'citizen',
            userName: r.reporter_name,
            roadName: r.location_name,
            regionKey: r.location_name.toLowerCase().replace(/\s+/g, '_'),
            locationDescription: r.description || r.location_name,
            description: r.description || '',
            photoUrl: r.photo_url || '',
            timestamp: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            severity: r.congestion_level === 'RED' ? 'SEVERE' : r.congestion_level === 'ORANGE' ? 'HEAVY' : r.congestion_level === 'YELLOW' ? 'MODERATE' : 'LOW',
            status: (r.status === 'CLEARED' ? 'RESOLVED' : r.status) || 'REPORTED',
            verificationStatus: (r.verification_status as any) || 'UNDER_REVIEW',
            verifiedBy: r.verified_by,
            verifiedAt: r.verified_at ? new Date(r.verified_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
            duplicateCount: r.duplicate_count || 1
          };
          setTrafficReports(prev => [newRep, ...prev.filter(x => x.id !== newRep.id)]);
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'safety_alerts' }, payload => {
        if (payload.new) {
          const a: any = payload.new;
          const newAlert: SafetyAlert = {
            id: String(a.id),
            title: a.title,
            description: a.message || a.description || '',
            severity: a.severity || 'WARNING',
            category: a.category || 'TRAFFIC',
            location: a.affected_area || a.location || 'Kopargaon',
            timestamp: new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            expiresAt: '24 hours',
            active: a.is_active ?? true,
            issuedBy: a.issued_by || 'Kopargaon Police Sub-Division'
          };
          setSafetyAlerts(prev => [newAlert, ...prev.filter(x => x.id !== newAlert.id)]);
        }
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  // Dynamic Actions
  const createSchedule = (newSchedData: Omit<BusSchedule, 'id'>) => {
    const newSched: BusSchedule = {
      ...newSchedData,
      id: `sched-${Date.now()}`
    };
    setSchedules(prev => [newSched, ...prev]);

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

  // Passenger Bus Ticket Booking
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

    // Send to Supabase
    if (supabase && isSupabaseConfigured) {
      supabase.from('passenger_bookings').insert({
        booking_id: bookingId,
        bus_number: bookingData.busNumber,
        route_id: String(bookingData.routeId),
        origin: bookingData.origin,
        destination: bookingData.destination,
        stops: bookingData.stops,
        date: bookingData.date,
        departure_time: bookingData.departureTime,
        arrival_time: bookingData.arrivalTime,
        passenger_count: bookingData.passengerCount,
        fare_per_passenger: bookingData.farePerPassenger,
        total_amount: bookingData.totalAmount,
        payment_method: bookingData.paymentMethod,
        transaction_id: transactionId,
        user_name: bookingData.userName || 'Citizen',
        booking_status: 'CONFIRMED'
      }).then();
    }

    // Record in Immutable Resilience Operation Journal
    logJournalOperation({
      entity_type: 'BUS_BOOKING',
      entity_id: bookingId,
      operation_type: 'BUS_BOOKING_CREATED',
      actor_user_id: bookingData.userName || 'citizen-user',
      actor_role: 'CITIZEN',
      payload: newBooking
    }).catch(err => console.warn('Resilience journal notice:', err));

    addNotification({
      targetRole: 'CITIZEN',
      title: `Ticket Confirmed: ${bookingId}`,
      message: `Confirmed ${bookingData.passengerCount} seat(s) on ${bookingData.busNumber} (${bookingData.origin} → ${bookingData.destination}) for ₹${bookingData.totalAmount}. Payment Status: PAID.`,
      category: 'BUS'
    });

    return newBooking;
  };

  // Bus Cargo Booking
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
      assignedType: 'PUBLIC_BUS' as const,
      transporterName: `MSRTC Bus (${cargoData.busNumber})`,
      transporterVehicle: `MSRTC Bus Cargo Bay (${cargoData.busNumber})`,
      estimatedCost: cargoData.totalCharge,
      currentStatus: 'ACCEPTED' as const,
      estimatedDelivery: 'Today',
      busScheduleId: cargoData.scheduleId,
      timeline: [
        { status: 'Cargo Space Reserved', timestamp: new Date().toISOString(), description: `Allocated ${cargoData.weightKg} kg in ${cargoData.busNumber}`, completed: true, current: true }
      ],
      createdAt: new Date().toISOString()
    };

    return createdShipment;
  };

  // Publish Transporter Trip
  const publishTrip = (tripData: Omit<TransporterTrip, 'id' | 'status'>) => {
    const newTrip: TransporterTrip = {
      ...tripData,
      id: `trip-${Date.now()}`,
      status: 'SCHEDULED'
    };
    setTrips(prev => [newTrip, ...prev]);

    if (supabase && isSupabaseConfigured) {
      supabase.from('published_trips').insert({
        transporter_name: tripData.transporterName,
        phone: tripData.phone,
        vehicle_type: tripData.vehicleType,
        vehicle_number: tripData.vehicleNumber,
        origin: tripData.origin,
        destination: tripData.destination,
        date: tripData.date,
        departure_time: tripData.departureTime,
        arrival_time: tripData.estimatedArrival,
        available_weight_kg: tripData.availableCapacityKg,
        max_weight_kg: tripData.totalCapacityKg,
        base_rate_per_kg: tripData.chargePerKg,
        notes: tripData.notes
      }).then();
    }

    // Record in Immutable Resilience Operation Journal
    logJournalOperation({
      entity_type: 'TRANSPORTER_TRIP',
      entity_id: newTrip.id,
      operation_type: 'TRIP_CREATED',
      actor_user_id: tripData.transporterName,
      actor_role: 'TRANSPORTER',
      payload: newTrip
    }).catch(err => console.warn('Resilience journal notice:', err));

    addNotification({
      targetRole: 'FARMER',
      title: `New Transit Capacity Available: ${newTrip.origin} → ${newTrip.destination}`,
      message: `${newTrip.transporterName} published ${newTrip.availableCapacityKg} kg capacity on ${newTrip.vehicleType} (${newTrip.vehicleNumber}) departing ${newTrip.date} at ${newTrip.departureTime}.`,
      category: 'SHIPMENT'
    });
  };

  // Create Shipment
  const createShipment = (data: Omit<Shipment, 'id' | 'trackingNumber' | 'timeline' | 'createdAt'>): string => {
    const trackingNumber = `KC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newShipmentId = `ship-${Date.now()}`;
    const newShipment: Shipment = {
      ...data,
      id: newShipmentId,
      trackingNumber,
      timeline: [
        {
          status: 'Shipment Created',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: `Requested transit for ${data.quantity} of ${data.goodsType} (${data.weightKg} kg)`,
          completed: true,
          current: true
        }
      ],
      createdAt: new Date().toISOString()
    };

    setShipments(prev => [newShipment, ...prev]);

    if (supabase && isSupabaseConfigured) {
      supabase.from('shipments').insert({
        tracking_number: trackingNumber,
        farmer_id: data.farmerId,
        farmer_name: data.farmerName,
        farmer_phone: data.farmerPhone,
        origin: data.origin,
        destination: data.destination,
        goods_type: data.goodsType,
        quantity: data.quantity,
        weight_kg: data.weightKg,
        preferred_date: data.preferredDate,
        preferred_time: data.preferredTime,
        assigned_type: data.assignedType,
        transporter_name: data.transporterName,
        transporter_vehicle: data.transporterVehicle,
        estimated_cost: data.estimatedCost,
        current_status: data.currentStatus,
        estimated_delivery: data.estimatedDelivery,
        bus_schedule_id: data.busScheduleId,
        timeline: newShipment.timeline
      }).then();
    }

    // Record in Immutable Resilience Operation Journal
    logJournalOperation({
      entity_type: 'SHIPMENT',
      entity_id: trackingNumber,
      operation_type: 'SHIPMENT_CREATED',
      actor_user_id: data.farmerId || 'farmer',
      actor_role: 'FARMER',
      payload: newShipment
    }).catch(err => console.warn('Resilience journal notice:', err));

    addNotification({
      targetRole: 'TRANSPORTER',
      title: 'New Cargo Shipment Request',
      message: `Farmer ${data.farmerName} requested transit for ${data.weightKg} kg of ${data.goodsType} from ${data.origin} to ${data.destination}.`,
      category: 'SHIPMENT'
    });

    return newShipmentId;
  };

  const updateShipmentStatus = (shipmentId: string, status: Shipment['currentStatus'], note?: string) => {
    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId || s.trackingNumber === shipmentId) {
        const updatedTimeline = [
          ...s.timeline.map(t => ({ ...t, current: false })),
          {
            status: status === 'ACCEPTED' ? 'Carrier Confirmed' :
                    status === 'PICKUP' ? 'Cargo Loaded' :
                    status === 'IN TRANSIT' ? 'In Transit' :
                    status === 'DELIVERED' ? 'Delivery Completed' : status,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            description: note || `Status updated to ${status}`,
            completed: true,
            current: true
          }
        ];
        return {
          ...s,
          currentStatus: status,
          timeline: updatedTimeline
        };
      }
      return s;
    }));

    // Record in Immutable Resilience Operation Journal
    logJournalOperation({
      entity_type: 'SHIPMENT',
      entity_id: shipmentId,
      operation_type: 'SHIPMENT_STATUS_CHANGED',
      actor_user_id: 'official-or-transporter',
      actor_role: 'SYSTEM',
      payload: { shipmentId, status, note, updatedAt: new Date().toISOString() }
    }).catch(err => console.warn('Resilience journal notice:', err));

    if (supabase && isSupabaseConfigured) {
      supabase.from('shipments').update({
        current_status: status
      }).or(`id.eq.${shipmentId},tracking_number.eq.${shipmentId}`).then();
    }
  };

  const createShipmentRequest = (reqData: Omit<ShipmentRequest, 'id' | 'status' | 'createdAt'>) => {
    const newReq: ShipmentRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setRequests(prev => [newReq, ...prev]);

    addNotification({
      targetRole: 'TRANSPORTER',
      title: 'New Cargo Booking Inquiry',
      message: `${reqData.farmerName} wants to book ${reqData.weightKg} kg on your trip to ${reqData.dropLocation}. Estimated Freight: ₹${reqData.offeredPrice}.`,
      category: 'SHIPMENT'
    });
  };

  const acceptShipmentRequest = (requestId: string) => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'ACCEPTED' } : r));

    setTrips(prev => prev.map(t => {
      if (t.id === req.tripId) {
        const newAvail = Math.max(0, t.availableCapacityKg - req.weightKg);
        return { ...t, availableCapacityKg: newAvail };
      }
      return t;
    }));

    updateShipmentStatus(req.shipmentId, 'ACCEPTED', 'Transporter accepted cargo booking');

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
    reportType?: 'TRAFFIC' | 'ROAD_INCIDENT' | 'BUS_DISRUPTION' | 'EV_STATION' | 'LOGISTICS';
  }) => {
    let targetRegion = trafficRegions.find(r => 
      (reportData.regionKey && r.id === reportData.regionKey) || 
      r.name.toLowerCase().includes(reportData.roadName.toLowerCase()) ||
      reportData.roadName.toLowerCase().includes(r.name.toLowerCase())
    );

    if (!targetRegion) {
      targetRegion = trafficRegions[0];
    }

    // Duplicate detection: check if there are recent reports in the same corridor
    const existingCorridorReports = trafficReports.filter(r => 
      r.regionKey === targetRegion!.id && r.verificationStatus !== 'REJECTED' && r.verificationStatus !== 'OUTDATED'
    );
    const calculatedDuplicateCount = existingCorridorReports.length + 1;

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
      status: 'REPORTED',
      verificationStatus: 'UNDER_REVIEW',
      duplicateCount: calculatedDuplicateCount,
      reportType: reportData.reportType || 'TRAFFIC',
      relatedReportId: existingCorridorReports[0]?.id
    };

    setTrafficReports(prev => [newReport, ...prev]);

    setTrafficRegions(prev => prev.map(r => {
      if (r.id === targetRegion!.id) {
        return {
          ...r,
          reportCount: updatedReportCount,
          currentTraffic: newTrafficColor,
          statusMessage: `${updatedReportCount} citizen reports pending verification. Traffic level: ${newTrafficColor}.`
        };
      }
      return r;
    }));

    if (supabase && isSupabaseConfigured) {
      supabase.from('traffic_reports').insert({
        reporter_name: reportData.userName || 'Citizen',
        reporter_role: 'CITIZEN',
        location_name: targetRegion.name,
        coordinates: targetRegion.coordinates,
        congestion_level: newTrafficColor,
        description: reportData.description,
        photo_url: reportData.photoUrl,
        status: 'REPORTED',
        verification_status: 'UNDER_REVIEW',
        duplicate_count: calculatedDuplicateCount
      }).then();
    }

    // Record in Immutable Resilience Operation Journal
    logJournalOperation({
      entity_type: 'TRAFFIC_REPORT',
      entity_id: newReport.id,
      operation_type: 'TRAFFIC_REPORT_CREATED',
      actor_user_id: reportData.userName || 'citizen',
      actor_role: 'CITIZEN',
      payload: newReport
    }).catch(err => console.warn('Resilience journal notice:', err));

    addNotification({
      targetRole: 'OFFICIAL',
      title: `Citizen Traffic Report Under Review: ${targetRegion.name}`,
      message: `Citizen reported: "${reportData.description}". Total reports in zone: ${updatedReportCount}. Verification required.`,
      category: 'TRAFFIC'
    });
  };

  const acknowledgeTrafficReport = (id: string) => {
    setTrafficReports(prev => prev.map(r => r.id === id ? { ...r, status: 'ACKNOWLEDGED' } : r));

    if (supabase && isSupabaseConfigured) {
      supabase.from('traffic_reports').update({ status: 'ACKNOWLEDGED' }).eq('id', id).then();
    }
  };

  // Official Verification: Mark verified by authorized official
  const verifyReport = (id: string, verifiedBy?: string, notes?: string) => {
    const verifiedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const officialName = verifiedBy || 'Municipal Official';

    setTrafficReports(prev => prev.map(r => r.id === id ? {
      ...r,
      verificationStatus: 'VERIFIED',
      verifiedBy: officialName,
      verifiedAt: verifiedTime,
      verificationNotes: notes,
      status: 'ACKNOWLEDGED'
    } : r));

    if (supabase && isSupabaseConfigured) {
      supabase.from('traffic_reports').update({
        verification_status: 'VERIFIED',
        verified_by: officialName,
        verified_at: new Date().toISOString(),
        status: 'ACKNOWLEDGED'
      }).eq('id', id).then();
    }

    // Record in Immutable Resilience Operation Journal
    logJournalOperation({
      entity_type: 'TRAFFIC_REPORT',
      entity_id: id,
      operation_type: 'TRAFFIC_REPORT_VERIFIED',
      actor_user_id: officialName,
      actor_role: 'OFFICIAL',
      payload: { id, verifiedBy: officialName, verifiedAt: verifiedTime, notes }
    }).catch(err => console.warn('Resilience journal notice:', err));

    addNotification({
      targetRole: 'ALL',
      title: 'Traffic Incident Officially Verified',
      message: `Municipal Dispatch verified road condition report for Kopargaon corridor.`,
      category: 'TRAFFIC'
    });
  };

  // Official Rejection: Dismiss inaccurate or false citizen report
  const rejectReport = (id: string, reason?: string) => {
    setTrafficReports(prev => prev.map(r => r.id === id ? {
      ...r,
      verificationStatus: 'REJECTED',
      verificationNotes: reason || 'Dismissed upon official inspection',
      status: 'RESOLVED'
    } : r));

    if (supabase && isSupabaseConfigured) {
      supabase.from('traffic_reports').update({
        verification_status: 'REJECTED',
        status: 'RESOLVED'
      }).eq('id', id).then();
    }
  };

  // Mark Report Outdated: Expired / cleared incident
  const markReportOutdated = (id: string) => {
    setTrafficReports(prev => prev.map(r => r.id === id ? {
      ...r,
      verificationStatus: 'OUTDATED',
      status: 'RESOLVED'
    } : r));

    if (supabase && isSupabaseConfigured) {
      supabase.from('traffic_reports').update({
        verification_status: 'OUTDATED',
        status: 'RESOLVED'
      }).eq('id', id).then();
    }
  };

  const issueAlertFromTraffic = (reportId: string, alertTitle: string, alertDesc: string) => {
    const rep = trafficReports.find(r => r.id === reportId);
    acknowledgeTrafficReport(reportId);

    const newAlert: SafetyAlert = {
      id: `alert-${Date.now()}`,
      title: alertTitle || `Traffic Alert: ${rep?.roadName || 'Kopargaon Corridor'}`,
      description: alertDesc || rep?.description || 'Heavy congestion reported. Follow diversions.',
      severity: 'WARNING',
      category: 'TRAFFIC',
      location: rep?.roadName || 'Kopargaon Central',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiresAt: '12 hours',
      active: true,
      issuedBy: 'Kopargaon Police Sub-Division'
    };

    setSafetyAlerts(prev => [newAlert, ...prev]);

    if (supabase && isSupabaseConfigured) {
      supabase.from('safety_alerts').insert({
        title: newAlert.title,
        message: newAlert.description,
        severity: 'WARNING',
        category: 'TRAFFIC',
        affected_area: newAlert.location,
        is_active: true,
        issued_by: 'Kopargaon Police Sub-Division'
      }).then();
    }
  };

  const resolveTrafficReport = (id: string) => {
    const rep = trafficReports.find(r => r.id === id);
    if (rep) {
      const region = trafficRegions.find(rg => rg.id === rep.regionKey || rg.name === rep.roadName);
      if (region) {
        const newCount = Math.max(0, region.reportCount - 1);
        const newColor = calculateTrafficColor(newCount);
        setTrafficRegions(prev => prev.map(rg => rg.id === region.id ? {
          ...rg,
          reportCount: newCount,
          currentTraffic: newColor,
          statusMessage: newCount === 0 ? 'Normal traffic flow' : `${newCount} active reports (${newColor})`
        } : rg));
      }
    }

    setTrafficReports(prev => prev.map(r => r.id === id ? { ...r, status: 'RESOLVED' } : r));

    if (supabase && isSupabaseConfigured) {
      supabase.from('traffic_reports').update({ status: 'CLEARED' }).eq('id', id).then();
    }
  };

  const createSafetyAlert = (alertData: Omit<SafetyAlert, 'id' | 'timestamp' | 'active'>) => {
    const newAlert: SafetyAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      active: true
    };
    setSafetyAlerts(prev => [newAlert, ...prev]);

    if (supabase && isSupabaseConfigured) {
      supabase.from('safety_alerts').insert({
        title: newAlert.title,
        message: newAlert.description,
        severity: newAlert.severity,
        category: newAlert.category,
        affected_area: newAlert.location,
        is_active: true,
        issued_by: newAlert.issuedBy
      }).then();
    }

    // Record in Immutable Resilience Operation Journal
    logJournalOperation({
      entity_type: 'SAFETY_ALERT',
      entity_id: newAlert.id,
      operation_type: 'ALERT_CREATED',
      actor_user_id: newAlert.issuedBy,
      actor_role: 'OFFICIAL',
      payload: newAlert
    }).catch(err => console.warn('Resilience journal notice:', err));

    addNotification({
      targetRole: 'CITIZEN',
      title: `Safety Broadcast: ${newAlert.title}`,
      message: newAlert.description,
      category: 'ALERT'
    });
  };

  const toggleAlertActive = (id: string) => {
    setSafetyAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const addNotification = (notifData: Omit<UserNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: UserNotification = {
      ...notifData,
      id: `notif-${Date.now()}`,
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
        createShipmentRequest,
        acceptShipmentRequest,
        rejectShipmentRequest,
        addTrafficReport,
        acknowledgeTrafficReport,
        verifyReport,
        rejectReport,
        markReportOutdated,
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

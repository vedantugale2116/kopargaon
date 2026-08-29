import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Landing & Auth
import { LandingPage } from './pages/landing/LandingPage';
import { CitizenLogin } from './pages/auth/CitizenLogin';
import { CitizenRegister } from './pages/auth/CitizenRegister';
import { RoleSelection } from './pages/auth/RoleSelection';
import { OfficialLogin } from './pages/auth/OfficialLogin';

// Citizen & Portals
import { CitizenPortal } from './pages/citizen/CitizenPortal';
import { JourneyPlanner } from './pages/citizen/JourneyPlanner';
import { BusSchedules } from './pages/citizen/BusSchedules';
import { CitizenLiveMap } from './pages/citizen/CitizenLiveMap';
import { ReportTraffic } from './pages/citizen/ReportTraffic';
import { SafetyAlerts } from './pages/citizen/SafetyAlerts';
import { EVStations } from './pages/citizen/EVStations';
import { CitizenProfile } from './pages/citizen/CitizenProfile';
import { MyBookings } from './pages/citizen/MyBookings';

// Farmer
import { FarmerPortal } from './pages/farmer/FarmerPortal';
import { SendGoods } from './pages/farmer/SendGoods';
import { AvailableTransport } from './pages/farmer/AvailableTransport';
import { ConnectAI } from './pages/farmer/ConnectAI';
import { MyShipments } from './pages/farmer/MyShipments';
import { TrackShipment } from './pages/farmer/TrackShipment';

// Transporter
import { TransporterPortal } from './pages/transporter/TransporterPortal';
import { PublishTrip } from './pages/transporter/PublishTrip';
import { MyTrips } from './pages/transporter/MyTrips';
import { ShipmentRequests } from './pages/transporter/ShipmentRequests';

// Official
import { OperationalOverview } from './pages/official/OperationalOverview';
import { OfficialLiveMap } from './pages/official/OfficialLiveMap';
import { FleetManagement } from './pages/official/FleetManagement';
import { BusDepotOperations } from './pages/official/BusDepotOperations';
import { ScheduleManagement } from './pages/official/ScheduleManagement';
import { OfficialShipments } from './pages/official/OfficialShipments';
import { CargoCapacityMonitor } from './pages/official/CargoCapacityMonitor';
import { TrafficSafetyManagement } from './pages/official/TrafficSafetyManagement';
import { AlertManagementCenter } from './pages/official/AlertManagementCenter';
import { EVInfrastructure } from './pages/official/EVInfrastructure';
import { OfficialProfile } from './pages/official/OfficialProfile';

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            {/* Landing & Public Flow */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/citizen/login" element={<CitizenLogin />} />
            <Route path="/citizen/register" element={<CitizenRegister />} />
            <Route path="/citizen/role" element={<RoleSelection />} />

            {/* General Citizen Portal Routes */}
            <Route path="/citizen" element={<CitizenPortal />} />
            <Route path="/citizen/general" element={<CitizenPortal />} />
            <Route path="/citizen/journey" element={<JourneyPlanner />} />
            <Route path="/citizen/bus-schedules" element={<BusSchedules />} />
            <Route path="/citizen/map" element={<CitizenLiveMap />} />
            <Route path="/citizen/report-traffic" element={<ReportTraffic />} />
            <Route path="/citizen/safety" element={<SafetyAlerts />} />
            <Route path="/citizen/ev-stations" element={<EVStations />} />
            <Route path="/citizen/bookings" element={<MyBookings />} />
            <Route path="/citizen/profile" element={<CitizenProfile />} />

            {/* Farmer Portal & Rural Logistics Routes */}
            <Route path="/citizen/farmer" element={<FarmerPortal />} />
            <Route path="/citizen/farmer/send-goods" element={<SendGoods />} />
            <Route path="/citizen/farmer/transport" element={<AvailableTransport />} />
            <Route path="/citizen/farmer/ai" element={<ConnectAI />} />
            <Route path="/citizen/farmer/shipments" element={<MyShipments />} />
            <Route path="/citizen/farmer/track" element={<TrackShipment />} />

            {/* Private Transporter Portal Routes */}
            <Route path="/citizen/transporter" element={<TransporterPortal />} />
            <Route path="/citizen/transporter/publish-trip" element={<PublishTrip />} />
            <Route path="/citizen/transporter/trips" element={<MyTrips />} />
            <Route path="/citizen/transporter/requests" element={<ShipmentRequests />} />

            {/* Official Portal Routes */}
            <Route path="/official/login" element={<OfficialLogin />} />
            <Route path="/official" element={<OperationalOverview />} />
            <Route path="/official/overview" element={<OperationalOverview />} />
            <Route path="/official/map" element={<OfficialLiveMap />} />
            <Route path="/official/depot" element={<BusDepotOperations />} />
            <Route path="/official/schedules" element={<ScheduleManagement />} />
            <Route path="/official/fleet" element={<FleetManagement />} />
            <Route path="/official/shipments" element={<OfficialShipments />} />
            <Route path="/official/capacity" element={<CargoCapacityMonitor />} />
            <Route path="/official/traffic-safety" element={<TrafficSafetyManagement />} />
            <Route path="/official/alerts" element={<AlertManagementCenter />} />
            <Route path="/official/ev-infrastructure" element={<EVInfrastructure />} />
            <Route path="/official/settings" element={<OfficialProfile />} />
            <Route path="/official/trips" element={<MyTrips />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;

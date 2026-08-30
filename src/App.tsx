import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Landing & Auth
import { LandingPage } from './pages/landing/LandingPage';
import { CitizenLogin } from './pages/auth/CitizenLogin';
import { CitizenRegister } from './pages/auth/CitizenRegister';
import { RoleSelection } from './pages/auth/RoleSelection';
import { OfficialLogin } from './pages/auth/OfficialLogin';
import { OfficialResetPassword } from './pages/auth/OfficialResetPassword';

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
import { DataResilienceCenter } from './pages/official/DataResilienceCenter';

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            {/* Landing & Public Flows */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/citizen/login" element={<CitizenLogin />} />
            <Route path="/citizen/register" element={<CitizenRegister />} />
            <Route path="/official/login" element={<OfficialLogin />} />
            <Route path="/official/reset-password" element={<OfficialResetPassword />} />

            {/* Protected Citizen Setup */}
            <Route
              path="/citizen/role"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <RoleSelection />
                </ProtectedRoute>
              }
            />

            {/* Protected General Citizen Portal Routes */}
            <Route
              path="/citizen"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <CitizenPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/general"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <CitizenPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/journey"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <JourneyPlanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/bus-schedules"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <BusSchedules />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/map"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <CitizenLiveMap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/report-traffic"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <ReportTraffic />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/safety"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <SafetyAlerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/ev-stations"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <EVStations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/bookings"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/profile"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <CitizenProfile />
                </ProtectedRoute>
              }
            />

            {/* Protected Farmer Portal & Agri-Logistics Routes */}
            <Route
              path="/citizen/farmer"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <FarmerPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/farmer/send-goods"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <SendGoods />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/farmer/transport"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <AvailableTransport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/farmer/ai"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <ConnectAI />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/farmer/shipments"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <MyShipments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/farmer/track"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <TrackShipment />
                </ProtectedRoute>
              }
            />

            {/* Protected Private Transporter Portal Routes */}
            <Route
              path="/citizen/transporter"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <TransporterPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/transporter/publish-trip"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <PublishTrip />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/transporter/trips"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <MyTrips />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/transporter/requests"
              element={
                <ProtectedRoute allowedUserType="CITIZEN">
                  <ShipmentRequests />
                </ProtectedRoute>
              }
            />

            {/* Protected Official Portal Routes */}
            <Route
              path="/official"
              element={
                <ProtectedRoute allowedUserType="OFFICIAL">
                  <OperationalOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/official/overview"
              element={
                <ProtectedRoute allowedUserType="OFFICIAL">
                  <OperationalOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/official/map"
              element={
                <ProtectedRoute allowedUserType="OFFICIAL">
                  <OfficialLiveMap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/official/depot"
              element={
                <ProtectedRoute allowedUserType="OFFICIAL">
                  <BusDepotOperations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/official/schedules"
              element={
                <ProtectedRoute allowedUserType="OFFICIAL">
                  <ScheduleManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/official/fleet"
              element={
                <ProtectedRoute allowedUserType="OFFICIAL">
                  <FleetManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/official/shipments"
              element={
                <ProtectedRoute allowedUserType="OFFICIAL">
                  <OfficialShipments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/official/capacity"
              element={
                <ProtectedRoute allowedUserType="OFFICIAL">
                  <CargoCapacityMonitor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/official/traffic-safety"
              element={
                <ProtectedRoute allowedUserType="OFFICIAL">
                  <TrafficSafetyManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/official/alerts"
              element={
                <ProtectedRoute allowedUserType="OFFICIAL">
                  <AlertManagementCenter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/official/recovery"
              element={
                <ProtectedRoute allowedUserType="OFFICIAL">
                  <DataResilienceCenter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/official/ev-infrastructure"
              element={
                <ProtectedRoute allowedUserType="OFFICIAL">
                  <EVInfrastructure />
                </ProtectedRoute>
              }
            />
            <Route
              path="/official/settings"
              element={
                <ProtectedRoute allowedUserType="OFFICIAL">
                  <OfficialProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/official/trips"
              element={
                <ProtectedRoute allowedUserType="OFFICIAL">
                  <MyTrips />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;

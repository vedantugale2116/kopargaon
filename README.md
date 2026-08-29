# Kopargaon Connect — Smart Mobility & Rural Logistics Platform

A modern, responsive smart mobility and rural logistics platform for **Kopargaon, Maharashtra, India**, connecting citizens, farmers, private transporters, and municipal transport officials.

---

## 🚀 Key Portals & Features

### 1. 🏙️ Citizen Portal
- **Live Mobility & Traffic Map**: Real-time MSRTC bus telemetry, simulated GPS, road traffic congestion overlays, EV fast chargers, and emergency alerts.
- **Satellite View & Map View Toggle**: Seamless switching between standard OpenStreetMap cartography and high-resolution Esri satellite imagery.
- **EV Charging Stations & In-Map Turn-by-Turn Navigation**: Direct road routing to public EV charging hubs with live port availability and tariff telemetry.
- **Bus Schedules & Ticket Booking**: Interactive 4-step passenger ticket booking with live seat availability stepper, simulated payment (UPI, Card, Net Banking), and downloadable e-ticket receipts.
- **My Bookings (`/citizen/bookings`)**: Centralized dashboard to view confirmed tickets and download official travel passes anytime.
- **Dynamic Citizen Traffic Reporting**: Real-time crowd-sourced incident reports with photo uploads that dynamically update road congestion colors across the live map.
- **Safety & Alerts Broadcasts**: Municipal safety warnings and transit advisories.

### 2. 🌾 Farmer & Rural Logistics Portal
- **Send Goods & Rural Cargo**: Request agricultural freight transit via public bus cargo bays or verified private rural transporters.
- **Available Transport Matching**: Discover matching rural trucks, tempos, and scheduled MSRTC cargo bay departures.
- **Live Shipment Tracking**: Milestones and timeline tracking for farm produce shipments.
- **Connect AI Recommendations**: AI-powered route and cargo capacity optimization.

### 3. 🚛 Transporter Portal
- **Publish Trips & Spare Capacity**: Monetize empty return trips between Kopargaon, Shirdi, Sangamner, Nashik, and Pune.
- **Shipment Requests Management**: Accept or decline freight requests from local farmers.
- **Capacity Monitoring**: Live telemetry on allocated vs. available payload space.

### 4. 🏛️ Official Municipal Command Center
- **Operational Overview**: Central transit control dashboard with live telemetry indicators.
- **Fleet Management & Bus Depot Operations**: Track bus statuses (`ACTIVE`, `DELAYED`, `AT DEPOT`, `MAINTENANCE`), platform bays, and driver contacts.
- **Schedule Management**: Publish, edit, and update regional bus routes and timings.
- **Traffic Safety & Alert Management**: Review citizen reports, issue municipal warnings, and clear resolved road incidents.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Google Material Symbols & Fonts (Inter, Roboto)
- **Mapping & Geolocation**: Leaflet, OpenStreetMap, Esri World Imagery, OSRM Routing Machine
- **State Management**: React Context API with persistent localStorage synchronization
- **Routing**: React Router v7

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📄 License
MIT License. Built for the Kopargaon Smart Mobility Initiative.

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useData } from '../../context/DataContext';

// Fix Leaflet default icon paths in bundled environments
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface KopargaonMapProps {
  isOfficial?: boolean;
  selectedBusId?: string;
  onSelectBus?: (busId: string) => void;
  height?: string;
}

interface RouteInfo {
  destinationName: string;
  distanceFormatted: string;
  durationFormatted: string;
  startPointName: string;
}

export const KopargaonMap: React.FC<KopargaonMapProps> = ({
  isOfficial = false,
  selectedBusId,
  onSelectBus,
  height = '600px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const targetStationId = searchParams.get('evStation');
  
  // State for map and layer groups
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [layerGroup, setLayerGroup] = useState<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const { buses, trafficRegions, trafficReports, evStations, safetyAlerts } = useData();

  // Layer filters & view modes
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'BUSES' | 'TRAFFIC' | 'EV' | 'ALERTS'>('ALL');
  const [viewMode, setViewMode] = useState<'MAP' | 'SATELLITE'>('MAP');
  const [selectedItemInfo, setSelectedItemInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [photoModalUrl, setPhotoModalUrl] = useState<string | null>(null);
  const [satelliteWarning, setSatelliteWarning] = useState<string | null>(null);

  // Directions & Routing state
  const [isRouting, setIsRouting] = useState<boolean>(false);
  const [routeData, setRouteData] = useState<RouteInfo | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Exact Traffic Severity Color Logic (Requirement Step 6)
  const getSeverityColor = (count: number) => {
    if (count <= 1) return '#10b981'; // GREEN
    if (count <= 3) return '#eab308'; // YELLOW
    if (count === 4) return '#f97316'; // ORANGE
    return '#ef4444'; // RED (5+)
  };

  const getSeverityLabel = (count: number) => {
    if (count <= 1) return 'GREEN (Normal)';
    if (count <= 3) return 'YELLOW (Moderate)';
    if (count === 4) return 'ORANGE (Heavy)';
    return 'RED (Severe)';
  };

  // Map Initialization
  const initMap = useCallback(() => {
    if (!mapContainerRef.current) return;

    try {
      setIsLoading(true);
      setMapError(null);

      const container = mapContainerRef.current;

      // Clean up previous Leaflet instance if attached
      if ((container as any)._leaflet_id) {
        (container as any)._leaflet_id = null;
      }

      // Initialize Leaflet map centered at Kopargaon, Maharashtra, India
      const map = L.map(container, {
        center: [19.8928, 74.4789],
        zoom: 13,
        minZoom: 10,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: true
      });

      // Standard OpenStreetMap Tile Layer
      const osmTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

      osmTileLayer.addTo(map);
      tileLayerRef.current = osmTileLayer;

      // Add Zoom Control to Bottom Right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Layer Group for dynamic entity markers & overlays
      const lg = L.layerGroup().addTo(map);
      
      // Dedicated Layer Group for Route lines & start markers
      const routeLg = L.layerGroup().addTo(map);
      routeLayerGroupRef.current = routeLg;

      setMapInstance(map);
      setLayerGroup(lg);

      // Invalidate size after layout settles
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
      setTimeout(() => {
        map.invalidateSize();
      }, 500);

      setIsLoading(false);
    } catch (err: any) {
      console.error('[KopargaonMap Error] Could not initialize map:', err);
      setMapError(err.message || 'Map could not be loaded. Please check your connection.');
      setIsLoading(false);
    }
  }, []);

  // Initialize Map on component mount
  useEffect(() => {
    initMap();

    // Auto-resize on window / container resize
    let resizeObserver: ResizeObserver | null = null;
    if (mapContainerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstance) {
          mapInstance.invalidateSize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapInstance) {
        mapInstance.remove();
        setMapInstance(null);
        setLayerGroup(null);
      }
    };
  }, [initMap]);

  // Target EV Station URL Param Listener (Auto-focus, zoom, and open EV popup)
  useEffect(() => {
    if (!mapInstance || !targetStationId || evStations.length === 0) return;

    const targetStation = evStations.find(s => s.id === targetStationId);
    if (targetStation) {
      setActiveFilter('ALL'); // ensure EV layer is enabled
      mapInstance.setView([targetStation.lat, targetStation.lng], 15);
      setSelectedItemInfo({
        type: 'EV',
        title: targetStation.name,
        address: targetStation.address,
        chargerType: targetStation.chargerType,
        availableChargers: targetStation.availableChargers,
        totalChargers: targetStation.totalChargers,
        powerOutputKw: targetStation.powerOutputKw,
        pricing: targetStation.pricingPerKwh,
        operatingHours: targetStation.operatingHours,
        status: targetStation.status,
        lat: targetStation.lat,
        lng: targetStation.lng
      });
    }
  }, [mapInstance, targetStationId, evStations]);

  // Handle Tile Switching between Standard Map & Satellite View
  const handleViewModeChange = (mode: 'MAP' | 'SATELLITE') => {
    if (!mapInstance) return;
    setViewMode(mode);
    setSatelliteWarning(null);

    // Remove existing tile layer
    if (tileLayerRef.current) {
      mapInstance.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    if (mode === 'SATELLITE') {
      // Esri World Imagery Satellite Tiles
      const satTile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      });

      satTile.on('tileerror', () => {
        console.warn('[KopargaonMap] Satellite tile loading error, falling back.');
        setSatelliteWarning('Satellite view is temporarily unavailable.');
      });

      satTile.addTo(mapInstance);
      satTile.bringToBack();
      tileLayerRef.current = satTile;
    } else {
      // Standard OpenStreetMap Tiles
      const osmTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

      osmTile.addTo(mapInstance);
      osmTile.bringToBack();
      tileLayerRef.current = osmTile;
    }
  };

  // Get In-Map Driving Directions to selected EV Station
  const handleGetDirections = (evStation: any) => {
    if (!mapInstance) return;
    setIsRouting(true);
    setRouteError(null);

    const destLat = evStation.lat;
    const destLng = evStation.lng;

    const executeRouting = (startLat: number, startLng: number, startName: string) => {
      // Call OSRM public routing API for actual road driving geometry
      const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${destLng},${destLat}?overview=full&geometries=geojson`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const coordinates = route.geometry.coordinates; // [[lng, lat], ...]
            const latLngs: [number, number][] = coordinates.map((c: [number, number]) => [c[1], c[0]]);

            // Clear previous route
            if (routeLayerGroupRef.current) {
              routeLayerGroupRef.current.clearLayers();

              // Outer glow line
              const glowLine = L.polyline(latLngs, {
                color: '#1d4ed8',
                weight: 9,
                opacity: 0.35,
                lineCap: 'round',
                lineJoin: 'round'
              });

              // Main route road polyline
              const mainLine = L.polyline(latLngs, {
                color: '#2563eb',
                weight: 5,
                opacity: 0.95,
                lineCap: 'round',
                lineJoin: 'round'
              });

              // Start Marker (User GPS or Kopargaon Fallback)
              const startIcon = L.divIcon({
                className: 'custom-start-marker',
                html: `
                  <div style="
                    background-color: #2563eb;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 0 5px rgba(37,99,235,0.3);
                    border: 2px solid white;
                  ">
                    <span class="material-symbols-outlined" style="font-size: 16px;">my_location</span>
                  </div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
              });

              const startMarker = L.marker([startLat, startLng], { icon: startIcon });
              startMarker.bindTooltip(`<strong>Start:</strong> ${startName}`, { sticky: true });

              routeLayerGroupRef.current.addLayer(glowLine);
              routeLayerGroupRef.current.addLayer(mainLine);
              routeLayerGroupRef.current.addLayer(startMarker);

              // Fit map bounds to show whole route cleanly
              mapInstance.fitBounds(mainLine.getBounds(), { padding: [50, 50] });

              // Calculate distance and duration
              const distanceKm = (route.distance / 1000).toFixed(1) + ' km';
              const durationMins = Math.max(1, Math.round(route.duration / 60)) + ' mins';

              setRouteData({
                destinationName: evStation.name || evStation.title,
                distanceFormatted: distanceKm,
                durationFormatted: durationMins,
                startPointName: startName
              });

              // Close the bottom popup so route is clearly visible
              setSelectedItemInfo(null);
            }
          } else {
            throw new Error('Unable to calculate route from driving network.');
          }
          setIsRouting(false);
        })
        .catch(err => {
          console.error('[KopargaonMap Routing Error]', err);
          setRouteError('Unable to calculate road route. Please check your network connection.');
          setIsRouting(false);
        });
    };

    // Request Browser Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          executeRouting(userLat, userLng, 'Your Current Location');
        },
        (error) => {
          console.warn('[KopargaonMap GPS Warning] Location permission denied or unavailable:', error.message);
          // Fallback to Kopargaon Center
          executeRouting(19.8928, 74.4789, 'Kopargaon Center (GPS Unavailable)');
        },
        { timeout: 6000, enableHighAccuracy: true }
      );
    } else {
      executeRouting(19.8928, 74.4789, 'Kopargaon Center (GPS Fallback)');
    }
  };

  // Clear Active Route
  const handleClearRoute = () => {
    if (routeLayerGroupRef.current) {
      routeLayerGroupRef.current.clearLayers();
    }
    setRouteData(null);
    setRouteError(null);
    if (mapInstance) {
      mapInstance.setView([19.8928, 74.4789], 13);
    }
  };

  // Update Layers & Overlays dynamically when mapInstance, data, or filters change
  useEffect(() => {
    if (!mapInstance || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Draw Road Traffic Polylines & Markers with Dynamic Severity
    if (activeFilter === 'ALL' || activeFilter === 'TRAFFIC') {
      trafficRegions.forEach(region => {
        const strokeColor = getSeverityColor(region.reportCount);
        const severityText = getSeverityLabel(region.reportCount);

        // Find latest matching photo report for this region
        const latestReport = trafficReports.find(
          r => r.regionKey === region.id || r.roadName.toLowerCase().includes(region.name.toLowerCase())
        );

        // Draw Polyline for this affected road segment only
        const polyline = L.polyline(region.coordinates, {
          color: strokeColor,
          weight: 6,
          opacity: 0.88,
          lineCap: 'round',
          lineJoin: 'round'
        });

        polyline.bindTooltip(`
          <div style="font-family: Inter, sans-serif; padding: 4px 6px;">
            <div style="font-weight: 700; font-size: 12px; color: #1d1b20;">${region.name}</div>
            <div style="font-size: 11px; color: ${strokeColor}; font-weight: 700;">Severity: ${severityText}</div>
            <div style="font-size: 10px; color: #494551;">Reports: ${region.reportCount} • Avg ${region.avgSpeedKmph} km/h</div>
          </div>
        `, { sticky: true });

        const openTrafficSheet = () => {
          setSelectedItemInfo({
            type: 'TRAFFIC',
            title: region.name,
            trafficStatus: region.currentTraffic,
            reportCount: region.reportCount,
            avgSpeed: region.avgSpeedKmph,
            statusMessage: region.statusMessage,
            strokeColor,
            severityLabel: severityText,
            photoUrl: latestReport?.photoUrl,
            latestReportDescription: latestReport?.description,
            latestReportUser: latestReport?.userName,
            latestReportTime: latestReport?.timestamp,
            locationDescription: latestReport?.locationDescription
          });
        };

        polyline.on('click', openTrafficSheet);
        layerGroup.addLayer(polyline);

        // Circular Traffic Badge Marker at Center of Road Segment
        const trafficBadgeHtml = `
          <div style="
            background-color: ${strokeColor};
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 12px;
            box-shadow: 0 3px 8px rgba(0,0,0,0.35);
            border: 2px solid white;
            cursor: pointer;
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
            ${region.reportCount}
          </div>
        `;

        const trafficIcon = L.divIcon({
          className: 'custom-traffic-badge',
          html: trafficBadgeHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker(region.center, { icon: trafficIcon });
        marker.bindTooltip(`
          <div style="font-family: Inter, sans-serif; padding: 2px 4px;">
            <strong>${region.name}</strong><br/>
            <span style="color:${strokeColor}; font-weight:bold;">${region.reportCount} Reports (${region.currentTraffic})</span>
          </div>
        `, { sticky: true });

        marker.on('click', openTrafficSheet);
        layerGroup.addLayer(marker);
      });
    }

    // 2. Draw Live Public Buses with Passenger & Cargo Space Telemetry
    if (activeFilter === 'ALL' || activeFilter === 'BUSES') {
      buses.forEach(bus => {
        const isSelected = bus.id === selectedBusId;
        const busColor = bus.status === 'DELAYED' ? '#ef4444' : isOfficial ? '#765b00' : '#4f378a';

        const busIcon = L.divIcon({
          className: 'custom-bus-marker',
          html: `
            <div style="
              background-color: ${busColor};
              color: white;
              padding: 4px 8px;
              border-radius: 9999px;
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 11px;
              font-weight: 700;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              border: 2px solid ${isSelected ? '#FFD814' : 'white'};
              transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
              cursor: pointer;
              white-space: nowrap;
            ">
              <span class="material-symbols-outlined" style="font-size: 14px; line-height: 1;">directions_bus</span>
              <span>${bus.busNumber.split('-').slice(2).join('-')}</span>
            </div>
          `,
          iconSize: [84, 28],
          iconAnchor: [42, 14]
        });

        const marker = L.marker([bus.lat, bus.lng], { icon: busIcon });
        marker.bindTooltip(`
          <div style="font-family: Inter, sans-serif; padding: 4px;">
            <div style="font-weight: 800; color: #4f378a;">${bus.busNumber}</div>
            <div style="font-size: 11px;">${bus.currentStop} → ${bus.destination}</div>
            <div style="font-size: 10px; color: #10b981; font-weight: 700;">Available Cargo: ${bus.availableCargoKg} kg / ${bus.totalCargoKg} kg</div>
          </div>
        `, { sticky: true });

        marker.on('click', () => {
          if (onSelectBus) onSelectBus(bus.id);
          setSelectedItemInfo({
            type: 'BUS',
            title: bus.busNumber,
            driver: bus.driverName,
            contact: bus.contactNumber,
            currentStop: bus.currentStop,
            destination: bus.destination,
            speed: bus.speed,
            status: bus.status,
            delayMins: bus.delayMins,
            passengerOccupied: bus.passengerOccupied,
            passengerCapacity: bus.passengerCapacity,
            availableCargoKg: bus.availableCargoKg,
            totalCargoKg: bus.totalCargoKg,
            usedCargoKg: bus.usedCargoKg,
            nextDeparture: bus.nextDeparture
          });
        });

        layerGroup.addLayer(marker);
      });
    }

    // 3. Draw Bus Depot Marker
    if (activeFilter === 'ALL' || activeFilter === 'BUSES') {
      const depotIcon = L.divIcon({
        className: 'custom-depot-marker',
        html: `
          <div style="
            background: #22005d;
            color: #FFD814;
            padding: 5px 9px;
            border-radius: 8px;
            font-weight: 800;
            font-size: 11px;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 4px 12px rgba(34,0,93,0.4);
            border: 2px solid white;
            cursor: pointer;
          ">
            <span class="material-symbols-outlined" style="font-size: 16px;">warehouse</span>
            <span>KOPARGAON CENTRAL DEPOT</span>
          </div>
        `,
        iconSize: [190, 30],
        iconAnchor: [95, 15]
      });

      const depotMarker = L.marker([19.8928, 74.4789], { icon: depotIcon });
      depotMarker.on('click', () => {
        setSelectedItemInfo({
          type: 'DEPOT',
          title: 'Kopargaon Central MSRTC Depot',
          busesAtDepot: buses.filter(b => b.status === 'AT DEPOT').length,
          totalBays: 8,
          activeMaintenance: buses.filter(b => b.status === 'MAINTENANCE').length,
          dailyDepartures: 34
        });
      });
      layerGroup.addLayer(depotMarker);
    }

    // 4. Draw EV Charging Stations with directions metadata
    if (activeFilter === 'ALL' || activeFilter === 'EV') {
      evStations.forEach(ev => {
        const evIcon = L.divIcon({
          className: 'custom-ev-marker',
          html: `
            <div style="
              background-color: #059669;
              color: white;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              border: 2px solid white;
              cursor: pointer;
            ">
              <span class="material-symbols-outlined" style="font-size: 18px;">ev_station</span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([ev.lat, ev.lng], { icon: evIcon });
        marker.bindTooltip(`
          <div style="font-family: Inter, sans-serif; padding: 2px;">
            <div style="font-weight: 700; color: #059669;">${ev.name}</div>
            <div style="font-size: 11px;">Ports: ${ev.availableChargers} / ${ev.totalChargers} Available (${ev.chargerType})</div>
          </div>
        `, { sticky: true });

        marker.on('click', () => {
          setSelectedItemInfo({
            type: 'EV',
            title: ev.name,
            address: ev.address,
            chargerType: ev.chargerType,
            availableChargers: ev.availableChargers,
            totalChargers: ev.totalChargers,
            powerOutputKw: ev.powerOutputKw,
            pricing: ev.pricingPerKwh,
            operatingHours: ev.operatingHours,
            status: ev.status,
            lat: ev.lat,
            lng: ev.lng
          });
        });

        layerGroup.addLayer(marker);
      });
    }

    // 5. Draw Safety Alerts
    if (activeFilter === 'ALL' || activeFilter === 'ALERTS') {
      safetyAlerts.filter(a => a.active).forEach((alert, idx) => {
        const coords: [number, number] = idx === 0 ? [19.8940, 74.4720] : [19.9520, 74.4890];
        const alertIcon = L.divIcon({
          className: 'custom-alert-marker',
          html: `
            <div style="
              background-color: #dc2626;
              color: white;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 0 5px rgba(220,38,38,0.3);
              border: 2px solid white;
              cursor: pointer;
            ">
              <span class="material-symbols-outlined" style="font-size: 18px;">warning</span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker(coords, { icon: alertIcon });
        marker.bindTooltip(`
          <div style="font-family: Inter, sans-serif;">
            <div style="font-weight: 700; color: #dc2626;">⚠️ ${alert.title}</div>
            <div style="font-size: 10px; color: #494551;">${alert.location}</div>
          </div>
        `, { sticky: true });

        marker.on('click', () => {
          setSelectedItemInfo({
            type: 'ALERT',
            title: alert.title,
            category: alert.category,
            severity: alert.severity,
            location: alert.location,
            description: alert.description,
            issuedBy: alert.issuedBy,
            timestamp: alert.timestamp
          });
        });

        layerGroup.addLayer(marker);
      });
    }

  }, [mapInstance, layerGroup, buses, trafficRegions, trafficReports, evStations, safetyAlerts, activeFilter, selectedBusId, isOfficial, onSelectBus]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-md border border-[#cbc4d2]/40 bg-[#f4f3f0] min-h-[450px] sm:min-h-[600px]" style={{ height }}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[500] bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-[#4f378a] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-[#1d1b20]">Loading Kopargaon Live Map...</span>
        </div>
      )}

      {/* Error / Fallback State */}
      {mapError && (
        <div className="absolute inset-0 z-[500] bg-white flex flex-col items-center justify-center p-6 text-center space-y-3">
          <span className="material-symbols-outlined text-4xl text-red-600">map_error</span>
          <div className="font-extrabold text-base text-[#1d1b20]">Map could not be loaded. Please check your connection.</div>
          <p className="text-xs text-gray-500 max-w-sm">
            {mapError}
          </p>
          <button
            onClick={initMap}
            className="px-4 py-2 bg-[#4f378a] hover:bg-[#382467] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Retry
          </button>
        </div>
      )}

      {/* Satellite Warning Banner if satellite fails */}
      {satelliteWarning && (
        <div className="absolute top-16 left-3 z-[410] bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 animate-in fade-in">
          <span className="material-symbols-outlined text-[16px]">info</span>
          <span>{satelliteWarning}</span>
        </div>
      )}

      {/* Route Error Banner */}
      {routeError && (
        <div className="absolute top-16 left-3 z-[410] bg-red-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[16px]">warning</span>
          <span>{routeError}</span>
          <button onClick={() => setRouteError(null)} className="ml-2 text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* Top Left: Filter Toolbar */}
      <div className="absolute top-3 left-3 z-[400] max-w-[calc(100%-190px)] sm:max-w-none overflow-x-auto no-scrollbar flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-md border border-[#cbc4d2]/40">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
            activeFilter === 'ALL'
              ? 'bg-[#4f378a] text-white shadow-xs'
              : 'text-[#494551] hover:bg-[#f2ecf4]'
          }`}
        >
          All Layers
        </button>
        <button
          onClick={() => setActiveFilter('BUSES')}
          className={`px-2.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 transition-all shrink-0 ${
            activeFilter === 'BUSES'
              ? 'bg-[#4f378a] text-white shadow-xs'
              : 'text-[#494551] hover:bg-[#f2ecf4]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">directions_bus</span>
          Live Buses ({buses.length})
        </button>
        <button
          onClick={() => setActiveFilter('TRAFFIC')}
          className={`px-2.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 transition-all shrink-0 ${
            activeFilter === 'TRAFFIC'
              ? 'bg-[#4f378a] text-white shadow-xs'
              : 'text-[#494551] hover:bg-[#f2ecf4]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">traffic</span>
          Traffic ({trafficRegions.length})
        </button>
        <button
          onClick={() => setActiveFilter('EV')}
          className={`px-2.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 transition-all shrink-0 ${
            activeFilter === 'EV'
              ? 'bg-[#059669] text-white shadow-xs'
              : 'text-[#494551] hover:bg-[#f2ecf4]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">ev_station</span>
          EV Hubs ({evStations.length})
        </button>
        <button
          onClick={() => setActiveFilter('ALERTS')}
          className={`px-2.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 transition-all shrink-0 ${
            activeFilter === 'ALERTS'
              ? 'bg-[#dc2626] text-white shadow-xs'
              : 'text-[#494551] hover:bg-[#f2ecf4]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">warning</span>
          Alerts
        </button>
      </div>

      {/* Top Right: View Switcher (Map / Satellite) & Recenter Button */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-2">
        {/* Layer View Switcher: [ Map ] [ Satellite ] */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-[#cbc4d2]/40 flex items-center gap-1">
          <button
            onClick={() => handleViewModeChange('MAP')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              viewMode === 'MAP'
                ? 'bg-[#4f378a] text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Standard Map View"
          >
            <span className="material-symbols-outlined text-[15px]">map</span>
            <span className="hidden sm:inline">Map</span>
          </button>
          <button
            onClick={() => handleViewModeChange('SATELLITE')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              viewMode === 'SATELLITE'
                ? 'bg-[#4f378a] text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Satellite Imagery View"
          >
            <span className="material-symbols-outlined text-[15px]">satellite_alt</span>
            <span className="hidden sm:inline">Satellite</span>
          </button>
        </div>

        {/* Recenter button */}
        <button
          onClick={() => {
            if (mapInstance) {
              mapInstance.setView([19.8928, 74.4789], 13);
            }
          }}
          className="bg-white/95 backdrop-blur-md p-2 rounded-xl text-[#4f378a] hover:bg-white shadow-md border border-[#cbc4d2]/40 flex items-center gap-1 text-xs font-bold transition-transform active:scale-95"
          title="Recenter Map on Kopargaon"
        >
          <span className="material-symbols-outlined text-[18px]">my_location</span>
          <span className="hidden sm:inline">Center</span>
        </button>
      </div>

      {/* Route Information Floating Panel */}
      {routeData && (
        <div className="absolute top-16 left-3 sm:left-4 z-[420] bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#cbc4d2]/60 p-4 max-w-xs sm:max-w-sm w-full animate-in fade-in slide-in-from-top-2 space-y-2.5">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#2563eb] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[16px]">navigation</span>
              </span>
              <div>
                <h4 className="font-extrabold text-xs text-[#1d1b20] leading-tight">{routeData.destinationName}</h4>
                <span className="text-[10px] text-gray-500 font-semibold">Route to EV Charging Station</span>
              </div>
            </div>
            <button
              onClick={handleClearRoute}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              title="Clear Route"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-[#f8f2fa] p-2.5 rounded-xl border border-gray-100 text-xs">
            <div>
              <span className="text-[10px] text-gray-400 font-bold block uppercase">Distance</span>
              <strong className="text-sm font-black text-[#1d1b20]">{routeData.distanceFormatted}</strong>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold block uppercase">Est. Travel Time</span>
              <strong className="text-sm font-black text-[#2563eb]">{routeData.durationFormatted}</strong>
            </div>
          </div>

          <div className="text-[11px] text-gray-600 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-emerald-600">trip_origin</span>
            <span>From: <strong>{routeData.startPointName}</strong></span>
          </div>

          <button
            onClick={handleClearRoute}
            className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">clear</span>
            Clear Route
          </button>
        </div>
      )}

      {/* Traffic Map Legend (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-md border border-[#cbc4d2]/40 text-xs flex flex-col gap-1 max-w-[280px] sm:max-w-none">
        <div className="font-extrabold text-[10px] text-[#1d1b20] uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-[#4f378a]">traffic</span>
            Traffic Severity Legend
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-semibold text-[#1d1b20]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
            0–1 Normal
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]"></span>
            2–3 Moderate
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></span>
            4 Heavy
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span>
            5+ Severe
          </span>
        </div>
      </div>

      {/* Selected Item Modal / Bottom Sheet */}
      {selectedItemInfo && (
        <div className="absolute bottom-16 sm:bottom-4 right-3 max-w-[92vw] sm:max-w-sm w-full z-[450] bg-white rounded-2xl shadow-2xl border border-[#cbc4d2]/60 p-4 max-h-[75vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-2">
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 ${
                selectedItemInfo.type === 'BUS' ? 'bg-[#4f378a]' :
                selectedItemInfo.type === 'TRAFFIC' ? 'bg-[#f97316]' :
                selectedItemInfo.type === 'EV' ? 'bg-[#059669]' :
                selectedItemInfo.type === 'DEPOT' ? 'bg-[#22005d]' : 'bg-[#dc2626]'
              }`}>
                <span className="material-symbols-outlined text-[18px]">
                  {selectedItemInfo.type === 'BUS' ? 'directions_bus' :
                   selectedItemInfo.type === 'TRAFFIC' ? 'traffic' :
                   selectedItemInfo.type === 'EV' ? 'ev_station' :
                   selectedItemInfo.type === 'DEPOT' ? 'warehouse' : 'warning'}
                </span>
              </span>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-[#1d1b20]">{selectedItemInfo.title}</h4>
                <span className="text-[10px] font-bold text-[#494551] uppercase tracking-wider">{selectedItemInfo.type} DETAILS</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedItemInfo(null)}
              className="text-[#7a7582] hover:text-[#1d1b20] p-1 rounded-full hover:bg-gray-100"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* 1. Bus Popup Details */}
          {selectedItemInfo.type === 'BUS' && (
            <div className="space-y-2 text-xs text-[#494551] mt-2">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Driver & Phone:</span>
                <span className="font-bold text-[#1d1b20]">{selectedItemInfo.driver} ({selectedItemInfo.contact})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Route:</span>
                <span className="font-bold text-[#1d1b20]">{selectedItemInfo.currentStop} → {selectedItemInfo.destination}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Passenger Load:</span>
                <span className="font-bold text-[#1d1b20]">{selectedItemInfo.passengerOccupied} / {selectedItemInfo.passengerCapacity} seats</span>
              </div>
              <div className="p-2.5 bg-[#f8f2fa] rounded-xl border border-[#e1d4fd] space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#4f378a]">Bus Cargo Bay Space:</span>
                  <span className="text-[#4f378a]">{selectedItemInfo.availableCargoKg} kg Available</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4f378a] rounded-full"
                    style={{ width: `${(selectedItemInfo.usedCargoKg / selectedItemInfo.totalCargoKg) * 100}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-gray-500">Total capacity: {selectedItemInfo.totalCargoKg} kg</div>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase">DEMO LOCATION (SIMULATED GPS)</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  selectedItemInfo.status === 'DELAYED' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {selectedItemInfo.status} {selectedItemInfo.delayMins > 0 ? `(+${selectedItemInfo.delayMins}m)` : ''}
                </span>
              </div>
            </div>
          )}

          {/* 2. Traffic Report Popup Details with Photo */}
          {selectedItemInfo.type === 'TRAFFIC' && (
            <div className="space-y-2.5 text-xs text-[#494551] mt-2">
              {/* Photo Thumbnail if available */}
              {selectedItemInfo.photoUrl && (
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-xs relative group cursor-pointer" onClick={() => setPhotoModalUrl(selectedItemInfo.photoUrl)}>
                  <img
                    src={selectedItemInfo.photoUrl}
                    alt="Citizen Traffic Incident"
                    className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs">
                    <span className="material-symbols-outlined text-[12px]">zoom_in</span>
                    Tap to Expand Photo
                  </div>
                </div>
              )}

              <p className="text-gray-800 font-medium leading-relaxed bg-[#fdf7ff] p-2.5 rounded-xl border border-gray-100">
                "{selectedItemInfo.latestReportDescription || selectedItemInfo.statusMessage}"
              </p>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between py-0.5 border-b border-gray-100">
                  <span className="text-gray-500">Verified Citizen Reports:</span>
                  <span className="font-extrabold text-[#1d1b20]">{selectedItemInfo.reportCount} Reports</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-gray-100">
                  <span className="text-gray-500">Average Transit Speed:</span>
                  <span className="font-bold text-[#1d1b20]">{selectedItemInfo.avgSpeed} km/h</span>
                </div>
                {selectedItemInfo.latestReportTime && (
                  <div className="flex justify-between py-0.5 border-b border-gray-100">
                    <span className="text-gray-500">Latest Incident Time:</span>
                    <span className="font-bold text-[#1d1b20]">{selectedItemInfo.latestReportTime}</span>
                  </div>
                )}
                {selectedItemInfo.latestReportUser && (
                  <div className="flex justify-between py-0.5 border-b border-gray-100">
                    <span className="text-gray-500">Reported By:</span>
                    <span className="font-bold text-[#1d1b20]">{selectedItemInfo.latestReportUser}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="font-bold text-gray-700">Dynamic Severity:</span>
                <span className="px-2.5 py-0.5 rounded-full font-extrabold text-[10px] text-white" style={{ backgroundColor: selectedItemInfo.strokeColor }}>
                  {selectedItemInfo.trafficStatus} ({selectedItemInfo.reportCount} reports)
                </span>
              </div>
            </div>
          )}

          {/* 3. EV Station Popup Details + Get Directions Button */}
          {selectedItemInfo.type === 'EV' && (
            <div className="space-y-2 text-xs text-[#494551] mt-2">
              <p className="text-gray-600">{selectedItemInfo.address}</p>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Charger Type:</span>
                <span className="font-bold text-[#1d1b20]">{selectedItemInfo.chargerType} ({selectedItemInfo.powerOutputKw} kW)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Available Ports:</span>
                <span className="font-bold text-[#059669]">{selectedItemInfo.availableChargers} of {selectedItemInfo.totalChargers} Available</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Electricity Tariff:</span>
                <span className="font-bold text-[#1d1b20]">{selectedItemInfo.pricing}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Operating Hours:</span>
                <span className="font-bold text-[#1d1b20]">{selectedItemInfo.operatingHours}</span>
              </div>

              {/* Get Directions Button */}
              <button
                onClick={() => handleGetDirections(selectedItemInfo)}
                disabled={isRouting}
                className="w-full mt-2 py-2.5 bg-[#4f378a] hover:bg-[#382467] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isRouting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Calculating Road Route...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">directions</span>
                    <span>GET DIRECTIONS</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* 4. Depot Popup Details */}
          {selectedItemInfo.type === 'DEPOT' && (
            <div className="space-y-2 text-xs text-[#494551] mt-2">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Buses currently at Depot:</span>
                <span className="font-bold text-[#1d1b20]">{selectedItemInfo.busesAtDepot} Buses</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Platforms / Bays:</span>
                <span className="font-bold text-[#1d1b20]">{selectedItemInfo.totalBays} Bays Online</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Workshop Maintenance:</span>
                <span className="font-bold text-amber-700">{selectedItemInfo.activeMaintenance} Bay in Service</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Daily Scheduled Departures:</span>
                <span className="font-bold text-[#4f378a]">{selectedItemInfo.dailyDepartures} Daily Trips</span>
              </div>
            </div>
          )}

          {/* 5. Safety Alert Popup Details */}
          {selectedItemInfo.type === 'ALERT' && (
            <div className="space-y-2 text-xs text-[#494551] mt-2">
              <p className="text-gray-800 leading-relaxed bg-red-50 p-2.5 rounded-xl border border-red-200">
                {selectedItemInfo.description}
              </p>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Location:</span>
                <span className="font-bold text-[#1d1b20]">{selectedItemInfo.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Issued By:</span>
                <span className="font-bold text-[#1d1b20]">{selectedItemInfo.issuedBy}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Broadcast Time:</span>
                <span className="font-bold text-[#1d1b20]">{selectedItemInfo.timestamp}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Photo Expansion Modal */}
      {photoModalUrl && (
        <div className="fixed inset-0 z-[600] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPhotoModalUrl(null)}>
          <div className="bg-white rounded-2xl overflow-hidden max-w-xl w-full shadow-2xl p-2 relative animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPhotoModalUrl(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-1.5 rounded-full z-10 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <img src={photoModalUrl} alt="Expanded Traffic Photo" className="w-full h-auto rounded-xl object-contain max-h-[70vh]" />
            <div className="p-3 text-xs text-gray-700 font-semibold text-center">
              Citizen Verified Road Condition Incident Photo
            </div>
          </div>
        </div>
      )}

      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[450px] sm:min-h-[600px]" />
    </div>
  );
};

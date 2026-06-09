/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { Navigation, MapPin } from "lucide-react";

interface SimulatedMapProps {
  pickupName: string;
  destinationName: string;
  rideProgress: number; // 0 to 100
  driverAssigned: boolean;
  driverStatus?: "idle" | "heading_to_pickup" | "arrived" | "ongoing" | "completed";
  vehicleEmoji?: string;
  activePresetIndex?: number;
}

export default function SimulatedMap({
  pickupName,
  destinationName,
  rideProgress,
  driverAssigned,
  driverStatus = "idle",
  vehicleEmoji = "🚕",
  activePresetIndex = 0,
}: SimulatedMapProps) {
  
  // Custom generated roads system
  const roads = useMemo(() => [
    // Outer Ring Highway
    { d: "M 10 90 Q 50 15 90 90 T 190 90 T 350 160", color: "rgba(255, 255, 255, 0.05)", width: 6 },
    // Cyber City Grid
    { d: "M 20 20 L 370 20", color: "rgba(255, 255, 255, 0.04)", width: 4 },
    { d: "M 50 10 L 50 380", color: "rgba(255, 255, 255, 0.04)", width: 3 },
    { d: "M 120 10 L 120 380", color: "rgba(255, 255, 255, 0.04)", width: 3 },
    { d: "M 220 10 L 220 380", color: "rgba(255, 255, 255, 0.04)", width: 3 },
    { d: "M 320 10 L 320 380", color: "rgba(255, 255, 255, 0.04)", width: 3 },
    { d: "M 10 120 L 370 120", color: "rgba(255, 255, 255, 0.04)", width: 3 },
    { d: "M 10 240 L 370 240", color: "rgba(255, 255, 255, 0.04)", width: 3 },
    { d: "M 10 320 L 370 320", color: "rgba(255, 255, 255, 0.04)", width: 4 },
  ], []);

  // Preset routing SVG paths
  const routePaths = useMemo(() => [
    // Preset 1: South Ext -> Cybercity
    {
      path: "M 120 240 Q 180 180 220 120 T 320 120",
      pickup: { x: 120, y: 240 },
      dest: { x: 320, y: 120 },
    },
    // Preset 2: Saket -> Connaught Place
    {
      path: "M 120 320 C 150 200 180 150 220 120",
      pickup: { x: 120, y: 320 },
      dest: { x: 220, y: 120 },
    },
    // Preset 3: Sector 62 Noida -> Airport
    {
      path: "M 320 240 C 260 200 180 100 50 120",
      pickup: { x: 320, y: 240 },
      dest: { x: 50, y: 120 },
    },
  ], []);

  // Currently selected active path structure
  const activeRoute = routePaths[activePresetIndex % routePaths.length];

  // Logic to compute active driver vehicle coordinates along the SVG path
  // We can approximate interpolation on the spline for interactive satisfaction
  const driverPosition = useMemo(() => {
    const progressFraction = rideProgress / 100;
    
    // Simple segmented linear interpolation between start points, control points, and end points
    const pStart = activeRoute.pickup;
    const pEnd = activeRoute.dest;

    // Based on driverStatus, determine driver position constraints
    if (!driverAssigned) {
      // Driver wanders around pickup point
      return {
        x: pStart.x + Math.sin(Date.now() / 600) * 22,
        y: pStart.y + Math.cos(Date.now() / 600) * 22,
        angle: 45,
      };
    }

    if (driverStatus === "heading_to_pickup") {
      // Driver is starting further away and driving to pickup
      const fraction = progressFraction; // moves from map outskirts to pickup
      const startX = pStart.x - 70;
      const startY = pStart.y + 60;
      const x = startX + (pStart.x - startX) * fraction;
      const y = startY + (pStart.y - startY) * fraction;
      const angle = Math.atan2(pStart.y - startY, pStart.x - startX) * (180 / Math.PI);
      return { x, y, angle };
    }

    if (driverStatus === "arrived") {
      // Driver at pickup spot
      return { x: pStart.x + 2, y: pStart.y - 2, angle: 90 };
    }

    if (driverStatus === "ongoing") {
      // Ride ongoing - moving from pickup to destination along the grid spline
      const x = pStart.x + (pEnd.x - pStart.x) * progressFraction;
      const y = pStart.y + (pEnd.y - pStart.y) * progressFraction;
      const angle = Math.atan2(pEnd.y - pStart.y, pEnd.x - pStart.x) * (180 / Math.PI);
      return { x, y, angle };
    }

    // Driver completed or idle
    return { x: pEnd.x, y: pEnd.y, angle: 0 };
  }, [activeRoute, driverAssigned, driverStatus, rideProgress]);

  return (
    <div className="relative w-full h-full bg-[#1A1A1A] overflow-hidden rounded-[24px]">
      
      {/* Decorative dark-grid radial blur mask */}
      <div className="absolute inset-x-0 bottom-0 top-[40%] bg-gradient-to-t from-[#121212] via-transparent to-transparent z-[2] pointer-events-none" />

      {/* SVG Canvas Map Drawing */}
      <svg className="w-full h-full select-none" viewBox="0 0 380 400" id="svg-map">
        {/* River Waterways */}
        <path
          d="M -10 150 Q 80 180 140 280 T 390 320"
          fill="none"
          stroke="#1F323D"
          strokeWidth="32"
          opacity="0.55"
        />

        {/* Airport Runway indicator */}
        <rect x="15" y="80" width="8" height="60" fill="#252525" transform="rotate(45, 15, 80)" />
        <rect x="23" y="78" width="8" height="60" fill="#252525" transform="rotate(45, 23, 78)" />

        {/* Gray Grid Road Networks */}
        {roads.map((road, index) => (
          <path
            key={`road-${index}`}
            d={road.d}
            fill="none"
            stroke={road.color}
            strokeWidth={road.width}
            strokeLinecap="round"
          />
        ))}

        {/* Neon Gold ACTIVE BOOKING HIGHWAY PATH (Only shown when destination picked) */}
        {pickupName !== "" && destinationName !== "" && (
          <>
            {/* Outer golden glow sleeve */}
            <path
              d={activeRoute.path}
              fill="none"
              stroke="#FFC107"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.3"
              className="motion-safe:animate-pulse"
            />
            {/* Core sleek bright path */}
            <path
              d={activeRoute.path}
              fill="none"
              stroke="#FFC107"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={driverStatus === "ongoing" ? "5, 5" : "none"}
            />
          </>
        )}

        {/* Pulsing visual locator glow rings at pickup (Always active) */}
        <circle cx={activeRoute.pickup.x} cy={activeRoute.pickup.y} r="16" fill="rgba(255, 193, 7, 0.15)" className="map-pulsing-circle" />
        <circle cx={activeRoute.pickup.x} cy={activeRoute.pickup.y} r="6" fill="#FFC107" opacity="0.3" />
        <circle cx={activeRoute.pickup.x} cy={activeRoute.pickup.y} r="3" fill="#FFC107" />

        {/* Destination Target Marker Ring */}
        {destinationName !== "" && (
          <>
            <circle cx={activeRoute.dest.x} cy={activeRoute.dest.y} r="18" fill="rgba(255,255,255,0.08)" />
            <circle cx={activeRoute.dest.x} cy={activeRoute.dest.y} r="5" fill="#FFFFFF" />
          </>
        )}
      </svg>

      {/* Floating HTML HighContrast Map Markers overlay */}
      <div className="absolute inset-0 pointer-events-none select-none z-10 font-sans">
        
        {/* Landmark labels */}
        <div className="absolute top-[35px] left-[35px] bg-[#111111]/90 border border-neutral-800 text-[8px] tracking-wide text-neutral-400 px-1.5 py-0.5 rounded uppercase">
          🛫 IGI Airport T3 Zone
        </div>
        <div className="absolute top-[180px] right-[20px] bg-[#111111]/90 border border-neutral-800 text-[8px] tracking-wide text-neutral-400 px-1.5 py-0.5 rounded uppercase">
          💻 Cyber City Hub
        </div>
        <div className="absolute bottom-[40px] left-[45px] bg-[#111111]/90 border border-neutral-850 text-[8px] tracking-wide text-neutral-500 px-1.5 py-0.5 rounded uppercase font-mono">
          O2 Central Base Delhi
        </div>

        {/* Pickup Pin overlay */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300"
          style={{
            left: `${(activeRoute.pickup.x / 380) * 100}%`,
            top: `${(activeRoute.pickup.y / 400) * 100}%`,
          }}
        >
          <div className="bg-[#FFC107] text-[#111111] text-[9px] font-bold px-2 py-0.5 rounded-md shadow-lg flex items-center gap-1 border border-black/10">
            <MapPin className="w-2.5 h-2.5" />
            <span>Pickup: {pickupName ? pickupName.split(",")[0] : "Set location"}</span>
          </div>
          <div className="w-1.5 h-1.5 bg-[#FFC107] mx-auto transform rotate-45 -mt-1" />
        </div>

        {/* Destination Pin overlay */}
        {destinationName !== "" && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300"
            style={{
              left: `${(activeRoute.dest.x / 380) * 100}%`,
              top: `${(activeRoute.dest.y / 400) * 100}%`,
            }}
          >
            <div className="bg-black text-white border-2 border-[#FFC107] text-[9px] font-bold px-2 py-0.5 rounded-md shadow-lg flex items-center gap-1">
              <Navigation className="w-2.5 h-2.5 text-[#FFC107]" />
              <span>Drop: {destinationName.split(",")[0]}</span>
            </div>
            <div className="w-1.5 h-1.5 bg-[#FFC107] mx-auto transform rotate-45 -mt-1" />
          </div>
        )}

        {/* Live Animated Driver Car overlay */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 flex flex-col items-center"
          style={{
            left: `${(driverPosition.x / 380) * 100}%`,
            top: `${(driverPosition.y / 400) * 100}%`,
          }}
        >
          {/* Label indicating Driver progress status */}
          {driverAssigned && (
            <div className="bg-black/95 text-white border border-[#FFC107]/50 text-[7px] px-1 py-0.5 rounded mb-1 tracking-wider whitespace-nowrap scale-90">
              {driverStatus === "heading_to_pickup" && "🚕 1.2 Km away"}
              {driverStatus === "arrived" && "🤝 Driver Waiting"}
              {driverStatus === "ongoing" && `⚡ Speed 45 km/h`}
              {driverStatus === "completed" && "🏁 Destination Reached"}
            </div>
          )}

          {/* Car Icon with Directional Pointer Indicator */}
          <div
            className="w-8 h-8 rounded-full bg-[#FFC107] shadow-[0_4px_12px_rgba(255,193,7,0.5)] flex items-center justify-center border-2 border-black transition-transform duration-300"
            style={{ transform: `rotate(${driverPosition.angle - 90}deg)` }}
          >
            <span className="text-sm scale-110 -mt-0.5">{vehicleEmoji}</span>
          </div>
          
          {/* Signal Ping */}
          <span className="absolute -bottom-1 w-2 h-2 rounded-full bg-[#FFC107] animate-ping" />
        </div>
      </div>
    </div>
  );
}

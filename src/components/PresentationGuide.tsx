/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ScreenId, OfferCoupon } from "../types";
import { ACTIVE_OFFERS } from "../data";
import {
  Smartphone,
  CheckCircle2,
  MapPin,
  ShieldAlert,
  Tag,
  Wallet,
  User,
  Flame,
  Award,
  Play,
  Zap,
  Code,
  BellRing,
  HelpCircle
} from "lucide-react";

interface PresentationGuideProps {
  currentScreen: ScreenId;
  onScreenChange: (screen: ScreenId) => void;
  walletBalance: number;
  onAddWallet: (amount: number) => void;
  onApplyCoupon: (coupon: OfferCoupon) => void;
  appliedCoupon: OfferCoupon | null;
  onToggleSos: () => void;
  sosActive: boolean;
  onSimulateFullRide: () => void;
  simulatedRideActive: boolean;
  onResetAll: () => void;
  lastNotification: string | null;
}

export default function PresentationGuide({
  currentScreen,
  onScreenChange,
  walletBalance,
  onAddWallet,
  onApplyCoupon,
  appliedCoupon,
  onToggleSos,
  sosActive,
  onSimulateFullRide,
  simulatedRideActive,
  onResetAll,
  lastNotification,
}: PresentationGuideProps) {
  
  // Array of 20 screens in logical sequence with numbers and descriptions
  const screensList = [
    { id: ScreenId.SPLASH, label: "1. Splash Screen", desc: "Logo, Tagline, Entrance animation" },
    { id: ScreenId.LOGIN, label: "2. Mobile Number Login", desc: "Country prefix, clean numeric keypad" },
    { id: ScreenId.OTP, label: "3. OTP Verification", desc: "4-digit auto-focus pins, custom countdown" },
    { id: ScreenId.HOME, label: "4. Home Map Screen", desc: "Current location cursor, quick search" },
    { id: ScreenId.PICK_SPOT, label: "5. Pickup & Destination", desc: "Two-point fields, saved locations list" },
    { id: ScreenId.VEHICLE_SELECT, label: "6. Vehicle Selection", desc: "Mini, Prime Sedan, SUV, Auto comparison" },
    { id: ScreenId.FARE_ESTIMATE, label: "7. Fare Estimation", desc: "Coupon applying, discount breakdowns" },
    { id: ScreenId.SEARCH_DRIVER, label: "8. Searching Driver", desc: "Radar ripple, looking for matching cars" },
    { id: ScreenId.DRIVER_ASSIGNED, label: "9. Driver Assigned", desc: "Driver photo, rating, vehicle card, call/chat" },
    { id: ScreenId.LIVE_TRACKING, label: "10. Live Ride Tracking", desc: "Driver heading to your current spot" },
    { id: ScreenId.RIDE_IN_PROGRESS, label: "11. Ride In Progress", desc: "Real-time trip distance, billing tracking" },
    { id: ScreenId.PAYMENT, label: "12. Payment Screen", desc: "UPI, Wallet checkout, credit gateway" },
    { id: ScreenId.COMPLETED, label: "13. Ride Completed", desc: "Total fare receipt, destination signature" },
    { id: ScreenId.RATING_REVIEW, label: "14. Rating & Review", desc: "Interactive yellow rating stars, feedback comments" },
    { id: ScreenId.RIDE_HISTORY, label: "15. Ride History", desc: "Previous trips log, receipts & status" },
    { id: ScreenId.WALLET, label: "16. Wallet Dashboard", desc: "Balance loader & automated transaction ledger" },
    { id: ScreenId.PROFILE, label: "17. Profile settings", desc: "Active member status, statistics, details" },
    { id: ScreenId.SAVED_LOCATIONS, label: "18. Saved Locations", desc: "Home, Office, Gym, Custom pins management" },
    { id: ScreenId.OFFERS_COUPONS, label: "19. Offers & Coupons", desc: "Discount scratchcards, promo application" },
    { id: ScreenId.SOS_ALERT, label: "20. SOS Emergency", desc: "Red flashing trigger, countdown alarm" },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Brand Header & Badge */}
      <div className="bg-[#111111] p-6 rounded-[24px] border border-neutral-900 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 rounded-full bg-[#FFC107]/5 blur-xl" />
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-[#FFC107] text-[#111111] text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
            PREMIUM APP PREVIEW
          </span>
          <span className="text-xs text-neutral-500 font-mono">v1.1 Stable</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          O2 <span className="text-[#FFC107]">Cabs</span>
        </h1>
        <p className="text-[#FFC107] font-mono text-xs font-semibold uppercase tracking-[0.2em] mt-1">
          Your Daily Ride Partner
        </p>
        <p className="text-[#999999] text-xs mt-3 leading-relaxed">
          Experience this hyper-fidelity mock dashboard mimicking an entire cab reservation simulator.
          Each simulated screen highlights the visual look-and-feel of actual React Native layouts using our exclusive premium Black-and-Yellow theme.
        </p>
      </div>

      {/* Ride Simulation Control Center */}
      <div className="bg-[#111111] p-5 rounded-[24px] border border-neutral-900 shadow-lg">
        <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[#FFC107] animate-bounce" />
          AUTOPILOT WALKTHROUGH ENGINE
        </h3>

        <div className="flex flex-col gap-3">
          <button
            onClick={onSimulateFullRide}
            disabled={simulatedRideActive}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              simulatedRideActive
                ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                : "bg-[#FFC107] text-black hover:bg-[#FFC107]/80 active:scale-95"
            }`}
          >
            <Play className="w-4 h-4 fill-black" />
            <span>
              {simulatedRideActive ? "Booking Autopilot is Active..." : "Launch Autopilot (Step 1 to 14)"}
            </span>
          </button>

          <div className="text-[11px] text-neutral-400 bg-neutral-950 p-3 rounded-lg border border-neutral-900/50">
            <span className="text-[#FFC107] font-semibold font-mono uppercase">Interactive Simulation State:</span>
            <div className="mt-1 flex items-center gap-1.5 text-neutral-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <span>Current Screen: <strong className="text-white">{currentScreen}</strong></span>
            </div>
            {lastNotification && (
              <div className="mt-2 text-[10px] bg-yellow-950/20 text-[#FFC107] p-1.5 rounded border border-[#FFC107]/20 flex items-center gap-1">
                <BellRing className="w-3 h-3 shrink-0" />
                <span className="truncate">Alert: {lastNotification}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 20-Screens Directory Interactive Index */}
      <div className="bg-[#111111] p-5 rounded-[24px] border border-neutral-900 shadow-lg flex-1">
        <div className="flex items-center justify-between mb-3 border-b border-neutral-900 pb-2">
          <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-[#FFC107]" />
            20 Screens Interactive Directory
          </h3>
          <span className="text-[10px] font-mono text-neutral-500">Jump to any state</span>
        </div>

        <div className="grid grid-cols-1 gap-1 max-h-[360px] overflow-y-auto pr-1.5 phone-scroll">
          {screensList.map((scr) => {
            const isActive = currentScreen === scr.id;
            return (
              <button
                key={scr.id}
                onClick={() => onScreenChange(scr.id)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isActive
                    ? "bg-[#FFC107]/10 border-[#FFC107] shadow-md"
                    : "bg-neutral-950/40 border-neutral-900 hover:border-neutral-800 hover:bg-neutral-900/40"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-[#FFC107]" : "text-neutral-700"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold ${isActive ? "text-[#FFC107]" : "text-white"}`}>
                      {scr.label}
                    </p>
                    <p className="text-[10px] text-neutral-500 truncate group-hover:text-neutral-300">
                      {scr.desc}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-mono shrink-0 px-2 py-0.5 rounded ${
                  isActive ? "bg-[#FFC107] text-[#111111] font-bold" : "bg-neutral-900 text-neutral-400"
                }`}>
                  {isActive ? "LIVE" : "VIEW"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Wallet balance top-up & Offer templates simulator */}
      <div className="bg-[#111111] p-5 rounded-[24px] border border-neutral-900 shadow-lg">
        <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-[#FFC107]" />
          WIDGET & BALANCE SIMULATOR
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Wallet Mini-Controller */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-900">
            <span className="text-[10px] font-semibold text-neutral-500 flex items-center gap-1 uppercase mb-1">
              <Wallet className="w-3 h-3 text-[#FFC107]" /> Wallet Balance
            </span>
            <div className="text-lg font-mono font-bold text-white">
              ₹{walletBalance.toFixed(0)}
            </div>
            <div className="mt-2 flex gap-1">
              <button
                onClick={() => onAddWallet(500)}
                className="flex-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-[#FFC107]/20 text-[9px] py-1 text-white rounded font-mono font-bold cursor-pointer transition-all"
              >
                +₹500
              </button>
              <button
                onClick={() => onAddWallet(1000)}
                className="flex-grow bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-[#FFC107]/20 text-[9px] py-1 text-[#FFC107] rounded font-mono font-bold cursor-pointer transition-all"
              >
                +₹1K
              </button>
            </div>
          </div>

          {/* Preset Coupons mini helper */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-900 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-semibold text-neutral-500 flex items-center gap-1 uppercase mb-1">
                <Tag className="w-3 h-3 text-[#FFC107]" /> Dynamic Promo
              </span>
              <p className="text-[9px] text-[#999999] leading-tight">
                {appliedCoupon ? `Active: ${appliedCoupon.code}` : "Click label card below to apply"}
              </p>
            </div>
            
            <div className="flex gap-1 mt-1">
              {ACTIVE_OFFERS.slice(0, 2).map((off) => (
                <button
                  key={off.code}
                  onClick={() => onApplyCoupon(off)}
                  className={`text-[9px] font-mono px-1.5 py-1 text-center font-bold rounded cursor-pointer transition-all border ${
                    appliedCoupon?.code === off.code
                      ? "bg-[#FFC107] text-[#111111] border-[#FFC107]"
                      : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white"
                  }`}
                  title={off.description}
                >
                  {off.code}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SOS Switch Explanation */}
        <div className="flex items-center gap-3 p-3 bg-red-950/10 border border-red-900/30 rounded-xl">
          <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse shrink-0" />
          <div className="min-w-0">
            <h4 className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
              SOS EMERGENCY SIGNAL
            </h4>
            <p className="text-[9px] text-neutral-500">
              Triggering SOS opens screen #20 immediately, blares visual alarms and relays simulated location to nearby emergency response squads.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

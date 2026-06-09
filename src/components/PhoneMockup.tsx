/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Signal, Wifi, Battery, RotateCcw, AlertOctagon } from "lucide-react";

interface PhoneMockupProps {
  children: React.ReactNode;
  onReset: () => void;
  onSosTrigger: () => void;
  sosActive: boolean;
}

export default function PhoneMockup({ children, onReset, onSosTrigger, sosActive }: PhoneMockupProps) {
  const [timeStr, setTimeStr] = useState("09:41");

  useEffect(() => {
    // Keep a beautiful simulation of clock inside phone mockup
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setTimeStr(`${hours}:${mins} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto max-w-[390px] w-full" id="phone-container">
      {/* Phone Case Bezel shadow */}
      <div className="relative rounded-[50px] p-[10px] bg-[#111111] border-4 border-[#222222] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] transition-all duration-300">
        
        {/* Shiny metallic gold highlight bezel rim */}
        <div className="absolute inset-0 rounded-[46px] border border-[#FFC107]/20 pointer-events-none" />

        {/* Outer Phone Buttons (Volume & Power) */}
        <div className="absolute -left-[14px] top-[100px] w-[4px] h-[35px] bg-[#333333] rounded-l-[4px]" />
        <div className="absolute -left-[14px] top-[150px] w-[4px] h-[50px] bg-[#333333] rounded-l-[4px]" />
        <div className="absolute -left-[14px] top-[210px] w-[4px] h-[50px] bg-[#333333] rounded-l-[4px]" />
        <div className="absolute -right-[14px] top-[140px] w-[4px] h-[65px] bg-[#FFC107]/85 rounded-r-[4px]" />

        {/* Screen Glass Front Surface */}
        <div className="relative rounded-[38px] bg-[#121212] overflow-hidden w-full aspect-[9/19] flex flex-col border border-neutral-900 shadow-inner">
          
          {/* TOP STATUS BAR CONTAINER */}
          <div className="absolute top-0 left-0 right-0 h-[44px] z-50 flex items-center justify-between px-6 select-none bg-gradient-to-b from-black/80 to-transparent">
            {/* Clock */}
            <span className="text-[12px] font-sans font-semibold tracking-tight text-white">
              {timeStr}
            </span>

            {/* iOS Dynamic Island */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-[5px] w-[100px] h-[22px] bg-black rounded-full flex items-center justify-center gap-1.5 px-3 border border-white/5 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="w-3 h-1 bg-neutral-800 rounded-full" />
              <div className="text-[7px] text-[#FFC107] font-mono font-medium scale-90">
                O2-5G
              </div>
            </div>

            {/* Icons (Signal, Wifi, Battery) */}
            <div className="flex items-center gap-1.5 text-white">
              <Signal className="w-3.5 h-3.5 text-white" />
              <Wifi className="w-3.5 h-3.5 text-white animate-pulse" />
              <div className="flex items-center gap-0.5">
                <Battery className="w-4 h-4 text-white" />
                <span className="text-[8px] font-semibold text-neutral-300">98%</span>
              </div>
            </div>
          </div>

          {/* INTERNAL CONTENT VIEW SCREEN */}
          <div className="flex-1 w-full h-full pt-[44px] pb-[20px] overflow-hidden flex flex-col relative">
            {children}
          </div>

          {/* BOTTOM HOME GESTURE BAR */}
          <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-[110px] h-[5px] bg-white/70 rounded-full z-50 hover:bg-[#FFC107] transition-all cursor-pointer" onClick={onReset} title="Instant Splash Restart" />
        </div>
      </div>

      {/* Floating Presentation Quick Buttons underneath the phone */}
      <div className="flex justify-between items-center mt-4 px-2">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-[#FFC107]/40 rounded-full transition-all cursor-pointer shadow-lg"
        >
          <RotateCcw className="w-3 h-3 text-[#FFC107]" />
          <span>Reset Device Session</span>
        </button>

        <button
          onClick={onSosTrigger}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full cursor-pointer transition-all shadow-lg ${
            sosActive
              ? "bg-red-600 text-white animate-pulse font-bold"
              : "bg-neutral-950 text-red-500 border border-red-950 hover:bg-red-950/20"
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5 text-[#FFC107]" />
          <span>{sosActive ? "SOS ON (112)" : "Tap SOS Emergency 112"}</span>
        </button>
      </div>
    </div>
  );
}

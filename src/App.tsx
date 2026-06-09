/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import { ScreenId, Vehicle, Driver, RideHistoryItem, SavedLocation, OfferCoupon, ChatMessage } from "./types";
import {
  VEHICLES,
  SAMPLE_DRIVERS,
  HISTORIC_RIDES,
  SAVED_LOCATIONS,
  ACTIVE_OFFERS,
  WALLET_TRANSACTIONS,
  CHAT_TEMPLATES,
  PRESET_ROUTES,
} from "./data";
import PhoneMockup from "./components/PhoneMockup";
import SimulatedMap from "./components/SimulatedMap";
import PresentationGuide from "./components/PresentationGuide";
import { O2Logo } from "./components/O2Logo";
import {
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  User,
  History,
  Tag,
  Wallet,
  Star,
  Phone,
  MessageCircle,
  Share2,
  X,
  Plus,
  Send,
  Check,
  ChevronRight,
  Menu,
  Bell,
  AlertTriangle,
  Gift,
  Search,
  CheckCircle,
  Copy,
  Volume2,
  Banknote,
  CreditCard,
  Navigation
} from "lucide-react";

function BottomNavbar({ activeTab, setCurrentScreen }: { activeTab: string; setCurrentScreen: (s: ScreenId) => void }) {
  return (
    <div className="bg-white border-t border-slate-100 px-4 py-2 flex justify-between items-center shrink-0 z-40 shadow-lg">
      <button
        onClick={() => setCurrentScreen(ScreenId.HOME)}
        className={`flex flex-col items-center gap-1 flex-1 cursor-pointer transition-colors ${
          activeTab === "home" ? "text-[#111111]" : "text-neutral-400 hover:text-neutral-600"
        }`}
      >
        <MapPin className={`w-5 h-5 ${activeTab === "home" ? "text-[#FFC107] stroke-[2.5]" : "text-neutral-400"}`} />
        <span className="text-[9px] font-bold tracking-wider">Home</span>
      </button>
      <button
        onClick={() => setCurrentScreen(ScreenId.RIDE_HISTORY)}
        className={`flex flex-col items-center gap-1 flex-1 cursor-pointer transition-colors ${
          activeTab === "history" ? "text-[#111111]" : "text-neutral-400 hover:text-neutral-600"
        }`}
      >
        <History className={`w-5 h-5 ${activeTab === "history" ? "text-[#FFC107] stroke-[2.5]" : "text-neutral-400"}`} />
        <span className="text-[9px] font-bold tracking-wider">My Rides</span>
      </button>
      <button
        onClick={() => setCurrentScreen(ScreenId.WALLET)}
        className={`flex flex-col items-center gap-1 flex-1 cursor-pointer transition-colors ${
          activeTab === "wallet" ? "text-[#111111]" : "text-neutral-400 hover:text-neutral-600"
        }`}
      >
        <Wallet className={`w-5 h-5 ${activeTab === "wallet" ? "text-[#FFC107] stroke-[2.5]" : "text-neutral-400"}`} />
        <span className="text-[9px] font-bold tracking-wider">Wallet</span>
      </button>
      <button
        onClick={() => setCurrentScreen(ScreenId.PROFILE)}
        className={`flex flex-col items-center gap-1 flex-1 cursor-pointer transition-colors ${
          activeTab === "profile" ? "text-[#111111]" : "text-neutral-400 hover:text-neutral-600"
        }`}
      >
        <User className={`w-5 h-5 ${activeTab === "profile" ? "text-[#FFC107] stroke-[2.5]" : "text-neutral-400"}`} />
        <span className="text-[9px] font-bold tracking-wider">Profile</span>
      </button>
    </div>
  );
}

export default function App() {
  // Navigation & Screen Control
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(ScreenId.SPLASH);
  
  // Login & Registration State
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(60);

  // Home Screen States
  const [pickupQuery, setPickupQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [pickupAddress, setPickupAddress] = useState("Jaynagar, Madhubani");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  // Custom route state chosen via Google Maps or Local Area picker
  const [customDistance, setCustomDistance] = useState<number | null>(null);
  const [customDuration, setCustomDuration] = useState<number | null>(null);
  const [locationTab, setLocationTab] = useState<"google" | "local" | "map_picker">("google");
  const [googleSearchQuery, setGoogleSearchQuery] = useState("");
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [mapPickMode, setMapPickMode] = useState<"pickup" | "drop">("drop");
  const [activeFieldSelector, setActiveFieldSelector] = useState<"pickup" | "drop">("drop");

  const tripDistance = useMemo(() => {
    return customDistance !== null ? customDistance : PRESET_ROUTES[activePresetIndex].distanceKm;
  }, [customDistance, activePresetIndex]);

  const tripDuration = useMemo(() => {
    return customDuration !== null ? customDuration : PRESET_ROUTES[activePresetIndex].durationMins;
  }, [customDuration, activePresetIndex]);

  // Booking & Ride state
  const [selectedVehicleId, setSelectedVehicleId] = useState("v-mini");
  const [appliedCoupon, setAppliedCoupon] = useState<OfferCoupon | null>(null);
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);
  const [driverStatus, setDriverStatus] = useState<"idle" | "heading_to_pickup" | "arrived" | "ongoing" | "completed">("idle");
  const [simulatedRideActive, setSimulatedRideActive] = useState(false);
  const [rideElapsedPercent, setRideElapsedPercent] = useState(0);

  // Financial Systems
  const [walletBalance, setWalletBalance] = useState(1250);
  const [transactions, setTransactions] = useState(WALLET_TRANSACTIONS);
  const [addMoneyInput, setAddMoneyInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash" | "wallet">("wallet");
  const [topUpMethod, setTopUpMethod] = useState<"upi" | "card" | "netbanking">("upi");

  // Communication Logs
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInputText, setChatInputText] = useState("");
  const [showChatModal, setShowChatModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [emergencyCallActive, setEmergencyCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Ratings & Alerts
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingText, setRatingText] = useState("");
  const [submittedReviewTags, setSubmittedReviewTags] = useState<string[]>([]);
  const [chosenReviewTags, setChosenReviewTags] = useState<string[]>([]);
  const [lastNotification, setLastNotification] = useState<string | null>(null);
  const [showNotificationOverlay, setShowNotificationOverlay] = useState(false);
  
  // Emergency SOS state
  const [sosTriggered, setSosTriggered] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);

  // User properties (editable state)
  const [userName, setUserName] = useState(() => localStorage.getItem("o2_user_name") || "Nazam MD");
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("o2_user_email") || "nazammd131@gmail.com");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editNameField, setEditNameField] = useState(userName);
  const [editEmailField, setEditEmailField] = useState(userEmail);

  const [profileImage, setProfileImage] = useState<string | null>(() => {
    return localStorage.getItem("o2_profile_image");
  });

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem("o2_profile_image", base64String);
        triggerNotification("📸 Profile image updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };
  
  // References for timers
  const simTimerRef = useRef<NodeJS.Timeout | null>(null);
  const otpTimerRef = useRef<NodeJS.Timeout | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Automatic Splash screen timeout transitioning to Login Screen after 3 seconds
  useEffect(() => {
    if (currentScreen === ScreenId.SPLASH) {
      const splashTimer = setTimeout(() => {
        setCurrentScreen(ScreenId.LOGIN);
        triggerNotification("Welcome to O2 Cabs! Log in to secure your ride.");
      }, 3000);
      return () => clearTimeout(splashTimer);
    }
  }, [currentScreen]);

  // OTP Countdown timer
  useEffect(() => {
    if (isOtpSent && otpCountdown > 0) {
      otpTimerRef.current = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (otpTimerRef.current) clearInterval(otpTimerRef.current);
    };
  }, [isOtpSent, otpCountdown]);

  // Simulated Telephone Voice Call timer
  useEffect(() => {
    if (showCallModal || emergencyCallActive) {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [showCallModal, emergencyCallActive]);

  // Emergency SOS count down
  useEffect(() => {
    let sosTimer: NodeJS.Timeout;
    if (sosTriggered && sosCountdown > 0) {
      sosTimer = setInterval(() => {
        setSosCountdown((prev) => prev - 1);
      }, 1000);
    } else if (sosTriggered && sosCountdown === 0) {
      triggerNotification("🚨 SOS DIALED! CONNECTED TO EMERGENCY HELPLINE (112) AND STREAMING COORDINATES.");
    }
    return () => clearInterval(sosTimer);
  }, [sosTriggered, sosCountdown]);

  // Utility to handle automatic dynamic notification overlay showing up elegantly
  const triggerNotification = (text: string) => {
    setLastNotification(text);
    setShowNotificationOverlay(true);
    setTimeout(() => {
      setShowNotificationOverlay(false);
    }, 5000);
  };

  // Autopilot Simulation Flow (Automating Screen 1 to 14)
  const handleLaunchAutopilot = () => {
    if (simulatedRideActive) return;
    setSimulatedRideActive(true);
    
    // Reset core states for fresh start
    setCurrentScreen(ScreenId.SPLASH);
    setPhoneNumber("9876543210");
    setPickupAddress("South Extension-I Ring Road, New Delhi");
    setDestinationAddress("DLF Cyber City, Tower 10A");
    setActivePresetIndex(0);
    setAppliedCoupon(ACTIVE_OFFERS[0]);
    setRideElapsedPercent(0);
    setChatMessages([]);

    // Step 2: Login Screen after 2.5s
    setTimeout(() => {
      setCurrentScreen(ScreenId.LOGIN);
    }, 2500);

    // Step 3: Send OTP automatic press after 4s
    setTimeout(() => {
      setIsOtpSent(true);
      setCurrentScreen(ScreenId.OTP);
      setOtpCode(["2", "0", "2", "6"]);
      triggerNotification("💬 Mock SMS: Use premium entry code 2026.");
    }, 4500);

    // Step 4: Verify OTP entering home map after 6.5s
    setTimeout(() => {
      setCurrentScreen(ScreenId.HOME);
    }, 6500);

    // Step 5: Pickup selection screen after 8s
    setTimeout(() => {
      setCurrentScreen(ScreenId.PICK_SPOT);
    }, 8000);

    // Step 6: Vehicle Selection after 10s
    setTimeout(() => {
      setCurrentScreen(ScreenId.VEHICLE_SELECT);
    }, 10500);

    // Step 7: Fare Estimation detail after 12.5s
    setTimeout(() => {
      setCurrentScreen(ScreenId.FARE_ESTIMATE);
    }, 12500);

    // Step 8: Start Driver Search radar after 14.5s
    setTimeout(() => {
      setCurrentScreen(ScreenId.SEARCH_DRIVER);
    }, 14500);

    // Step 9: Driver Assigned after 17s
    setTimeout(() => {
      const selectedDriver = SAMPLE_DRIVERS[0]; // Rajesh Kumar
      setCurrentDriver(selectedDriver);
      setDriverStatus("heading_to_pickup");
      setCurrentScreen(ScreenId.DRIVER_ASSIGNED);
      triggerNotification(`🚕 Pilot ${selectedDriver.name} is arriving shortly in ${selectedDriver.vehicleNo}`);
    }, 17000);

    // Step 10: Live tracking driver driving to pickup after 19.5s
    setTimeout(() => {
      setCurrentScreen(ScreenId.LIVE_TRACKING);
      // Simulate driver texting
      setChatMessages([
        { id: "cm-0", sender: "driver", text: "I have reached the main highway traffic light.", time: "Just now" }
      ]);
    }, 19500);

    // Step 11: Ride ongoing after 24s (User is inside vehicle driving along path)
    setTimeout(() => {
      setDriverStatus("ongoing");
      setCurrentScreen(ScreenId.RIDE_IN_PROGRESS);
      triggerNotification("🚀 Trip started. Sharing security tracking link.");
      
      // Animate percentage from 0 to 100
      let elapsed = 0;
      const progressTimer = setInterval(() => {
        elapsed += 10;
        setRideElapsedPercent(elapsed);
        if (elapsed >= 100) {
          clearInterval(progressTimer);
        }
      }, 500);
    }, 23000);

    // Step 12: Payment Screen after 29s
    setTimeout(() => {
      setDriverStatus("completed");
      setCurrentScreen(ScreenId.PAYMENT);
    }, 28500);

    // Step 13: Ride Completed after 31.5s
    setTimeout(() => {
      setCurrentScreen(ScreenId.COMPLETED);
    }, 31500);

    // Step 14: Rating & Review Screen after 33.5s
    setTimeout(() => {
      setCurrentScreen(ScreenId.RATING_REVIEW);
      setSimulatedRideActive(false);
    }, 33500);
  };

  // Manual configuration for destination selection
  const selectPresetRoute = (index: number) => {
    setActivePresetIndex(index);
    const route = PRESET_ROUTES[index];
    setPickupAddress(route.pickup);
    setDestinationAddress(route.dest);
    setCurrentScreen(ScreenId.VEHICLE_SELECT);
  };

  // Handle immediate SOS Emergency triggers
  const handleTriggerSOS = () => {
    if (sosTriggered) {
      // Disarm
      setSosTriggered(false);
      setEmergencyCallActive(false);
      setSosCountdown(5);
      triggerNotification("💚 Emergency beacon deactivated successfully.");
    } else {
      setSosTriggered(true);
      setEmergencyCallActive(true);
      setCurrentScreen(ScreenId.SOS_ALERT);
      triggerNotification("🚨 DIALING 112 & STREAMING COORDINATES LIVE!");
    }
  };

  // Restart entire device state
  const handleResetSession = () => {
    setCurrentScreen(ScreenId.SPLASH);
    setPhoneNumber("");
    setOtpCode(["", "", "", ""]);
    setIsOtpSent(false);
    setOtpCountdown(60);
    setDestinationAddress("");
    setAppliedCoupon(null);
    setCurrentDriver(null);
    setDriverStatus("idle");
    setRideElapsedPercent(0);
    setChatMessages([]);
    setSosTriggered(false);
    setSosCountdown(5);
    setSimulatedRideActive(false);
  };

  // Calculated selected fare depending on chosen vehicle & coupons
  const currentSelectedVehicle: Vehicle = VEHICLES.find((v) => v.id === selectedVehicleId) || VEHICLES[0];
  const calculatedBaseFare = useMemo(() => {
    const distance = tripDistance;
    const base = currentSelectedVehicle.farePerKm * distance;
    return Math.round(base);
  }, [selectedVehicleId, tripDistance, currentSelectedVehicle]);

  const finalRideFare = useMemo(() => {
    let fare = calculatedBaseFare + 30; // adding booking fee/escalators
    if (appliedCoupon) {
      if (appliedCoupon.discountValue < 1) {
        fare = Math.round(fare * (1 - appliedCoupon.discountValue));
      } else {
        fare = Math.max(0, fare - appliedCoupon.discountValue);
      }
    }
    return Math.round(fare);
  }, [calculatedBaseFare, appliedCoupon]);

  // Adds money to wallet
  const handleAddWalletMoney = (amount: number, method: "upi" | "card" | "netbanking" = "upi") => {
    setWalletBalance((prev) => prev + amount);
    let methodLabel = "UPI Pay";
    if (method === "card") methodLabel = "Credit/Debit Card";
    if (method === "netbanking") methodLabel = "Net Banking";

    const newTxn = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      type: "credit" as const,
      amount: amount,
      description: `Added funds via O2 Online ${methodLabel}`,
      date: "Just now",
    };
    setTransactions([newTxn, ...transactions]);
    triggerNotification(`₹${amount} added successfully via Online ${methodLabel}!`);
  };

  // Submit Rating Review
  const handleSubmitReview = () => {
    setSubmittedReviewTags(chosenReviewTags);
    triggerNotification("⭐ Thank you! Your feedback helps us maintain premium rides.");
    setCurrentScreen(ScreenId.HOME);
    // Add completed ride to history
    const completeItem: RideHistoryItem = {
      id: `R-${Math.floor(10000 + Math.random() * 90000)}`,
      date: "Today • Just now",
      pickup: pickupAddress,
      destination: destinationAddress,
      vehicleName: currentSelectedVehicle.name,
      amount: finalRideFare,
      status: "completed",
      driverName: currentDriver ? currentDriver.name : "Rajesh Kumar",
    };
    HISTORIC_RIDES.unshift(completeItem);
  };

  // Live driver quick responds messages simulator
  const handleSendChatMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "user",
      text,
      time: "Now",
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInputText("");

    // Simulate immediate smart pilot reply
    setTimeout(() => {
      const driverReplies = [
        "Okay sir, I am near sector traffic junction. Coming in 1 minute.",
        "Understood. Please wait at the building lobby.",
        "Please confirm safety code once I arrive.",
        "Yes, running AC on full. Heading your way.",
      ];
      const randomReply = driverReplies[Math.floor(Math.random() * driverReplies.length)];
      const driverMsg: ChatMessage = {
        id: `m-dr-${Date.now()}`,
        sender: "driver",
        text: randomReply,
        time: "Now",
      };
      setChatMessages((prev) => [...prev, driverMsg]);
      triggerNotification("💬 New message from O2 Driver Pilot!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white py-12 px-4 selection:bg-[#FFC107] selection:text-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Presentation & Design Guide Wrapper (5 Cols) */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <PresentationGuide
            currentScreen={currentScreen}
            onScreenChange={(screen) => setCurrentScreen(screen)}
            walletBalance={walletBalance}
            onAddWallet={handleAddWalletMoney}
            onApplyCoupon={(cp) => {
              setAppliedCoupon(cp);
              triggerNotification(`Promo ${cp.code} applied! Saved discount added.`);
            }}
            appliedCoupon={appliedCoupon}
            onToggleSos={handleTriggerSOS}
            sosActive={sosTriggered}
            onSimulateFullRide={handleLaunchAutopilot}
            simulatedRideActive={simulatedRideActive}
            onResetAll={handleResetSession}
            lastNotification={lastNotification}
          />
        </div>

        {/* RIGHT COLUMN: Phone Mockup Container & Interactive Simulator (7 Cols) */}
        <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-center">
          
          <div className="w-full mb-4 text-center">
            <span className="text-xs font-mono text-[#FFC107] uppercase tracking-widest bg-[#FFC107]/5 border border-[#FFC107]/10 px-3 py-1 rounded-full">
              Interactive Smartphone Mockup • Click below to operate
            </span>
          </div>

          <div className="relative">
            {/* Live Pop-Up Smart Message System Notification Banner (Sits above screen/phone) */}
            {showNotificationOverlay && lastNotification && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[340px] z-[999] bg-[#111111]/95 text-white p-3 rounded-2xl border border-[#FFC107]/60 shadow-[0_15px_30px_-5px_rgba(255,193,7,0.3)] backdrop-blur-md flex items-start gap-2.5 animate-bounce">
                <div className="p-1 rounded bg-[#FFC107] text-black">
                  <Bell className="w-4 h-4 shrink-0" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[10px] font-bold text-[#FFC107] uppercase tracking-wide">
                    O2 Cabs Live System
                  </h4>
                  <p className="text-[11px] text-neutral-300 leading-tight truncate">
                    {lastNotification}
                  </p>
                </div>
                <button
                  onClick={() => setShowNotificationOverlay(false)}
                  className="text-neutral-500 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <PhoneMockup
              onReset={handleResetSession}
              onSosTrigger={handleTriggerSOS}
              sosActive={sosTriggered}
            >
              
              {/* === SCREEN 1: SPLASH VIEW === */}
              {currentScreen === ScreenId.SPLASH && (
                <div className="flex-1 flex flex-col justify-between bg-[#111111] p-6 text-center select-none h-full relative" id="screen-splash">
                  {/* Ambient radial lighting */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FFC107]/15 via-black to-black opacity-80 pointer-events-none" />
                  
                  <div className="my-auto z-10 flex flex-col items-center">
                    {/* High Fidelity Circular Logo */}
                    <O2Logo size={190} className="mb-4 transform hover:scale-105 transition-transform duration-500" />
                    <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#FFC107]/90 bg-[#FFC107]/5 border border-[#FFC107]/20 px-3 py-1 rounded-full text-center">
                      Your Daily Ride Partner
                    </span>
                  </div>

                  <div className="mt-auto z-10 flex flex-col items-center gap-4">
                    {/* Loading state bar */}
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] animate-bounce" />
                      <span className="text-[10px] text-neutral-400 font-mono tracking-wider ml-1.5 select-none uppercase">Initializing Secure GPS...</span>
                    </div>
                    
                    <button
                      onClick={() => setCurrentScreen(ScreenId.LOGIN)}
                      id="btn-splash-get-started"
                      className="w-full bg-[#FFC107] hover:bg-neutral-100 text-[#111111] text-xs font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(255,193,7,0.3)] transition-all cursor-pointer font-sans uppercase tracking-wider"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              )}

              {/* === SCREEN 2: MOBILE NUMBER LOGIN === */}
              {currentScreen === ScreenId.LOGIN && (
                <div className="flex-1 flex flex-col justify-between bg-white text-neutral-800 h-full font-sans" id="screen-login">
                  <div className="p-6 overflow-y-auto phone-scroll flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-center mb-4">
                        <O2Logo size={90} />
                      </div>
                      
                      <h2 className="text-2xl font-black text-[#111111] tracking-tight text-center">
                        Login / Signup
                      </h2>
                      <p className="text-neutral-500 text-xs text-center mt-1">
                        Enter mobile number to request high-speed O2 Cabs
                      </p>

                      {/* Input box */}
                      <div className="mt-6 flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-4 gap-3 shadow-inner">
                        <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200 text-sm font-extrabold text-[#111111]">
                          <span className="text-lg">🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          disabled
                          value={phoneNumber ? phoneNumber.replace(/(\d{5})(\d{5})/, "$1 $2") : ""}
                          placeholder="00000 00000"
                          className="bg-transparent text-sm font-bold tracking-widest outline-none border-none flex-1 font-mono text-[#111111] placeholder:text-neutral-300"
                        />
                        {phoneNumber && (
                          <button
                            onClick={() => setPhoneNumber("")}
                            className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
                          >
                            <X className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Numerical Keys Grid */}
                    <div className="mt-4">
                      <div className="grid grid-cols-3 gap-2 px-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                          <button
                            key={num}
                            onClick={() => {
                              if (phoneNumber.length < 10) {
                                setPhoneNumber((prev) => prev + num);
                              }
                            }}
                            className="bg-slate-50 hover:bg-slate-100 active:scale-95 text-[#111111] font-mono text-base font-bold py-3.5 rounded-xl transition-all cursor-pointer border border-slate-100/30 flex items-center justify-center shadow-sm"
                          >
                            {num}
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            if (phoneNumber.length < 10) {
                              setPhoneNumber((prev) => prev + "0");
                            }
                          }}
                          className="col-span-2 bg-slate-50 hover:bg-slate-100 text-[#111111] font-mono text-base font-bold py-3.5 rounded-xl cursor-pointer border border-slate-100/30 flex items-center justify-center shadow-sm"
                        >
                          0
                        </button>
                        <button
                          onClick={() => setPhoneNumber(phoneNumber.slice(0, -1))}
                          className="bg-red-50 hover:bg-red-100 text-red-500 font-bold text-xs py-3.5 rounded-xl flex items-center justify-center cursor-pointer border border-red-100/20 shadow-sm"
                        >
                          DEL
                        </button>
                      </div>

                      {/* Action Trigger Button */}
                      <button
                        onClick={() => {
                          if (phoneNumber.length === 10) {
                            setIsOtpSent(true);
                            setOtpCountdown(60);
                            setCurrentScreen(ScreenId.OTP);
                            triggerNotification("🔑 OTP Verification code sent: 4402");
                          } else {
                            triggerNotification("⚠️ Please enter a complete 10-digit mobile number.");
                          }
                        }}
                        disabled={phoneNumber.length !== 10}
                        id="btn-login-continue"
                        className={`w-full mt-4 text-xs font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md uppercase tracking-wider ${
                          phoneNumber.length === 10
                            ? "bg-[#111111] text-white hover:bg-neutral-800 cursor-pointer"
                            : "bg-slate-200 text-neutral-400 cursor-not-allowed"
                        }`}
                      >
                        <span>Request OTP</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>

                      <p className="text-[9px] text-neutral-400 text-center mt-3 leading-tight px-4 font-bold uppercase tracking-wider">
                        Secure OTP • O2 Verification
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* === SCREEN 3: OTP VERIFICATION === */}
              {currentScreen === ScreenId.OTP && (
                <div className="flex-1 flex flex-col justify-between bg-white text-neutral-800 h-full font-sans" id="screen-otp">
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <button
                        onClick={() => setCurrentScreen(ScreenId.LOGIN)}
                        className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-neutral-600 mr-auto flex cursor-pointer"
                      >
                        <X className="w-5 h-5 stroke-[2.5]" />
                      </button>
                      
                      <h2 className="text-2xl font-black text-[#111111] tracking-tight mt-4 text-left">
                        OTP Verification
                      </h2>
                      <p className="text-neutral-500 text-xs mt-1 text-left">
                        Enter the 4-digit security code sent to <strong className="text-neutral-800 font-mono">+91 {phoneNumber}</strong>
                      </p>

                      {/* 4 Beautiful Box Inputs */}
                      <div className="flex justify-center gap-3.5 mt-8" id="otp-inputs-grid">
                        {[0, 1, 2, 3].map((idx) => {
                          const digit = otpCode[idx] || "";
                          return (
                            <div
                              key={`otp-box-${idx}`}
                              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-xl font-bold border transition-all ${
                                digit 
                                  ? "border-[#FFC107] bg-amber-50 text-[#111111] shadow-sm font-extrabold" 
                                  : "border-slate-200 bg-slate-50 text-neutral-300"
                              }`}
                            >
                              {digit ? digit : "•"}
                            </div>
                          );
                        })}
                      </div>

                      {/* Helper quick autofill */}
                      <div className="bg-amber-50 border border-amber-100/50 rounded-xl p-3 mt-6 flex justify-between items-center">
                        <div className="text-[10px] text-amber-800 text-left leading-tight pr-2">
                          🔔 SIM Auto-detected OTP message code!
                        </div>
                        <button
                          onClick={() => {
                            setOtpCode(["4", "4", "0", "2"]);
                            triggerNotification("📝 Filled OTP: 4402");
                          }}
                          className="bg-[#111111] text-white hover:bg-neutral-800 text-[10px] font-extrabold px-3 py-1.5 rounded-lg cursor-pointer shrink-0"
                        >
                          Autofill (4402)
                        </button>
                      </div>
                    </div>

                    {/* Keyboard panel */}
                    <div className="mt-4">
                      <div className="grid grid-cols-3 gap-2 px-1 mb-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                          <button
                            key={`otp-num-${num}`}
                            onClick={() => {
                              const nextCode = [...otpCode];
                              const blankIdx = nextCode.findIndex((val) => val === "");
                              if (blankIdx !== -1) {
                                nextCode[blankIdx] = String(num);
                                setOtpCode(nextCode);
                              }
                            }}
                            className="bg-slate-50 hover:bg-slate-100 py-3 rounded-xl font-mono text-base font-bold text-[#111111] shadow-sm border border-slate-100/30 flex items-center justify-center cursor-pointer"
                          >
                            {num}
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            const nextCode = [...otpCode];
                            const blankIdx = nextCode.findIndex((val) => val === "");
                            if (blankIdx !== -1) {
                              nextCode[blankIdx] = "0";
                              setOtpCode(nextCode);
                            }
                          }}
                          className="bg-slate-50 hover:bg-slate-100 py-3 rounded-xl font-mono text-base font-bold text-[#111111] shadow-sm border border-slate-100/30 flex items-center justify-center cursor-pointer col-span-2"
                        >
                          0
                        </button>
                        <button
                          onClick={() => {
                            const nextCode = [...otpCode];
                            for (let i = 3; i >= 0; i--) {
                              if (nextCode[i] !== "") {
                                nextCode[i] = "";
                                setOtpCode(nextCode);
                                break;
                              }
                            }
                          }}
                          className="bg-red-50 hover:bg-red-100 py-3 rounded-xl font-bold text-xs text-red-500 shadow-sm border border-red-500/10 flex items-center justify-center cursor-pointer"
                        >
                          DEL
                        </button>
                      </div>

                      {/* Verification Trigger Action */}
                      <button
                        onClick={() => {
                          const codeStr = otpCode.join("");
                          if (codeStr === "4402" || codeStr === "2026") {
                            triggerNotification("✅ Login success! Welcome back Nazam MD.");
                            setCurrentScreen(ScreenId.HOME);
                          } else {
                            triggerNotification("❌ Invalid verification code. (Hint: Try 4402).");
                          }
                        }}
                        id="btn-otp-verify"
                        className="w-full bg-[#111111] text-white hover:bg-neutral-800 text-xs font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-md uppercase tracking-wider cursor-pointer font-bold"
                      >
                        <span>Verify OTP</span>
                        <CheckCircle className="w-4 h-4 text-[#FFC107]" />
                      </button>

                      <div className="flex justify-between items-center mt-3 text-[10px] px-1 text-neutral-500">
                        <span>Resend code in <strong className="font-mono text-neutral-800">00:{String(otpCountdown).padStart(2, "0")}</strong></span>
                        <button
                          disabled={otpCountdown > 0}
                          onClick={() => {
                            setOtpCountdown(60);
                            triggerNotification("🔑 Resent security OTP to your phone: 4402");
                          }}
                          className={`font-bold uppercase tracking-wider ${otpCountdown > 0 ? "text-neutral-300 cursor-not-allowed" : "text-[#FFC107] hover:underline cursor-pointer"}`}
                        >
                          Resend
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === SCREEN 4: HOME MAP SCREEN === */}
              {currentScreen === ScreenId.HOME && (
                <div className="flex-1 flex flex-col bg-slate-50 text-neutral-800 h-full justify-between" id="screen-home">
                  {/* Map Area taking up top part */}
                  <div className="relative h-[220px] shrink-0 border-b border-slate-100">
                    <SimulatedMap
                      pickupName={pickupAddress}
                      destinationName={destinationAddress}
                      driverAssigned={currentDriver !== null}
                      driverStatus={driverStatus}
                      rideProgress={rideElapsedPercent}
                      vehicleEmoji={currentSelectedVehicle.icon}
                      activePresetIndex={activePresetIndex}
                    />
                    
                    {/* Floating Header Panel inside the phone */}
                    <div className="absolute top-3 inset-x-3 flex justify-between items-center z-30 pointer-events-none">
                      <button
                        onClick={() => setCurrentScreen(ScreenId.PROFILE)}
                        className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-neutral-800 pointer-events-auto border border-slate-100 hover:bg-slate-50 active:scale-95 cursor-pointer"
                      >
                        <Menu className="w-5 h-5" />
                      </button>
                      <div className="bg-black text-[#FFC107] px-3 py-1 rounded-full text-[11px] font-black tracking-widest shadow-md flex items-center gap-1 border border-white/10 pointer-events-auto">
                        <span className="w-2 h-2 rounded-full bg-[#FFC107] animate-pulse" />
                        <span>O2 CABS</span>
                      </div>
                      <button
                        onClick={() => setCurrentScreen(ScreenId.OFFERS_COUPONS)}
                        className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-neutral-800 pointer-events-auto border border-slate-100 hover:bg-slate-50 active:scale-95 cursor-pointer"
                      >
                        <Bell className="w-4 h-4 text-neutral-600" />
                      </button>
                    </div>

                    {/* Small float overlay helper */}
                    <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] tracking-wide text-neutral-200 uppercase font-mono z-20">
                      📍 Bihar Central Map
                    </div>
                  </div>

                  {/* Bottom Scrollable Booking Card */}
                  <div className="flex-1 overflow-y-auto p-4 phone-scroll bg-white rounded-t-[32px] -mt-4 z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                    <div>
                      {/* Welcome Text */}
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <h3 className="text-neutral-450 text-[10px] uppercase font-bold tracking-wider m-0 leading-none">
                            Welcome, Premium Rider
                          </h3>
                          <h2 className="text-base font-black text-[#111111] tracking-tight mt-1">
                            Hey {userName} 👋
                          </h2>
                        </div>
                        <span className="text-[10px] font-extrabold px-2 py-1 bg-amber-100 text-amber-850 rounded-lg flex items-center gap-1 font-sans">
                          ⭐ Gold Pilot
                        </span>
                      </div>

                      {/* Address Selection Pills ("Where to?" - Screen 04/05 style) */}
                      <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-2.5 shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 scale-125" />
                          <div className="min-w-0 flex-1 text-left">
                            <label className="text-[9px] uppercase font-bold text-neutral-400 block tracking-wider leading-none">
                              PICKUP POINT
                            </label>
                            <span className="text-xs font-bold text-[#111111] truncate block mt-0.5">
                              {pickupAddress}
                            </span>
                          </div>
                        </div>
                        <div className="h-px bg-slate-100 ml-5" />
                        <div
                          onClick={() => setCurrentScreen(ScreenId.PICK_SPOT)}
                          id="search-dest-trigger"
                          className="flex items-center gap-3 cursor-pointer hover:bg-slate-100/50 -m-1 p-1 rounded-lg transition-all"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#FFC107] scale-125 animate-ping" />
                          <div className="min-w-0 flex-1 text-left">
                            <label className="text-[9px] uppercase font-bold text-neutral-400 block tracking-wider leading-none">
                              DROP DESTINATION
                            </label>
                            <span className={`text-xs font-bold truncate block mt-0.5 ${destinationAddress ? "text-[#111111]" : "text-neutral-400"}`}>
                              {destinationAddress || "Where to? Enter drop location..."}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-300 ml-auto" />
                        </div>
                      </div>

                      {/* Categories grid (Mini, Sedan, SUV, Auto) */}
                      <div className="mt-4" id="home-vehicle-categories">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2.5">
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-[#111111]">
                            Select Your Vehicle
                          </h4>
                          <span className="text-[9px] text-[#FFC107] font-bold">Fastest: 1 min</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {VEHICLES.map((vehicle) => {
                            const isSelected = vehicle.id === selectedVehicleId;
                            const isPopular = vehicle.type === "sedan" || vehicle.type === "mayuri";
                            return (
                              <div
                                key={vehicle.id}
                                onClick={() => {
                                  setSelectedVehicleId(vehicle.id);
                                  triggerNotification(`🚗 Selected ${vehicle.name}. Base rate ₹${vehicle.farePerKm}/km`);
                                }}
                                className={`relative p-2 rounded-2xl flex flex-col items-center justify-center cursor-pointer border transition-all text-center ${
                                  isSelected
                                    ? "bg-[#111111] text-white border-[#111111] shadow-md scale-105"
                                    : "bg-slate-50 text-neutral-600 border-slate-100 hover:bg-slate-100/50"
                                }`}
                              >
                                {isPopular && (
                                  <span className="absolute -top-1.5 -right-0.5 bg-[#FFC107] text-[#111111] font-bold text-[7px] px-1 rounded-full uppercase scale-90 border border-white">
                                    Best
                                  </span>
                                )}
                                <span className="text-xl select-none">{vehicle.icon}</span>
                                <span className="text-[10px] font-black tracking-tight mt-1 leading-tight truncate w-full">
                                  {vehicle.name.split(" ").pop()}
                                </span>
                                <span className={`text-[8px] font-mono mt-0.5 ${isSelected ? "text-amber-400 font-extrabold" : "text-neutral-400"}`}>
                                  ₹{vehicle.farePerKm}/km
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Offer Benefit Card Banner */}
                      <div
                        onClick={() => setCurrentScreen(ScreenId.OFFERS_COUPONS)}
                        className="mt-4 p-3 bg-amber-50 border border-amber-200/50 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-amber-100/70 transition-all shadow-sm"
                        id="home-benefit-card"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#FFC107] flex items-center justify-center text-black text-sm font-black shadow-inner">
                            🎁
                          </div>
                          <div className="text-left">
                            <h5 className="text-xs font-black text-[#111111] leading-tight">
                              Save 20% on town rides!
                            </h5>
                            <p className="text-[9px] text-amber-900 mt-0.5">
                              Apply code for instant discounts
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#111111]" />
                      </div>
                    </div>

                    {/* Home screen bottom action triggers */}
                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => {
                          if (!destinationAddress) {
                            setCurrentScreen(ScreenId.PICK_SPOT);
                            triggerNotification("👉 Please choose a destination point first.");
                          } else {
                            setCurrentScreen(ScreenId.VEHICLE_SELECT);
                          }
                        }}
                        className="flex-1 bg-[#111111] text-white hover:bg-neutral-800 text-xs font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg uppercase tracking-wider cursor-pointer"
                      >
                        <span>Cab Book</span>
                        <ArrowRight className="w-4 h-4 text-[#FFC107]" />
                      </button>
                    </div>
                  </div>

                  {/* Shared Bottom tab bar inside HOME */}
                  <BottomNavbar activeTab="home" setCurrentScreen={setCurrentScreen} />
                </div>
              )}

              {/* === SCREEN 5: PICKUP & DESTINATION SELECTION === */}
              {currentScreen === ScreenId.PICK_SPOT && (
                <div className="flex-1 flex flex-col bg-slate-50 text-neutral-850 h-full" id="screen-pick-spot">
                  {/* Header Input Panels */}
                  <div className="bg-white p-4 pb-5 rounded-b-[32px] border-b border-slate-100 shadow-sm relative">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setCurrentScreen(ScreenId.HOME)}
                        className="text-xs text-neutral-600 hover:text-[#111111] font-bold flex items-center gap-1 active:scale-95 cursor-pointer"
                      >
                        ← Back
                      </button>
                      <h3 className="text-center text-xs font-black text-neutral-800 uppercase tracking-widest">
                        Set Location Route
                      </h3>
                      <div className="w-8 h-8 rounded-full bg-[#FFC107]/10 flex items-center justify-center text-xs text-[#FFC107] font-black">
                        📌
                      </div>
                    </div>

                    {/* Inputs wrapper */}
                    <div className="relative flex flex-col gap-3 mt-2">
                      {/* Vertical line connection */}
                      <div className="absolute left-[13px] top-[18px] bottom-[18px] w-0.5 bg-dashed border-l border-slate-200" />

                      {/* Pickup Input Box */}
                      <div
                        onClick={() => {
                          setActiveFieldSelector("pickup");
                          setMapPickMode("pickup");
                        }}
                        className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                          activeFieldSelector === "pickup"
                            ? "bg-emerald-50/25 border-emerald-500 shadow-xs"
                            : "bg-slate-50 border-slate-100"
                        }`}
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-inner" />
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="text-[8px] uppercase font-bold text-neutral-400 block tracking-wider leading-none">
                              PICKUP FROM
                            </label>
                            {activeFieldSelector === "pickup" && (
                              <span className="text-[7.5px] font-black uppercase text-emerald-600 tracking-widest bg-emerald-100/50 px-1 py-px rounded leading-none">
                                Active input ✍️
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={pickupAddress}
                            onChange={(e) => setPickupAddress(e.target.value)}
                            onFocus={() => {
                              setActiveFieldSelector("pickup");
                              setMapPickMode("pickup");
                            }}
                            placeholder="Your current pickup point"
                            className="bg-transparent text-xs outline-none w-full font-bold text-neutral-800"
                          />
                        </div>
                      </div>

                      {/* Drop Input Box */}
                      <div
                        onClick={() => {
                          setActiveFieldSelector("drop");
                          setMapPickMode("drop");
                        }}
                        className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                          activeFieldSelector === "drop"
                            ? "bg-amber-50/25 border-[#FFC107] shadow-xs"
                            : "bg-slate-50 border-slate-100"
                        }`}
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FFC107] flex items-center justify-center shrink-0 shadow-inner" />
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="text-[8px] uppercase font-bold text-neutral-400 block tracking-wider leading-none">
                              DROP DESTINATION
                            </label>
                            {activeFieldSelector === "drop" && (
                              <span className="text-[7.5px] font-black uppercase text-amber-600 tracking-widest bg-amber-100/50 px-1 py-px rounded leading-none">
                                Active input ✍️
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={destinationAddress}
                            onChange={(e) => setDestinationAddress(e.target.value)}
                            onFocus={() => {
                              setActiveFieldSelector("drop");
                              setMapPickMode("drop");
                            }}
                            placeholder="Where to? (e.g. Madhubani Station)"
                            className="bg-transparent text-xs outline-none w-full font-bold text-neutral-800 placeholder:text-neutral-400"
                            autoFocus
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Suggestion List & Multi-Mode Picker tabs */}
                  <div className="flex-1 overflow-y-auto mt-2 px-3 phone-scroll text-left">
                    
                    {/* Location selector modes */}
                    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl mb-3">
                      <button
                        onClick={() => setLocationTab("google")}
                        className={`py-1.5 px-1 rounded-lg text-[9px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          locationTab === "google"
                            ? "bg-white text-neutral-850 shadow-xs"
                            : "text-neutral-500 hover:text-neutral-700"
                        }`}
                      >
                        🔍 Google Maps
                      </button>
                      <button
                        onClick={() => setLocationTab("local")}
                        className={`py-1.5 px-1 rounded-lg text-[9px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          locationTab === "local"
                            ? "bg-white text-neutral-850 shadow-xs"
                            : "text-neutral-500 hover:text-neutral-700"
                        }`}
                      >
                        📍 Local Area
                      </button>
                      <button
                        onClick={() => setLocationTab("map_picker")}
                        className={`py-1.5 px-1 rounded-lg text-[9px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          locationTab === "map_picker"
                            ? "bg-white text-neutral-850 shadow-xs"
                            : "text-neutral-500 hover:text-neutral-700"
                        }`}
                      >
                        🗺️ Tap Map
                      </button>
                    </div>

                    {/* TAB CONTENT: GOOGLE MAPS SEARCH */}
                    {locationTab === "google" && (
                      <div className="space-y-2 animate-fadeIn">
                        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-150 shadow-xs">
                          <Search className="w-3.5 h-3.5 text-[#FFC107] shrink-0" />
                          <input
                            type="text"
                            placeholder="Search location via Google Maps API..."
                            value={googleSearchQuery}
                            onChange={(e) => setGoogleSearchQuery(e.target.value)}
                            className="bg-transparent text-xs outline-none w-full font-bold text-neutral-800"
                          />
                          {googleSearchQuery && (
                            <button
                              onClick={() => setGoogleSearchQuery("")}
                              className="text-neutral-400 hover:text-neutral-600 text-[10px] font-bold"
                            >
                              Clear
                            </button>
                          )}
                        </div>

                        {/* Active Indicator Helper Badging */}
                        <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-[9px] text-neutral-800 font-bold flex items-center justify-between">
                          <span>
                            👉 Tapping suggestions will populate your <span className="uppercase underline text-neutral-900 font-black">{activeFieldSelector}</span> line.
                          </span>
                          <button
                            onClick={() => setActiveFieldSelector(activeFieldSelector === "pickup" ? "drop" : "pickup")}
                            className="bg-neutral-900 text-white hover:bg-neutral-800 text-[7.5px] font-black uppercase px-2 py-0.5 rounded"
                          >
                            Switch Input
                          </button>
                        </div>

                        <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest pl-1">
                          Google Maps Autocomplete Results
                        </p>

                        <div className="flex flex-col gap-1.5">
                          {[
                            { name: "Madhubani Junction, Railway Station Chowk, Bihar", type: "station" },
                            { name: "Jaynagar Town Market, Near Indo-Nepal Border", type: "market" },
                            { name: "Darbhanga Regional Airport Complex, Bihar", type: "airport" },
                            { name: "Rajnagar Royal Palace Grounds, Ancient Fort, Bihar", type: "historical" },
                            { name: "Benipatti Main Road Bazaar, Madhubani", type: "market" },
                            { name: "Pandaul Industrial Area Hub, Madhubani", type: "commercial" },
                            { name: "Jhanjharpur Bus স্ট্যান্ড & Cross Junction, Bihar", type: "bus" },
                            { name: "Laukaha Custom Border Patrol & Bazar", type: "border" },
                            { name: "Phulparas Block Intersection High Road", type: "highway" },
                            { name: "Babubarhi Chowk Central Market, Bihar", type: "market" },
                            { name: "Khajauli Market Terminal & Cross", type: "station" },
                          ]
                            .filter((place) =>
                              place.name.toLowerCase().includes(googleSearchQuery.toLowerCase())
                            )
                            .map((place, idx) => (
                              <div
                                key={`google-place-${idx}`}
                                className={`p-2.5 bg-white border rounded-xl hover:bg-slate-50 transition-all flex items-center justify-between shadow-xxs cursor-pointer ${
                                  activeFieldSelector === "pickup"
                                    ? "hover:border-emerald-300"
                                    : "hover:border-amber-300"
                                }`}
                                onClick={() => {
                                  if (activeFieldSelector === "pickup") {
                                    setPickupAddress(place.name);
                                    setCustomDistance(Math.round(5 + Math.random() * 20));
                                    setCustomDuration(Math.round(12 + Math.random() * 35));
                                    triggerNotification(`🟢 Pickup set: ${place.name.split(",")[0]}`);
                                  } else {
                                    setDestinationAddress(place.name);
                                    setCustomDistance(Math.round(5 + Math.random() * 20));
                                    setCustomDuration(Math.round(12 + Math.random() * 35));
                                    triggerNotification(`🟡 Destination set: ${place.name.split(",")[0]}`);
                                    setCurrentScreen(ScreenId.VEHICLE_SELECT);
                                  }
                                }}
                              >
                                <div className="min-w-0 flex-1 pr-2 text-left">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px]">
                                      {place.type === "station" ? "🚂" : place.type === "airport" ? "🛫" : place.type === "historical" ? "🏰" : "📍"}
                                    </span>
                                    <p className="text-xs font-black text-neutral-800 leading-tight truncate">
                                      {place.name.split(",")[0]}
                                    </p>
                                  </div>
                                  <p className="text-[9px] text-neutral-450 truncate mt-0.5 pl-4">
                                    {place.name}
                                  </p>
                                </div>
                                <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => {
                                      setPickupAddress(place.name);
                                      setCustomDistance(Math.round(5 + Math.random() * 20));
                                      setCustomDuration(Math.round(12 + Math.random() * 35));
                                      triggerNotification(`🟢 Pickup set: ${place.name.split(",")[0]}`);
                                    }}
                                    className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 text-emerald-800 text-[8px] font-extrabold px-1.5 py-1 rounded cursor-pointer transition-colors"
                                  >
                                    As Pickup
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDestinationAddress(place.name);
                                      setCustomDistance(Math.round(5 + Math.random() * 20));
                                      setCustomDuration(Math.round(12 + Math.random() * 35));
                                      triggerNotification(`🟡 Destination set: ${place.name.split(",")[0]}`);
                                      setCurrentScreen(ScreenId.VEHICLE_SELECT);
                                    }}
                                    className="bg-amber-50 hover:bg-amber-100 border border-amber-150 text-amber-800 text-[8px] font-extrabold px-1.5 py-1 rounded cursor-pointer transition-colors"
                                  >
                                    As Drop
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* TAB CONTENT: LOCAL AREA PICKER */}
                    {locationTab === "local" && (
                      <div className="space-y-2 animate-fadeIn">
                        {/* Active Indicator Helper Badging */}
                        <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-[9px] text-neutral-800 font-bold flex items-center justify-between">
                          <span>
                            👉 Tapping suggestions will populate your <span className="uppercase underline text-neutral-900 font-black">{activeFieldSelector}</span> line.
                          </span>
                          <button
                            onClick={() => setActiveFieldSelector(activeFieldSelector === "pickup" ? "drop" : "pickup")}
                            className="bg-neutral-900 text-white hover:bg-neutral-800 text-[7.5px] font-black uppercase px-2 py-0.5 rounded cursor-pointer"
                          >
                            Switch Input
                          </button>
                        </div>

                        {/* Search Input Box */}
                        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-150 shadow-xs">
                          <Search className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <input
                            type="text"
                            placeholder="Type to search within Local Area Sectors..."
                            value={localSearchQuery}
                            onChange={(e) => setLocalSearchQuery(e.target.value)}
                            className="bg-transparent text-xs outline-none w-full font-bold text-neutral-800"
                          />
                          {localSearchQuery && (
                            <button
                              onClick={() => setLocalSearchQuery("")}
                              className="text-neutral-400 hover:text-neutral-600 text-[10px] font-bold"
                            >
                              Clear
                            </button>
                          )}
                        </div>

                        <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest pl-1 leading-none mb-1">
                          Popular Local Sectors in District
                        </p>
                        <div className="grid grid-cols-1 gap-1.5">
                          {[
                            { name: "Jaynagar Local Sector 2", desc: "Main Market & Railway Chowk area", baseDist: 15.0 },
                            { name: "Rajnagar Fort Hub", desc: "Near Royal Palace grounds", baseDist: 18.5 },
                            { name: "Madhubani City Hospital Zone", desc: "Sadar Hospital cross road", baseDist: 34.0 },
                            { name: "Sakri Factory Colony", desc: "Industrial zone and junction", baseDist: 12.2 },
                            { name: "Benipatti Main crossing", desc: "Madhubani outer boundary", baseDist: 22.8 },
                            { name: "Pandaul Bazar Square", desc: "Industrial park complex", baseDist: 9.4 },
                            { name: "Babubarhi Central Market", desc: "Local block headquarters", baseDist: 16.0 },
                          ]
                            .filter((area) =>
                              area.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
                              area.desc.toLowerCase().includes(localSearchQuery.toLowerCase())
                            )
                            .map((area, index) => (
                              <div
                                key={`local-area-${index}`}
                                className={`p-2.5 bg-white border rounded-xl hover:bg-slate-50 transition-all flex items-center justify-between shadow-xxs text-left cursor-pointer ${
                                  activeFieldSelector === "pickup"
                                    ? "hover:border-emerald-300"
                                    : "hover:border-amber-300"
                                }`}
                                onClick={() => {
                                  if (activeFieldSelector === "pickup") {
                                    setPickupAddress(area.name);
                                    setCustomDistance(area.baseDist);
                                    setCustomDuration(Math.round(area.baseDist * 1.8));
                                    triggerNotification(`🟢 Pickup set to ${area.name}`);
                                  } else {
                                    setDestinationAddress(area.name);
                                    setCustomDistance(area.baseDist);
                                    setCustomDuration(Math.round(area.baseDist * 1.8));
                                    triggerNotification(`🟡 Drop set to ${area.name}`);
                                    setCurrentScreen(ScreenId.VEHICLE_SELECT);
                                  }
                                }}
                              >
                                <div className="min-w-0 pr-2">
                                  <h5 className="text-xs font-black text-[#111111] leading-tight flex items-center gap-1">
                                    <span>📍</span>
                                    <span>{area.name}</span>
                                  </h5>
                                  <p className="text-[9px] text-neutral-400 mt-0.5 truncate leading-none pl-4">
                                    {area.desc}
                                  </p>
                                </div>
                                <div className="flex gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => {
                                      setPickupAddress(area.name);
                                      setCustomDistance(area.baseDist);
                                      setCustomDuration(Math.round(area.baseDist * 1.8));
                                      triggerNotification(`🟢 Pickup set to ${area.name}`);
                                    }}
                                    className="bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 text-[8px] font-extrabold px-2 py-1 rounded-lg border border-emerald-100 cursor-pointer transition-colors"
                                  >
                                    Pickup
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDestinationAddress(area.name);
                                      setCustomDistance(area.baseDist);
                                      setCustomDuration(Math.round(area.baseDist * 1.8));
                                      triggerNotification(`🟡 Drop set to ${area.name}`);
                                      setCurrentScreen(ScreenId.VEHICLE_SELECT);
                                    }}
                                    className="bg-[#111111] text-[#FFC107] hover:bg-neutral-800 text-[8px] font-extrabold px-2 py-1 rounded-lg cursor-pointer transition-colors"
                                  >
                                    Drop
                                  </button>
                                </div>
                              </div>
                            ))}
                          {localSearchQuery !== "" &&
                            [
                              { name: "Jaynagar Local Sector 2", desc: "Main Market & Railway Chowk area", baseDist: 15.0 },
                              { name: "Rajnagar Fort Hub", desc: "Near Royal Palace grounds", baseDist: 18.5 },
                              { name: "Madhubani City Hospital Zone", desc: "Sadar Hospital cross road", baseDist: 34.0 },
                              { name: "Sakri Factory Colony", desc: "Industrial zone and junction", baseDist: 12.2 },
                              { name: "Benipatti Main crossing", desc: "Madhubani outer boundary", baseDist: 22.8 },
                              { name: "Pandaul Bazar Square", desc: "Industrial park complex", baseDist: 9.4 },
                              { name: "Babubarhi Central Market", desc: "Local block headquarters", baseDist: 16.0 },
                            ].filter((area) =>
                              area.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
                              area.desc.toLowerCase().includes(localSearchQuery.toLowerCase())
                            ).length === 0 && (
                              <div className="p-4 bg-white rounded-2xl border border-dashed border-slate-200 text-center text-[10px] text-neutral-400 font-bold">
                                🔍 No matching local locations found. Try entering are code or landmark!
                              </div>
                            )}
                        </div>
                      </div>
                    )}

                    {/* TAB CONTENT: INTERACTIVE koordinat MAP PICKER */}
                    {locationTab === "map_picker" && (
                      <div className="space-y-2 animate-fadeIn text-center">
                        <div className="flex items-center justify-between px-1 mb-1">
                          <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest pl-1">
                            Geocode Map Interactive Picker
                          </p>
                          <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                            <button
                              onClick={() => {
                                setMapPickMode("pickup");
                                setActiveFieldSelector("pickup");
                              }}
                              className={`text-[7.5px] font-extrabold px-2 py-0.5 rounded transition-all cursor-pointer ${
                                mapPickMode === "pickup"
                                  ? "bg-emerald-600 text-white shadow-xxs"
                                  : "text-neutral-500"
                              }`}
                            >
                              Pickup Mode
                            </button>
                            <button
                              onClick={() => {
                                setMapPickMode("drop");
                                setActiveFieldSelector("drop");
                              }}
                              className={`text-[7.5px] font-extrabold px-2 py-0.5 rounded transition-all cursor-pointer ${
                                mapPickMode === "drop"
                                  ? "bg-amber-500 text-neutral-900 shadow-xxs"
                                  : "text-neutral-500"
                              }`}
                            >
                              Drop Mode
                            </button>
                          </div>
                        </div>

                        {/* Interactive mini-map container */}
                        <div
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const clickX = Math.round(e.clientX - rect.left);
                            const clickY = Math.round(e.clientY - rect.top);
                            // Generate customized local address
                            const gridId = `GP-${clickX}-${clickY}`;
                            const mockAddr = `${mapPickMode === "pickup" ? "Pickup Spot" : "Drop Destination"} near Grid Area ${gridId}, Madhubani Highway (Bihar Line)`;
                            
                            if (mapPickMode === "pickup") {
                              setPickupAddress(mockAddr);
                              setActiveFieldSelector("pickup");
                              triggerNotification(`🟢 Pin dropped: Set Pickup to Grid Spot ${gridId}`);
                            } else {
                              setDestinationAddress(mockAddr);
                              setActiveFieldSelector("drop");
                              triggerNotification(`🟡 Pin dropped: Set Drop to Grid Spot ${gridId}`);
                            }
                            
                            // Randomize a corresponding route distance
                            setCustomDistance(Math.round(4.5 + Math.random() * 22));
                            setCustomDuration(Math.round(9 + Math.random() * 40));
                          }}
                          className="h-[140px] w-full rounded-2xl overflow-hidden relative border border-slate-200 shadow-sm cursor-crosshair group"
                        >
                          <div className="absolute inset-0 pointer-events-none scale-105">
                            <SimulatedMap
                              pickupName={pickupAddress}
                              destinationName={destinationAddress}
                              rideProgress={0}
                              driverAssigned={false}
                              activePresetIndex={activePresetIndex}
                            />
                          </div>

                          {/* Pulsing indicator */}
                          <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none group-hover:bg-black/0 transition-colors">
                            <span className="bg-[#111111]/90 text-white text-[8px] font-bold px-2 py-1 rounded-md tracking-wider shadow-md">
                              Tap Anywhere on Map to Drop Pin
                            </span>
                          </div>
                        </div>

                        <div className="bg-white p-2.5 rounded-xl border border-dashed border-neutral-200 text-left text-[9px] text-neutral-500">
                          <p className="font-semibold text-neutral-800 flex items-center gap-1">
                            <span>💡</span> Quick Map Tip
                          </p>
                          <p className="mt-0.5">
                            Switch toggle above to set either the pickup or the drop point, and click on any street road coordinates inside the live interactive simulator grid preview to geocode coordinates!
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Saved Locations Favorites Shortcut */}
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest pl-1.5 mb-2">
                        SAVED FAVORITES
                      </p>
                      <div className="flex flex-col gap-2 mb-4">
                        {SAVED_LOCATIONS.map((loc) => (
                          <div
                            key={loc.id}
                            onClick={() => {
                              setDestinationAddress(loc.address);
                              setCustomDistance(15.0);
                              setCustomDuration(26);
                              setCurrentScreen(ScreenId.VEHICLE_SELECT);
                              triggerNotification(`📍 Saved Spot applied: ${loc.label}`);
                            }}
                            className="p-3 bg-white hover:bg-slate-100/50 border border-slate-100 rounded-2xl cursor-pointer transition-all flex items-center justify-between shadow-xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-base shrink-0">
                                {loc.type === "home" ? "🏠" : loc.type === "work" ? "🏢" : "📍"}
                              </span>
                              <div className="min-w-0 pr-2 text-left">
                                <p className="text-xs font-black text-neutral-800 leading-tight">{loc.label}</p>
                                <p className="text-[9px] text-neutral-450 truncate mt-0.5">{loc.address}</p>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-neutral-300 shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* === SCREEN 6: VEHICLE SELECTION === */}
              {currentScreen === ScreenId.VEHICLE_SELECT && (
                <div className="flex-1 flex flex-col bg-slate-50 h-full relative" id="screen-vehicle-select">
                  {/* Floating Action Back Button */}
                  <button
                    onClick={() => setCurrentScreen(ScreenId.PICK_SPOT)}
                    className="absolute top-3 left-3 z-30 bg-white/95 text-neutral-800 px-3 py-1.5 rounded-full text-[10px] font-bold hover:bg-slate-100 border border-slate-150 transition-all cursor-pointer shadow-md flex items-center gap-1 active:scale-95"
                  >
                    ← Edit Route
                  </button>

                  {/* Half-Map View for dynamic layout rendering */}
                  <div className="h-[200px] w-full shrink-0 border-b border-slate-100 relative">
                    <SimulatedMap
                      pickupName={pickupAddress}
                      destinationName={destinationAddress}
                      rideProgress={0}
                      driverAssigned={false}
                      activePresetIndex={activePresetIndex}
                    />
                    <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] text-white">
                      🗺️ Bihar Route Preview
                    </div>
                  </div>

                  {/* Vehicle slide-sheet Container */}
                  <div className="flex-1 bg-white p-4 rounded-t-[32px] -mt-4 z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] border-t border-slate-100 flex flex-col justify-between overflow-hidden">
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                          SELECT RIDE DISPATCH FLEET
                        </h4>
                        <span className="text-[10px] font-mono text-[#FFC107] bg-yellow-50 px-2 py-0.5 rounded-lg border border-yellow-100 font-bold">
                          {tripDistance} Km Total
                        </span>
                      </div>

                      {/* Flex categories scrollable */}
                      <div className="flex-1 overflow-y-auto phone-scroll text-left flex flex-col gap-2 pr-1">
                        {VEHICLES.map((veh) => {
                          const isSelected = selectedVehicleId === veh.id;
                          const rateFactor = tripDistance;
                          const standardFare = Math.round(veh.farePerKm * rateFactor);
                          
                          return (
                            <div
                              key={veh.id}
                              onClick={() => {
                                setSelectedVehicleId(veh.id);
                                triggerNotification(`🚗 Selected ${veh.name}. Rate ₹${veh.farePerKm}/km`);
                              }}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? "bg-[#111111] text-white border-[#111111] shadow-md scale-[1.02]"
                                  : "bg-slate-50 border-slate-100 text-neutral-700 hover:bg-slate-100/50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`text-2xl select-none p-1.5 rounded-xl ${isSelected ? "bg-white/10" : "bg-white"}`}>{veh.icon}</span>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h5 className={`text-xs font-black truncate ${isSelected ? "text-white" : "text-neutral-800"}`}>{veh.name}</h5>
                                    {veh.popular && (
                                      <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${
                                        isSelected ? "bg-[#FFC107] text-[#111111]" : "bg-amber-100 text-amber-800"
                                      }`}>
                                        Best Option
                                      </span>
                                    )}
                                  </div>
                                  <p className={`text-[9px] mt-0.5 leading-tight ${isSelected ? "text-neutral-400" : "text-neutral-500"}`}>
                                    👤 Up to {veh.capacity} • {veh.description.split("rides")[0]}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <p className={`text-xs font-mono font-black ${isSelected ? "text-[#FFC107]" : "text-[#111111]"}`}>
                                  ₹{standardFare}
                                </p>
                                <p className={`text-[8px] font-bold ${isSelected ? "text-amber-300" : "text-emerald-600"}`}>
                                  ETA: {veh.eta} Min
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 mt-2">
                      <button
                        onClick={() => setCurrentScreen(ScreenId.FARE_ESTIMATE)}
                        className="w-full bg-[#111111] text-white hover:bg-neutral-800 text-xs font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg uppercase tracking-wider cursor-pointer"
                      >
                        <span>Price Calculation</span>
                        <ArrowRight className="w-4 h-4 text-[#FFC107]" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* === SCREEN 7: FARE ESTIMATION === */}
              {currentScreen === ScreenId.FARE_ESTIMATE && (
                <div className="flex-1 flex flex-col bg-slate-50 text-neutral-850 justify-between h-full" id="screen-fare-estimate">
                  <div className="p-4 flex-1 overflow-y-auto phone-scroll">
                    {/* Header bar */}
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2.5">
                      <button
                        onClick={() => setCurrentScreen(ScreenId.VEHICLE_SELECT)}
                        className="text-xs text-neutral-600 hover:text-neutral-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        ← Change Cab
                      </button>
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                        O2 Fare Estimate
                      </span>
                    </div>

                    {/* Breakdown Slip Card */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="text-center pb-4 border-b border-dashed border-slate-100">
                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">SELECTED CAB DISPATCH</span>
                        <div className="flex items-center justify-center gap-2.5 mt-2">
                          <span className="text-2xl p-1.5 rounded-xl bg-slate-50 select-none">{currentSelectedVehicle.icon}</span>
                          <div className="text-left">
                            <h4 className="text-xs font-black text-neutral-800 leading-none">{currentSelectedVehicle.name}</h4>
                            <p className="text-[9px] text-neutral-400 mt-0.5 font-mono">{tripDistance} Km ride</p>
                          </div>
                        </div>
                      </div>

                      {/* Receipt Matrix */}
                      <div className="flex flex-col gap-3 mt-4">
                        <div className="flex justify-between text-xs text-neutral-600">
                          <span className="font-bold">Base taxi fare (₹{currentSelectedVehicle.farePerKm}/km)</span>
                          <span className="font-mono text-neutral-800 font-bold">₹{calculatedBaseFare}.00</span>
                        </div>
                        <div className="flex justify-between text-xs text-neutral-600">
                          <span>CGST state taxes / Toll Fee</span>
                          <span className="font-mono text-neutral-800 font-semibold">₹30.00</span>
                        </div>
                        {appliedCoupon && (
                          <div className="flex justify-between text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200/50">
                            <span className="font-black">Promo Applied ({appliedCoupon.code})</span>
                            <span className="font-mono font-bold">
                              -{appliedCoupon.discountValue < 1 ? `${appliedCoupon.discountValue * 100}%` : `₹${appliedCoupon.discountValue}`}
                            </span>
                          </div>
                        )}
                        <div className="h-px bg-slate-100 my-1" />
                        <div className="flex justify-between items-center text-neutral-850">
                          <span className="text-xs font-black uppercase tracking-wider text-neutral-600">Estimated Payable</span>
                          <span className="text-lg font-mono font-black text-neutral-850">
                            ₹{finalRideFare}.00
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Offers & Promo Slider */}
                    <div className="mt-4 bg-white p-3.5 rounded-2xl border border-slate-150/60 shadow-xs">
                      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-50">
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                          COUPONS FOR {userName}
                        </span>
                        <button
                          onClick={() => setCurrentScreen(ScreenId.OFFERS_COUPONS)}
                          className="text-[#FFC107] text-[10px] font-bold hover:underline"
                        >
                          Show ({ACTIVE_OFFERS.length})
                        </button>
                      </div>

                      {appliedCoupon ? (
                        <div className="flex items-center justify-between bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                          <div className="min-w-0 text-left">
                            <p className="text-[11px] font-mono font-black text-[#FFC107] uppercase">✓ coupon {appliedCoupon.code} active</p>
                            <p className="text-[9px] text-neutral-500 truncate mt-0.5">{appliedCoupon.description}</p>
                          </div>
                          <button
                            onClick={() => {
                              setAppliedCoupon(null);
                              triggerNotification("Coupon code removed.");
                            }}
                            className="text-red-500 hover:text-red-600 text-[10px] font-black ml-2"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => setCurrentScreen(ScreenId.OFFERS_COUPONS)}
                          className="p-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-150 border-dashed rounded-xl cursor-pointer text-center text-[11px] text-neutral-500 font-bold transition-all"
                        >
                          🎟️ Choose a code to save on this ride
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment gateway checklist */}
                  <div className="p-4 bg-white border-t border-slate-150/60 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
                    {/* Select Payment Method */}
                    <div className="mb-3.5">
                      <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block text-left mb-1.5 pl-0.5">
                        Select Payment Method
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          onClick={() => {
                            setPaymentMethod("online");
                            triggerNotification("💳 Selected online payment route.");
                          }}
                          className={`py-2.5 px-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            paymentMethod === "online"
                              ? "border-[#FFC107] bg-amber-50/40 text-neutral-850 font-black shadow-xs"
                              : "border-slate-100 bg-slate-50/50 text-neutral-500 hover:bg-slate-50 font-bold"
                          }`}
                        >
                          <CreditCard className={`w-3.5 h-3.5 ${paymentMethod === "online" ? "text-amber-500" : "text-neutral-400"}`} />
                          <span className="text-[9.5px]">Online Pay</span>
                        </button>
                        <button
                          onClick={() => {
                            setPaymentMethod("cash");
                            triggerNotification("💵 Selected direct cash payment.");
                          }}
                          className={`py-2.5 px-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            paymentMethod === "cash"
                              ? "border-[#FFC107] bg-amber-50/40 text-neutral-850 font-black shadow-xs"
                              : "border-slate-100 bg-slate-50/50 text-neutral-500 hover:bg-slate-50 font-bold"
                          }`}
                        >
                          <Banknote className={`w-3.5 h-3.5 ${paymentMethod === "cash" ? "text-amber-500" : "text-neutral-400"}`} />
                          <span className="text-[9.5px]">Cash</span>
                        </button>
                        <button
                          onClick={() => {
                            setPaymentMethod("wallet");
                            triggerNotification("👛 Selected O2 wallet balance.");
                          }}
                          className={`py-2.5 px-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            paymentMethod === "wallet"
                              ? "border-[#FFC107] bg-amber-50/40 text-neutral-850 font-black shadow-xs"
                              : "border-slate-100 bg-slate-50/50 text-neutral-500 hover:bg-slate-50 font-bold"
                          }`}
                        >
                          <Wallet className={`w-3.5 h-3.5 ${paymentMethod === "wallet" ? "text-amber-500" : "text-neutral-400"}`} />
                          <span className="text-[9.5px]">O2 Wallet</span>
                        </button>
                      </div>
                    </div>

                    {paymentMethod === "wallet" && (
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between mb-3 text-xs select-none">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-[#FFC107]" />
                          <span className="text-neutral-500 font-bold">O2 Wallet Balance:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-800 font-black font-mono">
                            ₹{walletBalance}
                          </span>
                          {walletBalance < finalRideFare && (
                            <button
                              onClick={() => {
                                setWalletBalance((prev) => prev + 1000);
                                triggerNotification("💸 Elite Fast Top-up! Added ₹1000 into your O2 Wallet.");
                              }}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-extrabold px-2 py-1 rounded"
                            >
                              + ₹1000
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {paymentMethod === "online" && (
                      <div className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex items-center justify-between mb-3 text-xs select-none">
                        <div className="flex items-center gap-2 text-emerald-800">
                          <CreditCard className="w-4 h-4 text-emerald-500" />
                          <span className="font-bold text-[11px]">Pay safe via PhonePe / GPay / Cards</span>
                        </div>
                        <span className="text-[8px] font-extrabold bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase">
                          Ready
                        </span>
                      </div>
                    )}

                    {paymentMethod === "cash" && (
                      <div className="p-2.5 bg-amber-50/70 border border-amber-200/40 rounded-2xl flex items-center justify-between mb-3 text-xs select-none">
                        <div className="flex items-center gap-2 text-amber-900">
                          <Banknote className="w-4 h-4 text-amber-500" />
                          <span className="font-bold text-[11px]">Pay cash to rider after trip</span>
                        </div>
                        <span className="text-[8px] font-extrabold bg-amber-500 text-white px-1.5 py-0.5 rounded uppercase">
                          No wallet required
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        if (paymentMethod === "wallet") {
                          if (walletBalance < finalRideFare) {
                            triggerNotification("⚠️ Insufficient wallet balance. Click the +₹1000 fast top-up button above first!");
                            return;
                          }
                          // Subtract balance simulated
                          setWalletBalance((prev) => prev - finalRideFare);
                          // Add txn log
                          const addTxn = {
                            id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
                            type: "debit" as const,
                            amount: finalRideFare,
                            description: `O2 Ride Payment - ${destinationAddress.split(",")[0]}`,
                            date: "Just now"
                          };
                          setTransactions([addTxn, ...transactions]);
                          triggerNotification(`💸 Prepaid: Deducted ₹${finalRideFare} from O2 Wallet.`);
                        } else if (paymentMethod === "online") {
                          triggerNotification(`💳 Prepaid: Paid ₹${finalRideFare} securely via Online Payment!`);
                        } else if (paymentMethod === "cash") {
                          triggerNotification(`💵 Cash setup: Please pay ₹${finalRideFare} in cash directly to your pilot.`);
                        }

                        setCurrentScreen(ScreenId.SEARCH_DRIVER);
                        triggerNotification("🛰 Dispatching satellite. Pinpointing pilots nearby...");
                      }}
                      className="w-full bg-[#111111] text-white hover:bg-neutral-800 text-xs font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg uppercase tracking-wider cursor-pointer"
                    >
                      <span>Book Cab & Dispatch</span>
                      <ArrowRight className="w-4 h-4 text-[#FFC107]" />
                    </button>
                  </div>
                </div>
              )}

              {/* === SCREEN 8: SEARCHING DRIVER === */}
              {currentScreen === ScreenId.SEARCH_DRIVER && (
                <div className="flex-1 flex flex-col bg-slate-50 text-neutral-800 justify-between text-center h-full relative overflow-hidden" id="screen-search-driver">
                  {/* Glowing Radar Background */}
                  <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-100/40 via-slate-50 to-slate-50 opacity-90" />

                  <div className="z-10 mt-6 px-4">
                    <span className="bg-amber-100 text-amber-850 text-[9px] font-black tracking-widest px-3 py-1 rounded-full uppercase border border-amber-200/50">
                      Dispatched Satellites
                    </span>
                    <h2 className="text-xl font-black text-[#111111] tracking-tight mt-3">
                      Finding O2 Pilots
                    </h2>
                    <p className="text-neutral-500 text-xs mt-1">
                      Broadcasting your ride proposal to nearby certified {currentSelectedVehicle.name} models...
                    </p>
                  </div>

                  {/* Pulsing Core Radar Graphic */}
                  <div className="z-10 relative my-4 aspect-square max-w-[150px] w-full mx-auto flex items-center justify-center">
                    <span className="absolute w-36 h-36 rounded-full border-2 border-[#FFC107]/20 animate-ping" />
                    <span className="absolute w-28 h-28 rounded-full border border-slate-200" />
                    <span className="absolute w-16 h-16 rounded-full border-2 border-emerald-500/10 animate-pulse" />
                    
                    {/* Ring Indicator */}
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-800 shadow-md border border-slate-100 z-20">
                      <span className="text-2xl animate-bounce select-none">{currentSelectedVehicle.icon}</span>
                    </div>
                  </div>

                  <div className="z-10 px-4 pb-6">
                    <p className="text-[10px] font-mono text-emerald-600 font-bold animate-pulse">
                      ⚡ Connecting with nearby pilots...
                    </p>
                    
                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        onClick={() => {
                          const selectedDriver = SAMPLE_DRIVERS[0]; // Rajesh Kumar
                          setCurrentDriver(selectedDriver);
                          setDriverStatus("heading_to_pickup");
                          setCurrentScreen(ScreenId.DRIVER_ASSIGNED);
                          triggerNotification(`✅ Pilot connected: ${selectedDriver.name}`);
                        }}
                        className="bg-[#111111] text-white hover:bg-neutral-800 text-xs font-black py-3 rounded-xl uppercase tracking-wider cursor-pointer"
                      >
                        Simulate Driver Contact
                      </button>

                      <button
                        onClick={() => {
                          setCurrentScreen(ScreenId.HOME);
                          triggerNotification("Booking cancelled successfully.");
                        }}
                        className="bg-white hover:bg-slate-50 border border-slate-200 text-neutral-500 text-[10px] py-1.5 rounded-xl cursor-pointer font-bold"
                      >
                        Cancel Dispatch
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* === SCREEN 9: DRIVER ASSIGNED === */}
              {currentScreen === ScreenId.DRIVER_ASSIGNED && currentDriver && (
                <div className="flex-1 flex flex-col bg-slate-50 h-full relative" id="screen-driver-assigned">
                  {/* Mini-Map header */}
                  <div className="h-[200px] w-full shrink-0 border-b border-slate-100">
                    <SimulatedMap
                      pickupName={pickupAddress}
                      destinationName={destinationAddress}
                      rideProgress={0}
                      driverAssigned={true}
                      driverStatus={driverStatus}
                      vehicleEmoji={currentSelectedVehicle.icon}
                      activePresetIndex={activePresetIndex}
                    />
                  </div>

                  {/* Matched Driver Plate sheet */}
                  <div className="flex-1 bg-white p-4 rounded-t-[32px] -mt-4 z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] border-t border-slate-100 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <div className="text-left">
                          <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100 uppercase tracking-widest leading-none">
                            PILOT ASSIGNED
                          </span>
                          <h4 className="text-xs font-black text-neutral-800 mt-1.5 leading-none">
                            Arriving in 3 Mins
                          </h4>
                        </div>
                        <span className="text-xs font-black bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-[#FFC107] font-mono tracking-wider shadow-inner">
                          {currentDriver.vehicleNo}
                        </span>
                      </div>

                      {/* Driver Metadata */}
                      <div className="flex items-center gap-3 mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <img
                          src={currentDriver.avatar}
                          alt="Pilot"
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-[#FFC107] shrink-0 shadow"
                        />
                        <div className="min-w-0 flex-1 text-left">
                          <h5 className="text-xs font-black text-[#111111] tracking-tight flex items-center gap-1.5">
                            {currentDriver.name}
                            <span className="bg-amber-100 text-amber-850 text-[8px] font-black px-1.5 py-0.2 rounded flex items-center gap-0.5">
                              ★ {currentDriver.rating}
                            </span>
                          </h5>
                          <p className="text-[10px] text-neutral-400 mt-0.5">
                            {currentDriver.vehicleModel} • Platinum Pilot
                          </p>
                        </div>
                      </div>

                      {/* Communications Grid */}
                      <div className="grid grid-cols-2 gap-2.5 mt-3.5">
                        <button
                          onClick={() => {
                            setShowCallModal(true);
                            triggerNotification(`Dialing driver ${currentDriver.name}...`);
                          }}
                          className="bg-slate-50 hover:bg-slate-100 border border-slate-150 p-3 rounded-xl text-xs font-black text-[#111111] flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                          <span>Call Driver</span>
                        </button>

                        <button
                          onClick={() => {
                            setCurrentScreen(ScreenId.LIVE_TRACKING);
                            triggerNotification("🛰 O2 Live Tracking: Synthesizing real-time pilot route coordinates.");
                          }}
                          className="bg-slate-50 hover:bg-slate-100 border border-slate-150 p-3 rounded-xl text-xs font-black text-[#111111] flex items-center justify-center gap-2 transition-all cursor-pointer border-[#FFC107]/60"
                        >
                          <Navigation className="w-3.5 h-3.5 text-amber-500 fill-amber-100" />
                          <span>O2 Track Live Driver</span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setCurrentScreen(ScreenId.LIVE_TRACKING);
                          triggerNotification("🛰 Syncing coordinates tracker. Pilot is here!");
                        }}
                        className="w-full bg-[#111111] text-white hover:bg-neutral-800 text-xs font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg uppercase tracking-wider cursor-pointer"
                      >
                        <span>Confirm Pilot Arrival</span>
                        <ArrowRight className="w-4 h-4 text-[#FFC107]" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* === SCREEN 10: LIVE RIDE TRACKING === */}
              {currentScreen === ScreenId.LIVE_TRACKING && currentDriver && (
                <div className="flex-1 flex flex-col bg-slate-50 h-full relative" id="screen-live-tracking">
                  {/* Core Map */}
                  <div className="h-[200px] w-full shrink-0 border-b border-slate-100">
                    <SimulatedMap
                      pickupName={pickupAddress}
                      destinationName={destinationAddress}
                      rideProgress={10}
                      driverAssigned={true}
                      driverStatus="heading_to_pickup"
                      vehicleEmoji={currentSelectedVehicle.icon}
                      activePresetIndex={activePresetIndex}
                    />
                  </div>

                  {/* Panel Details */}
                  <div className="flex-1 bg-white p-4 rounded-t-[32px] -mt-4 z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] border-t border-slate-100 flex flex-col justify-between">
                    <div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150/65 text-left">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">SECURE START CODE</span>
                          <span className="bg-[#FFC107]/10 text-amber-850 text-[9px] font-black px-2 py-0.5 rounded-lg border border-[#FFC107]/20">
                            REQUIRED
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2.5">
                          <div>
                            <p className="text-[10px] text-neutral-400">Share with O2 Pilot:</p>
                            <p className="text-sm font-mono font-bold text-neutral-800 tracking-widest">4 4 0 2</p>
                          </div>
                          
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText("https://o2cabs.my/track/DL3CAY4820");
                              triggerNotification("🚀 Secure ride sharing coordinates copied!");
                            }}
                            className="bg-white hover:bg-slate-50 border border-slate-150 text-[9px] font-black px-2.5 py-1.5 rounded-lg text-[#111111] flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-transform"
                          >
                            <Share2 className="w-3 h-3 text-[#FFC107]" />
                            <span>Share ETA</span>
                          </button>
                        </div>
                      </div>

                      {/* Fast template chat prompts */}
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest text-left pl-1 mt-4 mb-2">QUICK CHAT PHRASES</p>
                      <div className="flex gap-2 overflow-x-auto pb-2.5 phone-scroll">
                        {CHAT_TEMPLATES.slice(0, 3).map((promptText, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              handleSendChatMessage(promptText);
                              setShowChatModal(true);
                              triggerNotification(`Sent: "${promptText}"`);
                            }}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-150 text-[9px] font-semibold py-1.5 px-3 rounded-full text-neutral-700 whitespace-nowrap cursor-pointer transition-colors shrink-0"
                          >
                            {promptText}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setDriverStatus("ongoing");
                          setCurrentScreen(ScreenId.RIDE_IN_PROGRESS);
                          setRideElapsedPercent(0);
                          triggerNotification("🚀 Secure Code Verified! Commencing your daily O2 ride.");
                        }}
                        className="w-full bg-[#111111] text-white hover:bg-neutral-800 text-xs font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg uppercase tracking-wider cursor-pointer"
                      >
                        <span>Board Cab & Start Ride</span>
                        <Check className="w-4 h-4 text-[#FFC107]" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* === SCREEN 11: RIDE IN PROGRESS === */}
              {currentScreen === ScreenId.RIDE_IN_PROGRESS && currentDriver && (
                <div className="flex-1 flex flex-col bg-slate-50 h-full relative" id="screen-ride-in-progress">
                  {/* Continuous telemetry Map view */}
                  <div className="h-[200px] w-full shrink-0 border-b border-slate-100">
                    <SimulatedMap
                      pickupName={pickupAddress}
                      destinationName={destinationAddress}
                      rideProgress={rideElapsedPercent}
                      driverAssigned={true}
                      driverStatus="ongoing"
                      vehicleEmoji={currentSelectedVehicle.icon}
                      activePresetIndex={activePresetIndex}
                    />
                  </div>

                  {/* Safety & status console container */}
                  <div className="flex-1 bg-white p-4 rounded-t-[32px] -mt-4 z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] border-t border-slate-100 flex flex-col justify-between">
                    <div>
                      {/* Telemetry row */}
                      <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div>
                          <p className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest font-black">Speed</p>
                          <p className="text-xs font-mono font-black text-[#111111] mt-0.5">45 km/h</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-mono text-[#FFC107] uppercase tracking-widest font-black">Progress</p>
                          <p className="text-xs font-mono font-black text-[#FFC107] mt-0.5">{rideElapsedPercent}%</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest font-black">KM Left</p>
                          <p className="text-xs font-mono font-black text-[#111111] mt-0.5">
                            {Math.max(0, parseFloat((tripDistance * (1 - rideElapsedPercent/100)).toFixed(1)))} Km
                          </p>
                        </div>
                      </div>

                      {/* Safe trip assurances */}
                      <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-150/65 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-left">
                          <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <h6 className="text-[9px] font-black text-[#111111] uppercase tracking-wider">O2 Safe Ride Shield</h6>
                            <p className="text-[8px] text-neutral-400 leading-none mt-0.5">Live coordinates tracked by emergency control</p>
                          </div>
                        </div>

                        {/* Blip red button */}
                        <button
                          onClick={handleTriggerSOS}
                          className="bg-red-50 hover:bg-red-100 text-red-500 border border-red-200/50 text-[9px] font-black px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                        >
                          Trigger SOS 112
                        </button>
                      </div>
                    </div>

                    <div className="pt-3">
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mb-3.5">
                        <div className="bg-[#FFC107] h-full transition-all duration-300" style={{ width: `${rideElapsedPercent}%` }} />
                      </div>

                      <button
                        onClick={() => {
                          setDriverStatus("completed");
                          setCurrentScreen(ScreenId.PAYMENT);
                          triggerNotification("🏁 Dues calculated! Thank you for pilot verification.");
                        }}
                        className="w-full bg-[#111111] text-white hover:bg-neutral-800 text-xs font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg uppercase tracking-wider cursor-pointer"
                      >
                        <span>Reach Destination</span>
                        <Check className="w-4 h-4 text-[#FFC107]" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* === SCREEN 12: PAYMENT SCREEN === */}
              {currentScreen === ScreenId.PAYMENT && (
                <div className="flex-1 flex flex-col bg-slate-50 text-neutral-805 p-4 justify-between h-full" id="screen-payment">
                  <div>
                    <div className="text-center mb-4">
                      <span className="bg-amber-100 text-amber-850 text-[9px] font-black tracking-widest px-3 py-1 rounded-full uppercase border border-amber-200/40">
                        CLEAR RESERVATION DUES
                      </span>
                      <h2 className="text-lg font-black text-[#111111] mt-3">
                        Dues Confirmation
                      </h2>
                      <p className="text-neutral-500 text-xs mt-0.5">
                        Choose your checkout channel for O2 Cabs
                      </p>
                    </div>

                    {/* Receipt breakdown */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-center pb-3 border-b border-dashed border-slate-100">
                        <div className="text-left">
                          <p className="text-xs font-black text-neutral-800">Total payable amount</p>
                          <p className="text-[9px] text-neutral-400 font-mono">Tax & Tolls inclusive</p>
                        </div>
                        <span className="text-xl font-mono font-black text-[#111111]">
                          ₹{finalRideFare}.00
                        </span>
                      </div>

                      {/* Selected option at booking */}
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest text-left mt-4 mb-2 pl-1">
                        Booked Payment Mode
                      </p>

                      <div className="flex flex-col gap-2 text-left">
                        {paymentMethod === "online" && (
                          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">💳</span>
                              <div>
                                <p className="text-xs font-black text-emerald-950">Prepaid: Online Payment</p>
                                <p className="text-[9px] text-emerald-600">Settled via secure UPI Gateway successfully</p>
                              </div>
                            </div>
                            <CheckCircle className="w-4 h-4 text-emerald-600 animate-pulse" />
                          </div>
                        )}

                        {paymentMethod === "wallet" && (
                          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Wallet className="w-4 h-4 text-emerald-500" />
                              <div>
                                <p className="text-xs font-black text-emerald-950">Prepaid: O2 Cash Wallet</p>
                                <p className="text-[9px] text-emerald-600">Deducted on dispatch (Remaining: ₹{walletBalance})</p>
                              </div>
                            </div>
                            <CheckCircle className="w-4 h-4 text-emerald-600 animate-pulse" />
                          </div>
                        )}

                        {paymentMethod === "cash" && (
                          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between animate-pulse">
                            <div className="flex items-center gap-3">
                              <Banknote className="w-4 h-4 text-amber-500" />
                              <div>
                                <p className="text-xs font-black text-amber-950">Pending Cash Handover</p>
                                <p className="text-[9px] text-amber-700">Please pay ₹{finalRideFare} cash directly to the pilot</p>
                              </div>
                            </div>
                            <span className="text-[9px] font-extrabold bg-amber-500 text-white px-2 py-0.5 rounded uppercase">
                              Due
                            </span>
                          </div>
                        )}

                        {/* Quick switch options */}
                        <div className="mt-2 pt-2 border-t border-slate-100 flex gap-2 justify-between items-center">
                          <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider">Switch option:</span>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => {
                                setPaymentMethod("online");
                                triggerNotification("💳 Switched to Online Pay.");
                              }}
                              className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${paymentMethod === "online" ? "bg-amber-100 border-[#FFC107] text-neutral-805" : "bg-slate-50 border-slate-150 text-neutral-500"}`}
                            >
                              Online
                            </button>
                            <button
                              onClick={() => {
                                setPaymentMethod("cash");
                                triggerNotification("💵 Switched to Cash payment.");
                              }}
                              className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${paymentMethod === "cash" ? "bg-amber-100 border-[#FFC107] text-neutral-805" : "bg-slate-50 border-slate-150 text-neutral-500"}`}
                            >
                              Cash
                            </button>
                            <button
                              onClick={() => {
                                if (walletBalance < finalRideFare) {
                                  triggerNotification("⚠️ Insufficient O2 Wallet balance to pay.");
                                  return;
                                }
                                setPaymentMethod("wallet");
                                triggerNotification("👛 Switched to Wallet payment.");
                              }}
                              className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${paymentMethod === "wallet" ? "bg-amber-100 border-[#FFC107] text-neutral-805" : "bg-slate-50 border-slate-150 text-neutral-500"}`}
                            >
                              Wallet
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentScreen(ScreenId.COMPLETED);
                      triggerNotification("💚 Payment completed! Receipt recorded.");
                    }}
                    className="w-full bg-[#111111] text-white hover:bg-neutral-800 text-xs font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg uppercase tracking-wider cursor-pointer"
                  >
                    <span>Clear & Verify Billing</span>
                    <Check className="w-4 h-4 text-[#FFC107]" />
                  </button>
                </div>
              )}

              {/* === SCREEN 13: RIDE COMPLETED === */}
              {currentScreen === ScreenId.COMPLETED && (
                <div className="flex-1 flex flex-col bg-slate-50 text-neutral-800 p-4 justify-between text-center h-full select-none" id="screen-completed">
                  <div className="my-auto">
                    <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-2xl mb-4 animate-bounce shadow-sm">
                      ✓
                    </div>

                    <h2 className="text-lg font-black text-[#111111] tracking-tight">
                      Completed!
                    </h2>
                    <p className="text-neutral-500 text-xs mt-1">
                      Thanks for travelling safely with O2 Cabs.
                    </p>

                    {/* Receipt card summary */}
                    <div className="bg-white p-4 border border-slate-100 rounded-2xl text-left mt-5 shadow-xs">
                      <div className="flex justify-between text-xs text-neutral-600">
                        <span>Ride Distance</span>
                        <span className="font-mono font-bold text-neutral-800">{tripDistance} Km</span>
                      </div>
                      <div className="flex justify-between text-xs text-neutral-600 mt-2">
                        <span>Ride Duration</span>
                        <span className="font-mono font-bold text-neutral-800">{tripDuration} Mins</span>
                      </div>
                      <div className="flex justify-between text-xs text-neutral-600 mt-2">
                        <span>Cleared Bill</span>
                        <strong className="font-mono text-emerald-600">₹{finalRideFare}.00 (Prepaid)</strong>
                      </div>

                      <div className="h-px bg-slate-100 my-3" />
                      <p className="text-[10px] text-neutral-450 font-mono leading-relaxed">
                        📍 Pickup: {pickupAddress.split(",")[0]}
                        <br />
                        🏁 Drop: {destinationAddress.split(",")[0]}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentScreen(ScreenId.RATING_REVIEW);
                      triggerNotification("⭐ Rate your commuting pilot!");
                    }}
                    className="w-full bg-[#111111] text-white hover:bg-neutral-800 text-xs font-black py-4 rounded-xl flex items-center justify-center gap-1 shadow-lg uppercase tracking-wider cursor-pointer"
                  >
                    <span>Rate & Review Pilot</span>
                    <ArrowRight className="w-4 h-4 text-[#FFC107]" />
                  </button>
                </div>
              )}

              {/* === SCREEN 14: RATING & REVIEW === */}
              {currentScreen === ScreenId.RATING_REVIEW && (
                <div className="flex-1 flex flex-col bg-slate-50 text-neutral-800 p-4 justify-between h-full select-none" id="screen-rating-review">
                  <div>
                    <h2 className="text-lg font-black text-[#111111] text-center mt-2">
                      Rate Your Pilot
                    </h2>
                    <p className="text-neutral-500 text-xs text-center mt-0.5">
                      Your reviews help maintain premium commuter standards
                    </p>

                    <div className="bg-white p-4 rounded-2xl border border-slate-100 mt-4 text-center shadow-xs">
                      <img
                        src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200"
                        alt="Pilot Avatar"
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-full object-cover mx-auto ring-2 ring-[#FFC107] shadow-sm"
                      />
                      <h4 className="text-xs font-black text-neutral-800 mt-2.5">
                        Rajesh Kumar
                      </h4>
                      <p className="text-[9px] text-neutral-400 font-mono">
                        DL 3C AY 4820 • Suzuki Swift Dzire
                      </p>

                      {/* Interactive Stars */}
                      <div className="flex justify-center gap-2 my-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => {
                              setRatingScore(star);
                              triggerNotification(`You rated Rajesh ${star} Stars`);
                            }}
                            className="bg-slate-50 p-1.5 rounded-xl border border-slate-100 cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= ratingScore
                                  ? "text-[#FFC107] fill-[#FFC107]"
                                  : "text-slate-350"
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      {/* Feedback comment input */}
                      <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left mb-2 pl-1">
                        Select Pilot Tags:
                      </p>
                      
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {["Polite Pilot", "Clean Vehicle", "Safe & Steady", "Prompt arrival"].map((tag) => {
                          const has = chosenReviewTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              onClick={() => {
                                if (has) {
                                  setChosenReviewTags(chosenReviewTags.filter((t) => t !== tag));
                                } else {
                                  setChosenReviewTags([...chosenReviewTags, tag]);
                                }
                              }}
                              className={`p-2 rounded-xl text-center font-black text-[9px] cursor-pointer border transition-all ${
                                has
                                  ? "bg-[#111111] text-[#FFC107] border-[#111111] shadow-xs"
                                  : "bg-slate-50 text-neutral-500 border-slate-100 hover:bg-slate-100/60"
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>

                      <input
                        type="text"
                        placeholder="Add optional notes (e.g. perfect commute)"
                        value={ratingText}
                        onChange={(e) => setRatingText(e.target.value)}
                        className="w-full mt-4 bg-slate-50 text-xs border border-slate-100 rounded-xl p-2.5 outline-none text-[#111111] focus:border-[#FFC107]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitReview}
                    className="w-full bg-[#111111] text-white hover:bg-neutral-800 text-xs font-black py-3.5 rounded-xl flex items-center justify-center gap-1 cursor-pointer tracking-wider uppercase"
                  >
                    <span>Submit Review & Finish</span>
                    <Check className="w-4 h-4 text-[#FFC107]" />
                  </button>
                </div>
              )}

              {/* === SCREEN 15: RIDE HISTORY === */}
              {currentScreen === ScreenId.RIDE_IN_PROGRESS ? null : (
                currentScreen === ScreenId.RIDE_HISTORY && (
                  <div className="flex-1 flex flex-col bg-slate-50 text-neutral-800 p-4 h-full" id="screen-ride-history">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                      <button
                        onClick={() => setCurrentScreen(ScreenId.HOME)}
                        className="text-xs text-neutral-650 hover:text-[#111111] font-bold"
                      >
                        ← Back Home
                      </button>
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                        RIDE LOGS
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 phone-scroll text-left">
                      <div className="flex flex-col gap-3">
                        {HISTORIC_RIDES.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white p-3.5 rounded-2xl border border-slate-100 relative shadow-xs"
                          >
                            <span className="absolute top-3.5 right-3.5 text-[8px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100 uppercase tracking-wider leading-none">
                              {item.status}
                            </span>

                            <div className="text-[8px] font-mono text-neutral-400">
                              {item.date} • ID: {item.id}
                            </div>
                            
                            <h5 className="text-xs font-black text-[#111111] mt-1.5 flex items-center gap-1.5">
                              {item.vehicleName}
                              <span className="text-neutral-400 font-bold text-[10px]">by {item.driverName}</span>
                            </h5>

                            <div className="mt-2.5 pt-2.5 border-t border-slate-50 text-[10px] text-neutral-500 flex flex-col gap-1 font-sans">
                              <p className="truncate">🏁 Drop: {item.destination}</p>
                            </div>

                            <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-55 flex-wrap gap-1.5">
                              <span className="text-xs font-mono font-black text-[#111111]">
                                ₹{item.amount}.00
                              </span>
                              <button
                                onClick={() => {
                                  setDestinationAddress(item.destination);
                                  setPickupAddress(item.pickup);
                                  setCurrentScreen(ScreenId.VEHICLE_SELECT);
                                  triggerNotification("📍 Route repeated! Please select vehicle.");
                                }}
                                className="bg-[#111111] text-white hover:bg-neutral-800 text-[9px] font-black px-3 py-1.5 rounded-lg cursor-pointer transition-transform"
                              >
                                Repeat Ride
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* === SCREEN 16: WALLET === */}
              {currentScreen === ScreenId.WALLET && (
                <div className="flex-1 flex flex-col bg-slate-50 text-neutral-800 p-4 justify-between h-full text-left animate-fadeIn" id="screen-wallet">
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                      <button
                        onClick={() => setCurrentScreen(ScreenId.HOME)}
                        className="text-xs text-neutral-650 hover:text-[#111111] font-bold"
                      >
                        ← Back Home
                      </button>
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                        O2 CASH ENGINE
                      </span>
                    </div>

                    {/* Premium Card Layout */}
                    <div className="bg-[#111111] text-white p-4.5 rounded-[24px] shadow-md relative overflow-hidden">
                      {/* Ambient sphere details representing luxury credit feel */}
                      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/5" />
                      <div className="absolute right-4 top-4 w-10 h-7 rounded bg-white/10 border border-white/15" />
                      
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#FFC107]">
                        O2 CABS PREPAID CORE
                      </span>
                      <h2 className="text-2xl font-mono font-black mt-2 text-white">
                        ₹{walletBalance.toFixed(2)}
                      </h2>
                      <div className="mt-5 flex justify-between items-center text-[8px] font-mono text-neutral-400 uppercase tracking-wider">
                        <span>OWNER: {userName}</span>
                        <span> Bihar Network</span>
                      </div>
                    </div>

                    {/* Add Money Input form field */}
                    <div className="mt-4 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs animate-fadeIn">
                      <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left block mb-1">
                        Recharge Prepaid Funds
                      </label>
                      <div className="flex items-center gap-2 mt-1 mb-3">
                        <div className="bg-slate-50 p-2.5 rounded-xl text-xs font-mono font-black text-neutral-800 border border-slate-100">
                          ₹
                        </div>
                        <input
                          type="number"
                          placeholder="Amount (e.g. 500)"
                          value={addMoneyInput}
                          onChange={(e) => setAddMoneyInput(e.target.value)}
                          className="flex-1 bg-slate-50 p-2 text-xs border border-slate-100 rounded-xl outline-none text-[#111111] font-bold focus:border-[#FFC107]"
                        />
                      </div>

                      {/* Online Mode selection options */}
                      <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block text-left mb-1.5 pl-0.5">
                        Select Online option
                      </span>
                      <div className="grid grid-cols-3 gap-1.5 mb-3">
                        <button
                          onClick={() => {
                            setTopUpMethod("upi");
                            triggerNotification("⚡ Top-up option: Online UPI route selected.");
                          }}
                          className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            topUpMethod === "upi"
                              ? "border-[#FFC107] bg-amber-50/40 text-neutral-850 font-black shadow-xs"
                              : "border-slate-100 bg-slate-50/50 text-neutral-500 hover:bg-slate-50 font-bold"
                          }`}
                        >
                          <span className="text-xs">⚡</span>
                          <span className="text-[9.5px]">UPI / GPay</span>
                        </button>
                        <button
                          onClick={() => {
                            setTopUpMethod("card");
                            triggerNotification("💳 Top-up option: Credit / Debit Card route selected.");
                          }}
                          className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            topUpMethod === "card"
                              ? "border-[#FFC107] bg-amber-50/40 text-neutral-850 font-black shadow-xs"
                              : "border-slate-100 bg-slate-50/50 text-neutral-500 hover:bg-slate-50 font-bold"
                          }`}
                        >
                          <CreditCard className={`w-3.5 h-3.5 ${topUpMethod === "card" ? "text-amber-500" : "text-neutral-400"}`} />
                          <span className="text-[9.5px]">Card</span>
                        </button>
                        <button
                          onClick={() => {
                            setTopUpMethod("netbanking");
                            triggerNotification("🏦 Top-up option: Net Banking selection.");
                          }}
                          className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            topUpMethod === "netbanking"
                              ? "border-[#FFC107] bg-amber-50/40 text-neutral-850 font-black shadow-xs"
                              : "border-slate-100 bg-slate-50/50 text-neutral-500 hover:bg-slate-50 font-bold"
                          }`}
                        >
                          <span className="text-xs">🏦</span>
                          <span className="text-[9.5px]">Net Bank</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          const val = parseFloat(addMoneyInput);
                          if (isNaN(val) || val <= 0) {
                            triggerNotification("⚠️ Please type a valid deposit value.");
                            return;
                          }
                          handleAddWalletMoney(val, topUpMethod);
                          setAddMoneyInput("");
                        }}
                        className="w-full bg-[#111111] hover:bg-neutral-800 text-white text-xs font-black py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Add</span>
                      </button>
                    </div>

                    <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mt-4 pl-1 mb-2">
                      RECENT STATEMENTS
                    </p>

                    <div className="max-h-[140px] overflow-y-auto pr-1 phone-scroll text-left">
                      <div className="flex flex-col gap-1.5">
                        {transactions.map((txn) => (
                          <div
                            key={txn.id}
                            className="bg-white p-2.5 rounded-xl border border-slate-100 flex justify-between items-center text-xs shadow-2xs"
                          >
                            <div className="min-w-0">
                              <p className="text-neutral-800 font-bold truncate leading-tight">{txn.description}</p>
                              <p className="text-[8px] text-neutral-400 font-mono mt-0.5">{txn.date} • {txn.id}</p>
                            </div>

                            <span className={`text-xs font-mono font-black ${
                              txn.type === "credit" ? "text-emerald-600" : "text-amber-850"
                            }`}>
                              {txn.type === "credit" ? "+" : "-"}₹{txn.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === SCREEN 17: PROFILE === */}
              {currentScreen === ScreenId.PROFILE && (
                <div className="flex-1 flex flex-col bg-slate-50 text-neutral-800 p-4 justify-between h-full text-left" id="screen-profile">
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                      <button
                        onClick={() => setCurrentScreen(ScreenId.HOME)}
                        className="text-xs text-neutral-650 hover:text-[#111111] font-bold"
                      >
                        ← Back Home
                      </button>
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                        My Account
                      </span>
                    </div>

                    {/* Member header card */}
                    <div className="bg-white p-4 border border-slate-100 rounded-3xl relative shadow-xs">
                      <div className="absolute right-3.5 top-3.5 px-2 py-0.5 text-[7px] bg-amber-50 text-amber-800 rounded border border-amber-200/50 font-black tracking-widest font-mono">
                        GOLD CLASS
                      </div>

                      {isEditingProfile ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="relative group/avatar cursor-pointer shrink-0">
                              {profileImage ? (
                                <img
                                  src={profileImage}
                                  alt={userName}
                                  className="w-11 h-11 rounded-full object-cover border border-amber-400 shadow-sm"
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-full bg-[#111111] flex items-center justify-center text-[#FFC107] font-black text-xs shadow-inner">
                                  {userName.split(" ").map(n => n[0]).join("")}
                                </div>
                              )}
                              <label className="absolute -bottom-1 -right-1 bg-amber-400 hover:bg-amber-500 text-neutral-900 border border-white rounded-full p-0.5 cursor-pointer shadow-xs flex items-center justify-center transition-colors">
                                <Plus className="w-2.5 h-2.5 stroke-[3]" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleProfileImageUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                            <div className="flex-1 space-y-2">
                              <div>
                                <input
                                  type="text"
                                  placeholder="Full Name"
                                  value={editNameField}
                                  onChange={(e) => setEditNameField(e.target.value)}
                                  className="w-full bg-slate-50 p-1.5 text-xs border border-slate-100 rounded-lg outline-none text-[#111111] font-bold focus:border-[#FFC107]"
                                />
                              </div>
                              <div>
                                <input
                                  type="email"
                                  placeholder="Email Address"
                                  value={editEmailField}
                                  onChange={(e) => setEditEmailField(e.target.value)}
                                  className="w-full bg-slate-50 p-1.5 text-xs border border-slate-100 rounded-lg outline-none text-[#111111] font-bold focus:border-[#FFC107]"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                setEditNameField(userName);
                                setEditEmailField(userEmail);
                                setIsEditingProfile(false);
                              }}
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-neutral-600 rounded-lg text-[10px] font-bold cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                if (!editNameField.trim() || !editEmailField.trim()) {
                                  triggerNotification("⚠️ Please fill in all fields.");
                                  return;
                                }
                                setUserName(editNameField);
                                setUserEmail(editEmailField);
                                localStorage.setItem("o2_user_name", editNameField);
                                localStorage.setItem("o2_user_email", editEmailField);
                                setIsEditingProfile(false);
                                triggerNotification("✅ Profile details updated successfully!");
                              }}
                              className="px-3 py-1 bg-[#111111] hover:bg-neutral-800 text-white rounded-lg text-[10px] font-black cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative group/avatar cursor-pointer shrink-0">
                              {profileImage ? (
                                <img
                                  src={profileImage}
                                  alt={userName}
                                  className="w-11 h-11 rounded-full object-cover border border-amber-400 shadow-sm"
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-full bg-[#111111] flex items-center justify-center text-[#FFC107] font-black text-xs shadow-inner">
                                  {userName.split(" ").map(n => n[0]).join("")}
                                </div>
                              )}
                              <label className="absolute -bottom-1 -right-1 bg-amber-400 hover:bg-amber-500 text-neutral-900 border border-white rounded-full p-0.5 cursor-pointer shadow-xs flex items-center justify-center transition-colors">
                                <Plus className="w-2.5 h-2.5 stroke-[3]" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleProfileImageUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-black text-neutral-800 tracking-tight leading-none truncate">{userName}</h4>
                              <p className="text-[10px] font-mono text-neutral-400 mt-1 truncate">{userEmail}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setEditNameField(userName);
                              setEditEmailField(userEmail);
                              setIsEditingProfile(true);
                            }}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#111111] text-[9px] font-black px-2 py-1 rounded-lg tracking-wider uppercase transition-colors shrink-0 cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-slate-100 text-center">
                        <div>
                          <p className="text-[8px] font-mono text-neutral-400 uppercase tracking-wider font-bold">Total Trips</p>
                          <p className="text-xs font-mono font-black text-[#111111] mt-0.5">42</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-mono text-emerald-600 uppercase tracking-wider font-bold">DAILY</p>
                          <p className="text-xs font-mono font-black text-emerald-600 mt-0.5">₹1.5K Saved</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-mono text-neutral-400 uppercase tracking-wider font-bold">O2 WALLET</p>
                          <p className="text-xs font-mono font-black text-neutral-805 mt-0.5">₹{walletBalance}</p>
                        </div>
                      </div>
                    </div>

                    {/* Features checklist */}
                    <div className="mt-4 bg-white p-2 rounded-2xl border border-slate-100 flex flex-col gap-1 text-xs">
                      {/* Add Image option */}
                      <label className="p-2.5 rounded-xl border border-dashed border-amber-300 bg-amber-50/25 flex items-center justify-between hover:bg-amber-50/50 cursor-pointer text-neutral-700 font-bold transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">📸</span>
                          <span>Add Profile Image</span>
                        </div>
                        <span className="text-[9px] font-extrabold bg-[#111111] text-[#FFC107] px-2 py-0.5 rounded uppercase">
                          Upload
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageUpload}
                          className="hidden"
                        />
                      </label>

                      <div
                        onClick={() => {
                          triggerNotification("☎️ SOS Alert: Initiating panic line call to 112...");
                          window.location.href = "tel:112";
                        }}
                        className="p-2.5 rounded-xl flex items-center justify-between hover:bg-red-50/40 border border-transparent hover:border-red-100 transition-colors cursor-pointer text-neutral-750 font-black"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-red-500 font-bold text-sm">🛡</span>
                          <span className="text-red-700">Call 112</span>
                        </div>
                        <span className="text-[8px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider leading-none">
                          SOS
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl flex items-center justify-between hover:bg-slate-50 cursor-pointer text-neutral-700 font-semibold">
                        <span>🔒 Privacy & Session tokens</span>
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                      </div>
                      <div className="p-2.5 rounded-xl flex items-center justify-between hover:bg-slate-50 cursor-pointer text-neutral-700 font-semibold">
                        <span>ℹ️ Support helpline & Bihar rules</span>
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleResetSession}
                    className="w-full bg-[#111111] hover:bg-neutral-800 text-white text-xs font-black py-4 rounded-xl cursor-pointer text-center uppercase tracking-wider mt-3"
                  >
                    Logout Session
                  </button>
                </div>
              )}

              {/* === SCREEN 18: SAVED LOCATIONS === */}
              {currentScreen === ScreenId.SAVED_LOCATIONS && (
                <div className="flex-1 flex flex-col bg-slate-50 text-neutral-800 p-4 h-full text-left" id="screen-saved-locations">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                    <button
                      onClick={() => setCurrentScreen(ScreenId.HOME)}
                      className="text-xs text-neutral-650 hover:text-[#111111] font-bold"
                    >
                      ← Back Home
                    </button>
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                      Bookmarks
                    </span>
                  </div>

                  {/* Listings */}
                  <div className="flex-1 overflow-y-auto pr-1 phone-scroll text-left flex flex-col gap-2.5">
                    {SAVED_LOCATIONS.map((loc) => (
                      <div
                        key={loc.id}
                        className="p-3.5 bg-white border border-slate-100 rounded-2xl relative shadow-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base select-none">
                            {loc.type === "home" ? "🏠" : loc.type === "work" ? "🏢" : "📍"}
                          </span>
                          <div>
                            <h5 className="text-xs font-black text-neutral-800 leading-none">
                              {loc.label}
                            </h5>
                            <p className="text-[8px] text-amber-800 bg-amber-50 px-2 py-0.5 mt-1 rounded border border-amber-100/50 uppercase font-black tracking-wider inline-block">
                              {loc.type} Point of Interest
                            </p>
                          </div>
                        </div>

                        <p className="text-[10px] text-neutral-400 mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-normal font-sans">
                          {loc.address}
                        </p>

                        <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-50">
                          <button
                            onClick={() => {
                              setDestinationAddress(loc.address);
                              setCurrentScreen(ScreenId.VEHICLE_SELECT);
                              triggerNotification(`Heading to ${loc.label}!`);
                            }}
                            className="bg-[#111111] hover:bg-neutral-800 text-white text-[9px] font-black px-3.5 py-1.5 rounded-lg cursor-pointer"
                          >
                            Set Destination
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* === SCREEN 19: OFFERS & COUPONS === */}
              {currentScreen === ScreenId.OFFERS_COUPONS && (
                <div className="flex-1 flex flex-col bg-slate-50 text-neutral-800 p-4 h-full text-left" id="screen-offers-coupons">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                    <button
                      onClick={() => setCurrentScreen(ScreenId.HOME)}
                      className="text-xs text-neutral-650 hover:text-[#111111] font-bold"
                    >
                      ← Back Home
                    </button>
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                      PROMOTIONS
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-1 phone-scroll text-left flex flex-col gap-3">
                    {ACTIVE_OFFERS.map((off) => (
                      <div
                        key={off.code}
                        className="bg-white p-4 rounded-2xl border border-slate-100 relative overflow-hidden shadow-xs"
                      >
                        <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 bg-slate-50 rounded-full border border-slate-100" />
                        <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-4 h-4 bg-slate-50 rounded-full border border-slate-100" />

                        <div className="flex justify-between items-center mb-1 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="font-mono text-xs font-black text-neutral-800 tracking-wider">
                            🎟️ {off.code}
                          </span>
                          <span className="text-[8px] font-black text-green-700 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                            ACTIVE
                          </span>
                        </div>

                        <p className="text-xs font-bold text-[#111111] mt-2.5">
                          {off.description}
                        </p>

                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-dashed border-slate-100">
                          <span className="text-[9px] text-[#999999] font-mono">
                            {off.expiry}
                          </span>
                          <button
                            onClick={() => {
                              setAppliedCoupon(off);
                              setCurrentScreen(ScreenId.FARE_ESTIMATE);
                              triggerNotification(`Coupon code ${off.code} applied standard discount successfully.`);
                            }}
                            className="bg-[#111111] cursor-pointer text-white hover:bg-[#FFC107] hover:text-black hover:font-bold text-[9px] font-black px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Apply Code
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* === SCREEN 20: SOS EMERGENCY SCREEN === */}
              {currentScreen === ScreenId.SOS_ALERT && (
                <div className="flex-1 flex flex-col bg-red-900 text-white p-5 justify-between text-center select-none h-full relative" id="screen-sos-emergency">
                  {/* Flashing hazard visual backdrop */}
                  <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-red-800 via-red-950 to-black opacity-95 animate-pulse" />

                  <div className="z-10 mt-4">
                    <span className="bg-red-950/40 text-red-150 text-[9px] font-mono tracking-widest px-3 py-1 rounded-full uppercase border border-red-500/20 animate-pulse font-black">
                      🚨 DIALING EMERGENCY 112
                    </span>
                    <h2 className="text-xl font-black text-white uppercase mt-4 tracking-tight leading-none">
                      112 Crisis Dispatch
                    </h2>
                    <p className="text-[10px] text-neutral-300 mt-2 leading-relaxed">
                      Live coordinates and telemetry feed linked instantly with the National Emergency Response System (112) for immediate rapid response dispatch.
                    </p>
                  </div>

                  {/* Gigantic emergency blare siren representation */}
                  <div className="z-10 relative my-auto w-32 h-32 mx-auto flex items-center justify-center">
                    <div className="absolute w-28 h-28 rounded-full bg-red-500/10 border-4 border-red-500/30 animate-ping" />
                    <div className="absolute w-24 h-24 rounded-full bg-red-500/20 border-2 border-red-500/40 animate-pulse" />
                    
                    <div className="w-16 h-16 rounded-full bg-white text-red-700 shadow-xl flex flex-col items-center justify-center border-4 border-red-950 z-20">
                      {sosCountdown > 0 ? (
                        <>
                          <span className="text-[8px] font-bold uppercase text-red-800 leading-none">Disarm</span>
                          <span className="text-2.5xl font-mono font-black text-red-700 leading-none mt-0.5">{sosCountdown}</span>
                        </>
                      ) : (
                        <div className="text-center font-bold">
                          <Volume2 className="w-4 h-4 mx-auto text-red-650 animate-bounce" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="z-10 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setEmergencyCallActive(true);
                        triggerNotification("📞 Dialing 112 National Emergency Helpline...");
                      }}
                      className="w-full bg-red-600 hover:bg-red-500 text-white text-xs font-black py-4 rounded-xl cursor-pointer shadow-lg uppercase tracking-wider flex items-center justify-center gap-2 animate-pulse"
                    >
                      <Phone className="w-4 h-4 text-white" />
                      <span>Emergency Call</span>
                    </button>
                    <button
                      onClick={() => {
                        setSosTriggered(false);
                        setSosCountdown(5);
                        setCurrentScreen(ScreenId.HOME);
                        triggerNotification("💚 Emergency disarmed safely.");
                      }}
                      className="text-[10px] text-red-100 hover:text-white font-bold underline transition-colors cursor-pointer mt-1"
                    >
                      Disarm Emergency Beacon
                    </button>
                    <p className="text-[8px] text-red-200">
                      Telemetry Active • National Emergency Response 112 Command Center Verified
                    </p>
                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* MODALS OVERLAY AT THE BOTTOM / PRESTIGE PHONE INNER LAYER */}
              {/* =============================================================== */}

              {/* SIMULATED 112 EMERGENCY CALL POP-UP OVERLAY */}
              {emergencyCallActive && (
                <div className="absolute inset-x-0 bottom-0 top-0 z-[220] bg-red-950/95 text-white p-6 flex flex-col justify-between text-center select-none animate-slideUp font-sans">
                  {/* Glowing warning overlay */}
                  <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-red-900/60 via-red-950/90 to-black opacity-90 animate-pulse pointer-events-none" />

                  <div className="z-10 mt-8">
                    <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white text-3xl font-black mx-auto shadow-lg border-2 border-white/40 animate-pulse">
                      🚨
                    </div>
                    <h3 className="text-xl font-black mt-5 tracking-tight">NATIONAL HELPLINE 112</h3>
                    <p className="text-xs text-red-350 font-mono bg-red-950/50 inline-block px-3 py-1 rounded-full border border-red-500/20 mt-3 animate-pulse">
                      🔴 DIALING: Bihar Police SOS Feed...
                    </p>
                    
                    <div className="bg-red-900/25 border border-red-500/20 rounded-2xl p-4 mt-8 text-left max-w-xs mx-auto">
                      <p className="text-[10px] font-mono text-red-200 uppercase tracking-widest text-center font-bold">
                        STREAMING LIVE GPS DATA
                      </p>
                      <div className="mt-2 space-y-1 text-[9px] font-mono text-neutral-300">
                        <p>📍 LAT: 25.5941° N (Patna Core)</p>
                        <p>📍 LNG: 85.1376° E (Bihar Commute)</p>
                        <p>🛜 SIGNAL: SATELLITE ENCRYPTED</p>
                        <p>🛡️ VEHICLE ID: DL 3C AY 4820</p>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-400 font-mono mt-8">
                      Call Duration: {String(Math.floor(callDuration / 60)).padStart(2, "0")}:{String(callDuration % 60).padStart(2, "0")}s
                    </p>
                  </div>

                  <div className="z-10 flex flex-col gap-3">
                    <div className="bg-neutral-900/40 border border-neutral-800/60 p-3.5 rounded-xl text-[10px] text-neutral-300">
                      <span>Responder status: </span>
                      <strong className="text-red-400">"Dispatch unit assigned. Maintain steady safety lock!"</strong>
                    </div>

                    <button
                      onClick={() => setEmergencyCallActive(false)}
                      className="w-full bg-red-600 hover:bg-red-500 text-white text-xs font-black py-4 rounded-xl cursor-pointer shadow-lg tracking-wider uppercase"
                    >
                      End Emergency Call
                    </button>
                  </div>
                </div>
              )}

              {/* SIMULATED PHONE VOICE CALL POP-UP MODAL */}
              {showCallModal && currentDriver && (
                <div className="absolute inset-x-0 bottom-0 top-0 z-[200] bg-black/95 text-white p-6 flex flex-col justify-between text-center select-none animate-slideUp font-sans">
                  <div className="mt-8">
                    <div className="w-20 h-20 rounded-full bg-[#FFC107] flex items-center justify-center text-black text-2xl font-bold mx-auto shadow-lg border-2 border-white/20">
                      {currentDriver.name.split(" ")[0]}
                    </div>
                    <h3 className="text-lg font-black mt-4">{currentDriver.name}</h3>
                    <p className="text-xs text-[#FFC107] font-mono bg-[#FFC107]/5 inline-block px-2 py-0.5 rounded border border-[#FFC107]/10 mt-1.5">
                      Calling via O2 Voice Line...
                    </p>
                    
                    <p className="text-xs text-neutral-500 font-mono mt-8">
                      Duration: {String(Math.floor(callDuration / 60)).padStart(2, "0")}:{String(callDuration % 60).padStart(2, "0")}s
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-2xl text-[10px] text-neutral-400">
                      <span>Simulate pilot response: </span>
                      <strong className="text-white">"Yes sir, looking at GPS loop coordinates, arriving"</strong>
                    </div>

                    <button
                      onClick={() => setShowCallModal(false)}
                      className="w-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-3.5 rounded-2xl cursor-pointer"
                    >
                      Hang Up Voice call
                    </button>
                  </div>
                </div>
              )}

              {/* SIMULATED PILOT LIVE CHAT MODAL */}
              {showChatModal && currentDriver && (
                <div className="absolute inset-x-0 bottom-0 top-0 z-[210] bg-[#111111] text-white flex flex-col justify-between font-sans">
                  {/* Chat header */}
                  <div className="bg-black/80 px-4 py-3 border-b border-neutral-900 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={currentDriver.avatar}
                        alt="Pilot"
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div className="text-left">
                        <p className="text-xs font-bold text-white">{currentDriver.name}</p>
                        <p className="text-[8px] text-[#FFC107] font-mono leading-none">★ {currentDriver.rating} • Online</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowChatModal(false)}
                      className="p-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Messages list container */}
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 phone-scroll">
                    {chatMessages.map((msg, index) => {
                      const isUser = msg.sender === "user";
                      return (
                        <div
                          key={`msg-${index}`}
                          className={`max-w-[80%] rounded-2xl p-2.5 text-xs text-left ${
                            isUser
                              ? "bg-[#FFC107] text-[#111111] font-medium ml-auto rounded-tr-none"
                              : "bg-neutral-950 text-white rounded-tl-none border border-neutral-900-300"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <span className={`text-[8px] block mt-0.5 opacity-60 text-right ${isUser ? "text-[#111111]/80" : "text-neutral-500"}`}>
                            {msg.time}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick message suggestions inside modal */}
                  <div className="px-3 py-1.5 bg-neutral-950 border-t border-neutral-900 overflow-x-auto flex gap-1 phone-scroll shrink-0">
                    {CHAT_TEMPLATES.map((promptText, i) => (
                      <button
                        key={`modal-prompt-${i}`}
                        onClick={() => handleSendChatMessage(promptText)}
                        className="bg-neutral-900 hover:bg-[#FFC107]/10 hover:border-[#FFC107]/40 border border-neutral-800 text-[9px] py-1 px-2.5 rounded-lg text-neutral-300 whitespace-nowrap cursor-pointer transition-all shrink-0"
                      >
                        {promptText}
                      </button>
                    ))}
                  </div>

                  {/* Bottom custom sending inputs */}
                  <div className="bg-black/90 p-2 border-t border-neutral-900 flex gap-2">
                    <input
                      type="text"
                      placeholder="Type custom message..."
                      value={chatInputText}
                      onChange={(e) => setChatInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendChatMessage(chatInputText);
                      }}
                      className="flex-1 bg-neutral-900 border border-neutral-800 text-xs px-3 py-2 outline-none rounded-xl text-white focus:border-[#FFC107]"
                    />
                    <button
                      onClick={() => handleSendChatMessage(chatInputText)}
                      className="bg-[#FFC107] text-[#111111] p-2 rounded-xl"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </PhoneMockup>
          </div>

          {/* Quick instructions indicator details */}
          <div className="mt-4 text-center max-w-[340px] text-neutral-500 text-[10px] leading-relaxed">
            💡 <strong className="text-neutral-400">Design tip:</strong> Click on the <strong className="text-white">Bottom Pill Bar</strong> at the bottom of the device to instantly splash-reload. Click the <strong className="text-white">SOS button</strong> to sound safety siren indicators.
          </div>

        </div>
      </div>
    </div>
  );
}

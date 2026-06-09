/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Define all 20 screen stages requested by the user
export enum ScreenId {
  SPLASH = "SPLASH",
  LOGIN = "LOGIN",
  OTP = "OTP",
  HOME = "HOME",
  PICK_SPOT = "PICK_SPOT",
  VEHICLE_SELECT = "VEHICLE_SELECT",
  FARE_ESTIMATE = "FARE_ESTIMATE",
  SEARCH_DRIVER = "SEARCH_DRIVER",
  DRIVER_ASSIGNED = "DRIVER_ASSIGNED",
  LIVE_TRACKING = "LIVE_TRACKING",
  RIDE_IN_PROGRESS = "RIDE_IN_PROGRESS",
  PAYMENT = "PAYMENT",
  COMPLETED = "COMPLETED",
  RATING_REVIEW = "RATING_REVIEW",
  RIDE_HISTORY = "RIDE_HISTORY",
  WALLET = "WALLET",
  PROFILE = "PROFILE",
  SAVED_LOCATIONS = "SAVED_LOCATIONS",
  OFFERS_COUPONS = "OFFERS_COUPONS",
  SOS_ALERT = "SOS_ALERT",
}

export interface Vehicle {
  id: string;
  name: string; // Mini, Sedan, SUV, Auto
  type: "mini" | "sedan" | "suv" | "auto" | "bike" | "mayuri";
  icon: string;
  eta: number; // in mins
  farePerKm: number;
  capacity: number;
  description: string;
  popular?: boolean;
}

export interface Driver {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  rating: number;
  vehicleNo: string;
  vehicleModel: string;
  lat: number;
  lng: number;
  status: "idle" | "heading_to_pickup" | "arrived" | "ongoing" | "completed";
}

export interface RideHistoryItem {
  id: string;
  date: string;
  pickup: string;
  destination: string;
  vehicleName: string;
  amount: number;
  status: "completed" | "cancelled";
  driverName: string;
}

export interface SavedLocation {
  id: string;
  label: string; // Home, Work, Gym, Friend, etc.
  address: string;
  type: "home" | "work" | "other";
}

export interface OfferCoupon {
  code: string;
  description: string;
  discountValue: number;
  minFare: number;
  expiry: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "driver";
  text: string;
  time: string;
}

export interface WalletTransaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
}

export interface AppState {
  currentScreen: ScreenId;
  phoneNumber: string;
  otpCode: string;
  isOtpSent: boolean;
  walletBalance: number;
  couponApplied: OfferCoupon | null;
  pickupQuery: string;
  destinationQuery: string;
  pickupAddress: string;
  destinationAddress: string;
  selectedVehicleId: string;
  simulatedRideActive: boolean;
  currentDriver: Driver | null;
  rideElapsedPercent: number; // 0 to 100 for tracking progress
  chatMessages: ChatMessage[];
  lastNotification: string | null;
  sosTriggered: boolean;
  sosCountdown: number;
  ratingScore: number;
  ratingText: string;
}

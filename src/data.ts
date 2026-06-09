/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Vehicle, Driver, RideHistoryItem, SavedLocation, OfferCoupon, WalletTransaction } from "./types";

export const VEHICLES: Vehicle[] = [
  {
    id: "v-mini",
    name: "O2 Mini",
    type: "mini",
    icon: "🚗",
    eta: 3,
    farePerKm: 15,
    capacity: 4,
    description: "Compact & affordable everyday rides",
    popular: true,
  },
  {
    id: "v-sedan",
    name: "O2 Prime Sedan",
    type: "sedan",
    icon: "🚘",
    eta: 2,
    farePerKm: 15,
    capacity: 4,
    description: "Spacious sedans with top-rated drivers",
  },
  {
    id: "v-suv",
    name: "O2 Prime SUV",
    type: "suv",
    icon: "🚙",
    eta: 5,
    farePerKm: 15,
    capacity: 6,
    description: "Spacious SUVs, perfect for groups & luggage",
  },
  {
    id: "v-auto",
    name: "O2 Auto",
    type: "auto",
    icon: "🛺",
    eta: 1,
    farePerKm: 8,
    capacity: 3,
    description: "Eco-friendly, fast moving & affordable autos",
    popular: true,
  },
  {
    id: "v-bike",
    name: "O2 Bike",
    type: "bike",
    icon: "🏍️",
    eta: 2,
    farePerKm: 8,
    capacity: 1,
    description: "Quick single-rider trips to beat local traffic",
  },
  {
    id: "v-mayuri",
    name: "Electric Mayuri",
    type: "mayuri",
    icon: "🛺⚡",
    eta: 4,
    farePerKm: 8,
    capacity: 4,
    description: "Silent, zero-emission local e-rickshaw sharing",
    popular: true,
  },
];

// High fidelity drivers that can be random-assigned
export const SAMPLE_DRIVERS: Driver[] = [
  {
    id: "dr-01",
    name: "Rajesh Kumar",
    avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200",
    phone: "+91 98765 43210",
    rating: 4.8,
    vehicleNo: "DL 3C AY 4820",
    vehicleModel: "Suzuki Swift Dzire (Yellow/Black Accent)",
    lat: 34,
    lng: 12,
    status: "idle",
  },
  {
    id: "dr-02",
    name: "Vikram Singh",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    phone: "+91 99112 23344",
    rating: 4.9,
    vehicleNo: "KA 05 MN 9102",
    vehicleModel: "Toyota Etios (Signature Yellow Star)",
    lat: 56,
    lng: 78,
    status: "idle",
  },
  {
    id: "dr-03",
    name: "Subbu Swamy",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    phone: "+91 96543 89812",
    rating: 4.7,
    vehicleNo: "MH 12 QP 7171",
    vehicleModel: "Bajaj RE Auto (Gold & Black edition)",
    lat: 42,
    lng: 85,
    status: "idle",
  },
];

export const HISTORIC_RIDES: RideHistoryItem[] = [
  {
    id: "R-88129",
    date: "25 May 2026 • 10:30 AM",
    pickup: "Jaynagar, Madhubani",
    destination: "Madhubani Bus Stand",
    vehicleName: "O2 Prime Sedan",
    amount: 180,
    status: "completed",
    driverName: "Ravi Kumar",
  },
  {
    id: "R-71289",
    date: "24 May 2026 • 08:15 PM",
    pickup: "Madhubani Railway Station",
    destination: "Rajnagar Chowk",
    vehicleName: "O2 Mini",
    amount: 210,
    status: "completed",
    driverName: "Vikram Singh",
  },
  {
    id: "R-66512",
    date: "23 May 2026 • 05:45 PM",
    pickup: "Jaynagar, Madhubani",
    destination: "Supaul Bypass Road",
    vehicleName: "O2 Prime SUV",
    amount: 350,
    status: "completed",
    driverName: "Ravi Kumar",
  },
  {
    id: "R-54122",
    date: "22 May 2026 • 11:20 AM",
    pickup: "Madhubani Court Complex",
    destination: "Darbhanga Airport (DBR)",
    vehicleName: "O2 Auto",
    amount: 260,
    status: "completed",
    driverName: "Subbu Swamy",
  },
];

export const SAVED_LOCATIONS: SavedLocation[] = [
  {
    id: "sl-01",
    label: "Jaynagar Home Spot",
    address: "Ward No. 4, Near Station Road, Jaynagar, Madhubani, Bihar",
    type: "home",
  },
  {
    id: "sl-02",
    label: "Madhubani Office Block",
    address: "Main Bazar Chowk, Opposite Court, Madhubani, Bihar",
    type: "work",
  },
  {
    id: "sl-03",
    label: "Darbhanga Airport Gate",
    address: "Terminal Main Entrance, Darbhanga Air Force Station, Bihar",
    type: "other",
  },
  {
    id: "sl-04",
    label: "Supaul Bus Terminal",
    address: "National Highway Station, Supaul, Bihar",
    type: "other",
  },
];

export const ACTIVE_OFFERS: OfferCoupon[] = [
  {
    code: "O2BIHAR20",
    description: "Save 20% on your first 3 rides across Jayanagar & Madhubani!",
    discountValue: 0.2,
    minFare: 80,
    expiry: "Valid till 30 Jun 2026",
  },
  {
    code: "DAILYO2",
    description: "Save Flat ₹30 on premium Jaynagar-Madhubani daily runs",
    discountValue: 30,
    minFare: 120,
    expiry: "Valid till 31 Dec 2026",
  },
  {
    code: "AUTO80",
    description: "Flat ₹15 off on auto-rickshaw rides inside Jayanagar town",
    discountValue: 15,
    minFare: 50,
    expiry: "Valid till 15 Jul 2026",
  },
];

export const WALLET_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "TXN-00122",
    type: "debit",
    amount: 180,
    description: "Paid for Ride #R-88129 (Jaynagar → Madhubani)",
    date: "25 May 2026 • 10:45 AM",
  },
  {
    id: "TXN-00121",
    type: "credit",
    amount: 500,
    description: "Loaded funds via Google Pay UPI",
    date: "24 May 2026 • 02:00 PM",
  },
  {
    id: "TXN-00120",
    type: "debit",
    amount: 210,
    description: "Paid for Ride #R-71289 (Madhubani → Rajnagar)",
    date: "24 May 2026 • 08:30 PM",
  },
  {
    id: "TXN-00119",
    type: "credit",
    amount: 150,
    description: "Bihar Launch Referral Bonus Cash",
    date: "20 May 2026 • 11:15 AM",
  },
];

export const CHAT_TEMPLATES = [
  "Bhaiya main station par khada hoon.",
  "Please share safety OTP (4402).",
  "Urea Mod par traffic hai, 5 mins mein pahuchenge.",
  "Coming in 2 minutes, please wait near the gate.",
  "Aap kahan par ho abhi?",
];

export const PRESET_ROUTES = [
  {
    pickup: "Jaynagar, Madhubani",
    dest: "Madhubani Bus Stand",
    distanceKm: 15.0,
    durationMins: 25,
    pickupGeo: { x: 80, y: 310 },
    destGeo: { x: 190, y: 130 },
  },
  {
    pickup: "Jaynagar, Madhubani",
    dest: "Rajnagar Chowk",
    distanceKm: 18.5,
    durationMins: 32,
    pickupGeo: { x: 80, y: 310 },
    destGeo: { x: 210, y: 190 },
  },
  {
    pickup: "Jaynagar, Madhubani",
    dest: "Supaul Bypass Road",
    distanceKm: 34.0,
    durationMins: 55,
    pickupGeo: { x: 80, y: 310 },
    destGeo: { x: 280, y: 220 },
  },
];

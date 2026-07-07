import { Store, UtensilsCrossed, LayoutGrid, CalendarDays, CreditCard, Bell, MapPin } from "lucide-react";

// roles: "admin" | "manager" | "staff"
export const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid, roles: ["admin", "manager", "staff"] },
  { id: "branches", label: "Branches", icon: Store, roles: ["admin"] },
  { id: "menu", label: "Menu", icon: UtensilsCrossed, roles: ["admin", "manager"] },
  { id: "floor", label: "Floor plan", icon: MapPin, roles: ["admin", "manager", "staff"] },
  { id: "reservations", label: "Reservations", icon: CalendarDays, roles: ["admin", "manager", "staff"] },
  { id: "payment", label: "Payment", icon: CreditCard, roles: ["admin", "manager"] },
  { id: "notifications", label: "Notifications", icon: Bell, roles: ["admin", "manager", "staff"] },
];

export const ROLES = [
  { id: "admin", label: "Admin", description: "Full access, including branch management" },
  { id: "manager", label: "Manager", description: "Runs day-to-day operations for a branch" },
  { id: "staff", label: "Staff", description: "Floor, reservations, and notifications only" },
];

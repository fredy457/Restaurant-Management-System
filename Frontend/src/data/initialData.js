import { uid, todayStr } from "../utils/helpers.js";

export function initialUsers() {
  return [
    { id: "u1", name: "Elena Cross", email: "admin@restaurant.com", password: "admin123", role: "admin" },
    { id: "u2", name: "Marcus Diallo", email: "manager@restaurant.com", password: "manager123", role: "manager" },
    { id: "u3", name: "Priya S.", email: "staff@restaurant.com", password: "staff123", role: "staff" },
  ];
}

export function initialBranches() {
  return [
    { id: "b1", name: "Harbor District", address: "12 Wharf St, Kingston", manager: "Elena Cross", staff: ["Tomas R.", "Aiko N."] },
    { id: "b2", name: "Uptown Grove", address: "88 Grove Ave, Kingston", manager: "Marcus Diallo", staff: ["Priya S."] },
  ];
}

export function initialMenu() {
  return [
    { id: "m1", name: "Charred Octopus", category: "Appetizers", emoji: "🐙", basePrice: 14, branchPrice: { b1: 14, b2: 13 }, branchAvailable: { b1: true, b2: true } },
    { id: "m2", name: "Burrata & Fig", category: "Appetizers", emoji: "🧀", basePrice: 11, branchPrice: { b1: 11, b2: 11 }, branchAvailable: { b1: true, b2: true } },
    { id: "m3", name: "Braised Short Rib", category: "Main Course", emoji: "🍖", basePrice: 28, branchPrice: { b1: 28, b2: 26 }, branchAvailable: { b1: true, b2: true } },
    { id: "m4", name: "Wild Mushroom Risotto", category: "Main Course", emoji: "🍚", basePrice: 22, branchPrice: { b1: 22, b2: 22 }, branchAvailable: { b1: true, b2: false } },
    { id: "m5", name: "Pan-Seared Snapper", category: "Main Course", emoji: "🐟", basePrice: 26, branchPrice: { b1: 26, b2: 25 }, branchAvailable: { b1: true, b2: true } },
    { id: "m6", name: "Old Fashioned", category: "Drinks", emoji: "🥃", basePrice: 13, branchPrice: { b1: 13, b2: 12 }, branchAvailable: { b1: true, b2: true } },
    { id: "m7", name: "House Red, glass", category: "Drinks", emoji: "🍷", basePrice: 10, branchPrice: { b1: 10, b2: 10 }, branchAvailable: { b1: true, b2: true } },
    { id: "m8", name: "Sparkling Lime Soda", category: "Drinks", emoji: "🥤", basePrice: 5, branchPrice: { b1: 5, b2: 5 }, branchAvailable: { b1: true, b2: true } },
    { id: "m9", name: "Basque Cheesecake", category: "Desserts", emoji: "🍰", basePrice: 9, branchPrice: { b1: 9, b2: 9 }, branchAvailable: { b1: true, b2: true } },
    { id: "m10", name: "Dark Chocolate Tart", category: "Desserts", emoji: "🍫", basePrice: 10, branchPrice: { b1: 10, b2: 9 }, branchAvailable: { b1: true, b2: true } },
  ];
}

export function initialTables() {
  const t = [];
  const layout1 = [
    { number: 1, capacity: 2, shape: "round", x: 40, y: 40 },
    { number: 2, capacity: 2, shape: "round", x: 170, y: 40 },
    { number: 3, capacity: 4, shape: "square", x: 300, y: 40 },
    { number: 4, capacity: 4, shape: "square", x: 460, y: 40 },
    { number: 5, capacity: 6, shape: "square", x: 620, y: 40 },
    { number: 6, capacity: 2, shape: "round", x: 40, y: 200 },
    { number: 7, capacity: 4, shape: "square", x: 170, y: 200 },
    { number: 8, capacity: 4, shape: "square", x: 330, y: 200 },
    { number: 9, capacity: 8, shape: "square", x: 500, y: 210 },
    { number: 10, capacity: 2, shape: "round", x: 40, y: 350 },
    { number: 11, capacity: 2, shape: "round", x: 170, y: 350 },
    { number: 12, capacity: 4, shape: "square", x: 300, y: 350 },
  ];
  const layout2 = layout1.slice(0, 8);
  layout1.forEach((t1) => t.push({ id: uid(), branchId: "b1", status: "available", guests: null, seatedAt: null, order: [], ...t1 }));
  layout2.forEach((t2) => t.push({ id: uid(), branchId: "b2", status: "available", guests: null, seatedAt: null, order: [], ...t2 }));
  t[2].status = "occupied";
  t[2].guests = 3;
  t[2].seatedAt = Date.now() - 42 * 60000;
  t[2].order = [{ itemId: "m3", qty: 2 }, { itemId: "m7", qty: 2 }];
  t[8].status = "reserved";
  return t;
}

export function initialReservations() {
  return [
    { id: uid(), branchId: "b1", customerName: "Naomi Baptiste", phone: "876-555-0114", date: todayStr(), time: "19:30", guests: 6, tableNumber: 9, specialRequests: "Window seat if possible", status: "confirmed", cancellationReason: null },
  ];
}

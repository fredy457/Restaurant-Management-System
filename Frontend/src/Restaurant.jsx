import React, { useState, useRef, useEffect } from "react";
import {
  Store, UtensilsCrossed, LayoutGrid, CalendarDays, CreditCard, Bell,
  Plus, X, Search, Trash2, Pencil, Users, Clock, ArrowRightLeft,
  GripVertical, Check, ChefHat, MapPin, ChevronDown, AlertCircle,
  Mail, MessageSquareText, Receipt, BellRing, CheckCircle2
} from "lucide-react";

const FONT_DISPLAY = "'Fraunces', serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

const C = {
  ink: "#221B14",
  inkSoft: "#332920",
  paper: "#FBF7EF",
  paperDeep: "#F1E9D8",
  card: "#FFFFFF",
  rust: "#B5451F",
  rustDeep: "#8F3517",
  sage: "#6E7B58",
  gold: "#B3872A",
  text: "#2B2620",
  textMuted: "#8A8071",
  border: "#E5DCC8",
};

const STATUS = {
  available: { label: "Available", color: "#3F8F5F", bg: "#E7F1EA", dot: "🟢" },
  occupied: { label: "Occupied", color: "#B5342B", bg: "#F5E6E3", dot: "🔴" },
  reserved: { label: "Reserved", color: "#B3872A", bg: "#F5ECD6", dot: "🟡" },
  cleaning: { label: "Cleaning", color: "#7C8A8C", bg: "#EAEDED", dot: "⚪" },
};

const CATEGORIES = ["Appetizers", "Main Course", "Drinks", "Desserts"];

const uid = () => Math.random().toString(36).slice(2, 9);
const fmt = (n) => `$${(Math.round(n * 100) / 100).toFixed(2)}`;
const todayStr = () => new Date().toISOString().slice(0, 10);

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "branches", label: "Branches", icon: Store },
  { id: "menu", label: "Menu", icon: UtensilsCrossed },
  { id: "floor", label: "Floor plan", icon: MapPin },
  { id: "reservations", label: "Reservations", icon: CalendarDays },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
];

function initialBranches() {
  return [
    { id: "b1", name: "Harbor District", address: "12 Wharf St, Kingston", manager: "Elena Cross", staff: ["Tomas R.", "Aiko N."] },
    { id: "b2", name: "Uptown Grove", address: "88 Grove Ave, Kingston", manager: "Marcus Diallo", staff: ["Priya S."] },
  ];
}

function initialMenu() {
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

function initialTables() {
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
  layout1.forEach((t1, i) => t.push({ id: uid(), branchId: "b1", status: "available", guests: null, seatedAt: null, order: [], reservationId: null, ...t1 }));
  layout2.forEach((t2, i) => t.push({ id: uid(), branchId: "b2", status: "available", guests: null, seatedAt: null, order: [], reservationId: null, ...t2 }));
  t[2].status = "occupied"; t[2].guests = 3; t[2].seatedAt = Date.now() - 42 * 60000; t[2].order = [{ itemId: "m3", qty: 2 }, { itemId: "m7", qty: 2 }];
  t[8].status = "reserved";
  return t;
}

function initialReservations() {
  return [
    { id: uid(), branchId: "b1", customerName: "Naomi Baptiste", phone: "876-555-0114", date: todayStr(), time: "19:30", guests: 6, tableNumber: 9, specialRequests: "Window seat if possible", status: "confirmed", cancellationReason: null },
  ];
}

function App() {
  const [branches, setBranches] = useState(initialBranches());
  const [activeBranchId, setActiveBranchId] = useState("b1");
  const [menuItems, setMenuItems] = useState(initialMenu());
  const [tables, setTables] = useState(initialTables());
  const [reservations, setReservations] = useState(initialReservations());
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: uid(), type: "info", message: "Welcome to RestaurantOS. This is a live prototype.", time: Date.now() - 3600000, read: true },
  ]);
  const [view, setView] = useState("dashboard");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const it = setInterval(() => setTick((x) => x + 1), 30000);
    return () => clearInterval(it);
  }, []);

  const branch = branches.find((b) => b.id === activeBranchId) || branches[0];
  const branchTables = tables.filter((t) => t.branchId === activeBranchId);

  function notify(type, message) {
    setNotifications((n) => [{ id: uid(), type, message, time: Date.now(), read: false }, ...n]);
  }

  const ctx = {
    branches, setBranches, activeBranchId, setActiveBranchId, branch,
    menuItems, setMenuItems, tables, setTables, branchTables,
    reservations, setReservations, payments, setPayments,
    notifications, setNotifications, notify, view, setView, tick,
  };

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.paper, minHeight: "100vh", color: C.text, display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        input, select, textarea { font-family: inherit; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: #D8CDB4; border-radius: 4px; }
      `}</style>
      <Sidebar view={view} setView={setView} unread={notifications.filter((n) => !n.read).length} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Topbar ctx={ctx} />
        <div style={{ flex: 1, padding: "28px 36px", overflowY: "auto" }}>
          {view === "dashboard" && <Dashboard ctx={ctx} />}
          {view === "branches" && <BranchesView ctx={ctx} />}
          {view === "menu" && <MenuView ctx={ctx} />}
          {view === "floor" && <FloorPlanView ctx={ctx} />}
          {view === "reservations" && <ReservationsView ctx={ctx} />}
          {view === "payment" && <PaymentView ctx={ctx} />}
          {view === "notifications" && <NotificationsView ctx={ctx} />}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ view, setView, unread }) {
  return (
    <div style={{ width: 224, background: C.ink, color: "#EFE7D8", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "24px 22px 18px", borderBottom: "1px solid #3A2F24" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ChefHat size={22} color={C.gold} />
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 19, letterSpacing: 0.2 }}>RestaurantOS</span>
        </div>
        <div style={{ fontSize: 11, color: "#A99B82", marginTop: 4, letterSpacing: 0.4 }}>MULTI-BRANCH OPERATIONS</div>
      </div>
      <div style={{ padding: "14px 12px", flex: 1 }}>
        {NAV.map((n) => {
          const Icon = n.icon;
          const activeItem = view === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 11,
                padding: "10px 12px", marginBottom: 3, borderRadius: 8, border: "none",
                background: activeItem ? C.rust : "transparent",
                color: activeItem ? "#FBF3EA" : "#D8CBB2",
                fontSize: 14, fontWeight: 500, textAlign: "left", position: "relative",
                transition: "background 0.15s",
              }}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              {n.label}
              {n.id === "notifications" && unread > 0 && (
                <span style={{ marginLeft: "auto", background: activeItem ? "#FBF3EA" : C.gold, color: activeItem ? C.rust : "#2B2620", fontSize: 11, fontWeight: 600, borderRadius: 20, padding: "1px 7px" }}>{unread}</span>
              )}
            </button>
          );
        })}
      </div>
      <div style={{ padding: "16px 22px", borderTop: "1px solid #3A2F24", fontSize: 11.5, color: "#8A7C63" }}>
        Prototype build · in-memory data
      </div>
    </div>
  );
}

function Topbar({ ctx }) {
  const { branches, activeBranchId, setActiveBranchId, view } = ctx;
  const title = NAV.find((n) => n.id === view)?.label || "";
  return (
    <div style={{ height: 68, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 36px", background: C.card, flexShrink: 0 }}>
      <div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 22, margin: 0 }}>{title}</h1>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 12.5, color: C.textMuted }}>Current branch</span>
        <div style={{ position: "relative" }}>
          <select
            value={activeBranchId}
            onChange={(e) => setActiveBranchId(e.target.value)}
            style={{
              appearance: "none", padding: "8px 34px 8px 14px", borderRadius: 8,
              border: `1px solid ${C.border}`, background: C.paperDeep, fontSize: 13.5,
              fontWeight: 500, color: C.text,
            }}
          >
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <ChevronDown size={14} style={{ position: "absolute", right: 12, top: 10, pointerEvents: "none", color: C.textMuted }} />
        </div>
      </div>
    </div>
  );
}

function Card({ children, style }) {
  return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, ...style }}>{children}</div>;
}

function Badge({ children, color, bg }) {
  return <span style={{ fontSize: 11.5, fontWeight: 600, color, background: bg, padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap" }}>{children}</span>;
}

function Btn({ children, onClick, variant = "secondary", style, disabled, type = "button" }) {
  const base = { border: "none", borderRadius: 8, padding: "9px 15px", fontSize: 13.5, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 7, opacity: disabled ? 0.5 : 1 };
  const variants = {
    primary: { background: C.rust, color: "#FBF3EA" },
    secondary: { background: C.paperDeep, color: C.text, border: `1px solid ${C.border}` },
    ghost: { background: "transparent", color: C.textMuted },
    danger: { background: "#F5E6E3", color: "#8F3517" },
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
      <div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 600 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */
function Dashboard({ ctx }) {
  const { branch, branchTables, reservations, payments, notifications, setView } = ctx;
  const occupied = branchTables.filter((t) => t.status === "occupied").length;
  const available = branchTables.filter((t) => t.status === "available").length;
  const today = todayStr();
  const resToday = reservations.filter((r) => r.branchId === branch.id && r.date === today && r.status === "confirmed").length;
  const revenueToday = payments.filter((p) => p.branchId === branch.id && new Date(p.time).toISOString().slice(0, 10) === today).reduce((s, p) => s + p.total, 0);

  const stats = [
    { label: "Tables total", value: branchTables.length },
    { label: "Occupied now", value: occupied },
    { label: "Available now", value: available },
    { label: "Reservations today", value: resToday },
    { label: "Revenue today", value: fmt(revenueToday), mono: true },
  ];

  return (
    <div>
      <SectionHeader title={`${branch.name} overview`} subtitle={branch.address} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 26 }}>
        {stats.map((s) => (
          <Card key={s.label}>
            <div style={{ fontSize: 12.5, color: C.textMuted, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: s.mono ? FONT_MONO : FONT_DISPLAY, fontSize: 24, fontWeight: 600 }}>{s.value}</div>
          </Card>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18 }}>
        <Card>
          <div style={{ fontWeight: 600, marginBottom: 12, fontFamily: FONT_DISPLAY, fontSize: 16 }}>Quick actions</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Btn variant="primary" onClick={() => setView("floor")}><MapPin size={15} />Open floor plan</Btn>
            <Btn onClick={() => setView("reservations")}><CalendarDays size={15} />New reservation</Btn>
            <Btn onClick={() => setView("menu")}><UtensilsCrossed size={15} />Manage menu</Btn>
            <Btn onClick={() => setView("payment")}><CreditCard size={15} />Take payment</Btn>
          </div>
        </Card>
        <Card>
          <div style={{ fontWeight: 600, marginBottom: 12, fontFamily: FONT_DISPLAY, fontSize: 16 }}>Recent notifications</div>
          {notifications.slice(0, 4).map((n) => (
            <div key={n.id} style={{ fontSize: 13, padding: "7px 0", borderBottom: `1px solid ${C.border}`, color: n.read ? C.textMuted : C.text }}>{n.message}</div>
          ))}
          {notifications.length === 0 && <div style={{ fontSize: 13, color: C.textMuted }}>No notifications yet.</div>}
        </Card>
      </div>
    </div>
  );
}

/* ---------------- BRANCHES ---------------- */
function BranchesView({ ctx }) {
  const { branches, setBranches, activeBranchId, setActiveBranchId, notify } = ctx;
  const [form, setForm] = useState(null);
  const [staffInput, setStaffInput] = useState({});

  function startAdd() { setForm({ id: null, name: "", address: "", manager: "" }); }
  function save() {
    if (!form.name.trim()) return;
    if (form.id) {
      setBranches((bs) => bs.map((b) => (b.id === form.id ? { ...b, ...form } : b)));
      notify("info", `Branch "${form.name}" updated.`);
    } else {
      const nb = { id: uid(), name: form.name, address: form.address, manager: form.manager, staff: [] };
      setBranches((bs) => [...bs, nb]);
      notify("info", `Branch "${form.name}" added.`);
    }
    setForm(null);
  }
  function remove(id) {
    if (branches.length <= 1) return;
    const b = branches.find((x) => x.id === id);
    setBranches((bs) => bs.filter((x) => x.id !== id));
    if (activeBranchId === id) setActiveBranchId(branches.find((x) => x.id !== id).id);
    notify("info", `Branch "${b.name}" removed.`);
  }
  function addStaff(branchId) {
    const name = (staffInput[branchId] || "").trim();
    if (!name) return;
    setBranches((bs) => bs.map((b) => (b.id === branchId ? { ...b, staff: [...b.staff, name] } : b)));
    setStaffInput((s) => ({ ...s, [branchId]: "" }));
  }
  function removeStaff(branchId, name) {
    setBranches((bs) => bs.map((b) => (b.id === branchId ? { ...b, staff: b.staff.filter((s) => s !== name) } : b)));
  }

  return (
    <div>
      <SectionHeader title="Branches" subtitle="Add, edit, and manage every location from one place." action={<Btn variant="primary" onClick={startAdd}><Plus size={15} />Add branch</Btn>} />
      {form && (
        <Card style={{ marginBottom: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
            <Field label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} /></Field>
            <Field label="Address"><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={inputStyle} /></Field>
            <Field label="Manager"><input value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} style={inputStyle} /></Field>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="primary" onClick={save}><Check size={15} />Save</Btn>
              <Btn variant="ghost" onClick={() => setForm(null)}><X size={15} /></Btn>
            </div>
          </div>
        </Card>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {branches.map((b) => (
          <Card key={b.id} style={{ border: b.id === activeBranchId ? `2px solid ${C.rust}` : `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 17 }}>{b.name}</div>
                <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>{b.address}</div>
              </div>
              {b.id === activeBranchId && <Badge color={C.rustDeep} bg="#F5E6E3">Current</Badge>}
            </div>
            <div style={{ fontSize: 13, marginTop: 12 }}><strong>Manager:</strong> {b.manager || "Unassigned"}</div>
            <div style={{ fontSize: 13, marginTop: 8, color: C.textMuted }}>Staff</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6, marginBottom: 8 }}>
              {b.staff.map((s) => (
                <span key={s} style={{ fontSize: 12.5, background: C.paperDeep, padding: "4px 8px", borderRadius: 20, display: "flex", alignItems: "center", gap: 5 }}>
                  {s} <X size={11} style={{ cursor: "pointer" }} onClick={() => removeStaff(b.id, s)} />
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input placeholder="Add staff name" value={staffInput[b.id] || ""} onChange={(e) => setStaffInput((s) => ({ ...s, [b.id]: e.target.value }))} style={{ ...inputStyle, flex: 1 }} />
              <Btn onClick={() => addStaff(b.id)}><Plus size={14} /></Btn>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {b.id !== activeBranchId && <Btn onClick={() => setActiveBranchId(b.id)}><ArrowRightLeft size={14} />Switch to</Btn>}
              <Btn onClick={() => setForm(b)}><Pencil size={14} />Edit</Btn>
              <Btn variant="danger" onClick={() => remove(b.id)} disabled={branches.length <= 1}><Trash2 size={14} />Remove</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle = { width: "100%", padding: "9px 11px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13.5, background: "#fff" };

/* ---------------- MENU ---------------- */
function MenuView({ ctx }) {
  const { menuItems, setMenuItems, branch, notify } = ctx;
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(null);

  const filtered = menuItems.filter((m) => (category === "All" || m.category === category) && m.name.toLowerCase().includes(search.toLowerCase()));

  function startAdd() { setForm({ id: null, name: "", category: "Appetizers", emoji: "🍽️", basePrice: 10 }); }
  function save() {
    if (!form.name.trim()) return;
    if (form.id) {
      setMenuItems((ms) => ms.map((m) => (m.id === form.id ? { ...m, name: form.name, category: form.category, emoji: form.emoji, basePrice: Number(form.basePrice) } : m)));
    } else {
      const item = {
        id: uid(), name: form.name, category: form.category, emoji: form.emoji || "🍽️", basePrice: Number(form.basePrice),
        branchPrice: Object.fromEntries(ctx.branches.map((b) => [b.id, Number(form.basePrice)])),
        branchAvailable: Object.fromEntries(ctx.branches.map((b) => [b.id, true])),
      };
      setMenuItems((ms) => [...ms, item]);
      notify("info", `Menu item "${form.name}" added.`);
    }
    setForm(null);
  }
  function remove(id) {
    const m = menuItems.find((x) => x.id === id);
    setMenuItems((ms) => ms.filter((x) => x.id !== id));
    notify("info", `Menu item "${m.name}" removed.`);
  }
  function setBranchPrice(id, price) {
    setMenuItems((ms) => ms.map((m) => (m.id === id ? { ...m, branchPrice: { ...m.branchPrice, [branch.id]: Number(price) } } : m)));
  }
  function toggleAvail(id) {
    setMenuItems((ms) => ms.map((m) => (m.id === id ? { ...m, branchAvailable: { ...m.branchAvailable, [branch.id]: !m.branchAvailable[branch.id] } } : m)));
  }

  return (
    <div>
      <SectionHeader title="Menu items" subtitle={`Editing availability and pricing for ${branch.name}.`} action={<Btn variant="primary" onClick={startAdd}><Plus size={15} />Add item</Btn>} />
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        {["All", ...CATEGORIES].map((c) => (
          <button key={c} onClick={() => setCategory(c)} style={{ border: "none", borderRadius: 20, padding: "7px 14px", fontSize: 13, fontWeight: 500, background: category === c ? C.rust : C.paperDeep, color: category === c ? "#FBF3EA" : C.text }}>{c}</button>
        ))}
        <div style={{ position: "relative", marginLeft: "auto", width: 240 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: C.textMuted }} />
          <input placeholder="Search menu" value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: 30 }} />
        </div>
      </div>

      {form && (
        <Card style={{ marginBottom: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "60px 2fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
            <Field label="Icon"><input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} style={inputStyle} /></Field>
            <Field label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} /></Field>
            <Field label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Base price"><input type="number" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} style={inputStyle} /></Field>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="primary" onClick={save}><Check size={15} />Save</Btn>
              <Btn variant="ghost" onClick={() => setForm(null)}><X size={15} /></Btn>
            </div>
          </div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {filtered.map((m) => {
          const avail = m.branchAvailable[branch.id];
          return (
            <Card key={m.id} style={{ opacity: avail ? 1 : 0.55 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 26 }}>{m.emoji}</div>
                <Badge color={C.sage} bg="#EAEEE3">{m.category}</Badge>
              </div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15.5, marginTop: 8 }}>{m.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                <span style={{ fontSize: 12, color: C.textMuted }}>Price at {branch.name.split(" ")[0]}:</span>
                <input type="number" value={m.branchPrice[branch.id]} onChange={(e) => setBranchPrice(m.id, e.target.value)} style={{ ...inputStyle, width: 70, padding: "4px 8px", fontFamily: FONT_MONO, fontSize: 13 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <button onClick={() => toggleAvail(m.id)} style={{ border: "none", background: "none", display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: avail ? "#3F8F5F" : "#B5342B", fontWeight: 500 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: avail ? "#3F8F5F" : "#B5342B", display: "inline-block" }} />
                  {avail ? "Available" : "Unavailable"}
                </button>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn variant="ghost" style={{ padding: 6 }} onClick={() => setForm({ id: m.id, name: m.name, category: m.category, emoji: m.emoji, basePrice: m.basePrice })}><Pencil size={14} /></Btn>
                  <Btn variant="ghost" style={{ padding: 6 }} onClick={() => remove(m.id)}><Trash2 size={14} /></Btn>
                </div>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && <div style={{ color: C.textMuted, fontSize: 13.5 }}>No menu items match your filters.</div>}
      </div>
    </div>
  );
}

/* ---------------- FLOOR PLAN / WALK-IN / SEARCH ---------------- */
function FloorPlanView({ ctx }) {
  const { tables, setTables, branchTables, branch, menuItems, notify, setView, tick } = ctx;
  const [selectedId, setSelectedId] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [capFilter, setCapFilter] = useState("All");
  const floorRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  const selected = tables.find((t) => t.id === selectedId);

  useEffect(() => {
    if (!dragId) return;
    function onMove(e) {
      const rect = floorRef.current.getBoundingClientRect();
      let nx = e.clientX - rect.left - offset.current.x;
      let ny = e.clientY - rect.top - offset.current.y;
      nx = Math.max(4, Math.min(nx, rect.width - 96));
      ny = Math.max(4, Math.min(ny, rect.height - 96));
      setTables((ts) => ts.map((t) => (t.id === dragId ? { ...t, x: nx, y: ny } : t)));
    }
    function onUp() { setDragId(null); }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragId]);

  function startDrag(e, t) {
    e.stopPropagation();
    const rect = floorRef.current.getBoundingClientRect();
    offset.current = { x: e.clientX - rect.left - t.x, y: e.clientY - rect.top - t.y };
    setDragId(t.id);
  }

  function matches(t) {
    const qq = q.trim().toLowerCase();
    const matchQ = !qq || String(t.number).includes(qq);
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    const matchCap = capFilter === "All" || (capFilter === "small" && t.capacity <= 2) || (capFilter === "medium" && t.capacity > 2 && t.capacity < 6) || (capFilter === "large" && t.capacity >= 6);
    return matchQ && matchStatus && matchCap;
  }

  function updateTable(id, patch) {
    setTables((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function seatWalkIn(id, guests) {
    updateTable(id, { status: "occupied", guests: Number(guests), seatedAt: Date.now(), order: [] });
    notify("success", `Table ${tables.find((t) => t.id === id).number} seated with ${guests} guests.`);
  }
  function setStatus(id, status) {
    const patch = { status };
    if (status === "available") { patch.guests = null; patch.seatedAt = null; patch.order = []; }
    updateTable(id, patch);
    if (status === "available") notify("info", `Table ${tables.find((t) => t.id === id).number} marked ready — table ready for the next party.`);
  }
  function moveGuests(fromId, toId) {
    const from = tables.find((t) => t.id === fromId);
    updateTable(toId, { status: "occupied", guests: from.guests, seatedAt: from.seatedAt, order: from.order });
    updateTable(fromId, { status: "cleaning", guests: null, seatedAt: null, order: [] });
    setSelectedId(toId);
    notify("info", `Moved party from table ${from.number} to table ${tables.find((t) => t.id === toId).number}.`);
  }
  function addOrderItem(tableId, itemId) {
    setTables((ts) => ts.map((t) => {
      if (t.id !== tableId) return t;
      const existing = t.order.find((o) => o.itemId === itemId);
      if (existing) return { ...t, order: t.order.map((o) => (o.itemId === itemId ? { ...o, qty: o.qty + 1 } : o)) };
      return { ...t, order: [...t.order, { itemId, qty: 1 }] };
    }));
  }
  function removeOrderItem(tableId, itemId) {
    setTables((ts) => ts.map((t) => (t.id === tableId ? { ...t, order: t.order.filter((o) => o.itemId !== itemId) } : t)));
  }

  const elapsedLabel = (seatedAt) => {
    if (!seatedAt) return "—";
    const mins = Math.max(0, Math.round((Date.now() - seatedAt) / 60000));
    return `${mins} min`;
  };

  return (
    <div>
      <SectionHeader title="Floor plan" subtitle={`${branch.name} — drag tables by the grip handle to rearrange the layout.`} />
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", width: 160 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: C.textMuted }} />
          <input placeholder="Table number" value={q} onChange={(e) => setQ(e.target.value)} style={{ ...inputStyle, paddingLeft: 30 }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={inputStyle}>
          <option value="All">All statuses</option>
          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={capFilter} onChange={(e) => setCapFilter(e.target.value)} style={inputStyle}>
          <option value="All">All capacities</option>
          <option value="small">1–2 guests</option>
          <option value="medium">3–5 guests</option>
          <option value="large">6+ guests</option>
        </select>
        <div style={{ marginLeft: "auto", display: "flex", gap: 14, fontSize: 12.5, color: C.textMuted }}>
          {Object.entries(STATUS).map(([k, v]) => (
            <span key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: v.color, display: "inline-block" }} />{v.label}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 300px" : "1fr", gap: 18 }}>
        <div
          ref={floorRef}
          onClick={() => setSelectedId(null)}
          style={{
            position: "relative", height: 520, borderRadius: 14, border: `1px solid ${C.border}`,
            background: `${C.paperDeep} radial-gradient(#DED0AE 1px, transparent 1px)`,
            backgroundSize: "16px 16px", overflow: "hidden",
          }}
        >
          {branchTables.map((t) => {
            const s = STATUS[t.status];
            const dim = !matches(t);
            const size = t.capacity >= 6 ? 92 : t.capacity >= 4 ? 78 : 64;
            return (
              <div
                key={t.id}
                onClick={(e) => { e.stopPropagation(); setSelectedId(t.id); }}
                style={{
                  position: "absolute", left: t.x, top: t.y, width: size, height: size,
                  borderRadius: t.shape === "round" ? "50%" : 14,
                  background: s.bg, border: `2px solid ${selectedId === t.id ? C.rust : s.color}`,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  opacity: dim ? 0.28 : 1, cursor: "pointer", userSelect: "none",
                  boxShadow: selectedId === t.id ? `0 0 0 3px rgba(181,69,31,0.15)` : "none",
                }}
              >
                <div onMouseDown={(e) => startDrag(e, t)} style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", background: "#fff", border: `1px solid ${C.border}`, borderRadius: 6, padding: 2, cursor: "grab" }}>
                  <GripVertical size={12} color={C.textMuted} />
                </div>
                <div style={{ fontFamily: FONT_MONO, fontWeight: 600, fontSize: 15, color: s.color }}>#{t.number}</div>
                <div style={{ fontSize: 10.5, color: C.textMuted, display: "flex", alignItems: "center", gap: 2 }}><Users size={10} />{t.capacity}</div>
              </div>
            );
          })}
        </div>

        {selected && (
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 17 }}>Table #{selected.number}</div>
                <div style={{ fontSize: 12.5, color: C.textMuted }}>Seats up to {selected.capacity}</div>
              </div>
              <Badge color={STATUS[selected.status].color} bg={STATUS[selected.status].bg}>{STATUS[selected.status].label}</Badge>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "14px 0" }}>
              {Object.entries(STATUS).map(([k, v]) => (
                <button key={k} onClick={() => setStatus(selected.id, k)} style={{ fontSize: 11.5, border: `1px solid ${selected.status === k ? v.color : C.border}`, background: selected.status === k ? v.bg : "#fff", color: v.color, borderRadius: 20, padding: "5px 10px", fontWeight: 500 }}>{v.label}</button>
              ))}
            </div>

            {selected.status === "available" && <WalkInForm onSeat={(guests) => seatWalkIn(selected.id, guests)} />}

            {selected.status === "occupied" && (
              <div>
                <div style={{ fontSize: 13, marginBottom: 6 }}><Users size={13} style={{ verticalAlign: -2 }} /> {selected.guests} guests · <Clock size={13} style={{ verticalAlign: -2 }} /> {elapsedLabel(selected.seatedAt)}</div>
                <div style={{ fontSize: 12.5, color: C.textMuted, marginTop: 10, marginBottom: 6 }}>Order</div>
                <OrderBuilder table={selected} menuItems={menuItems.filter((m) => m.branchAvailable[branch.id])} onAdd={(itemId) => addOrderItem(selected.id, itemId)} onRemove={(itemId) => removeOrderItem(selected.id, itemId)} />
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
                  <MoveTableSelect currentId={selected.id} tables={branchTables} onMove={(toId) => moveGuests(selected.id, toId)} />
                  <Btn variant="primary" onClick={() => setView("payment")}><CreditCard size={14} />Send to payment</Btn>
                </div>
              </div>
            )}

            {selected.status === "reserved" && (
              <div style={{ fontSize: 13, color: C.textMuted }}>Held for an upcoming reservation. Seat the party once they arrive by switching this table to Occupied.</div>
            )}
            {selected.status === "cleaning" && (
              <div style={{ fontSize: 13, color: C.textMuted }}>Being reset by staff. Mark it Available once it's ready for the next party.</div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

function WalkInForm({ onSeat }) {
  const [guests, setGuests] = useState(2);
  return (
    <div>
      <Field label="Seat a walk-in — number of guests">
        <div style={{ display: "flex", gap: 8 }}>
          <input type="number" min={1} value={guests} onChange={(e) => setGuests(e.target.value)} style={inputStyle} />
          <Btn variant="primary" onClick={() => onSeat(guests)}><Check size={14} />Seat</Btn>
        </div>
      </Field>
    </div>
  );
}

function OrderBuilder({ table, menuItems, onAdd, onRemove }) {
  const [pick, setPick] = useState(menuItems[0]?.id || "");
  const subtotal = table.order.reduce((s, o) => {
    const m = menuItems.find((mi) => mi.id === o.itemId) || { branchPrice: {} };
    return s;
  }, 0);
  return (
    <div>
      {table.order.map((o) => {
        const m = menuItems.find((mi) => mi.id === o.itemId);
        if (!m) return null;
        return (
          <div key={o.itemId} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
            <span>{m.emoji} {m.name} × {o.qty}</span>
            <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontFamily: FONT_MONO }}>{fmt(m.basePrice * o.qty)}</span>
              <X size={12} style={{ cursor: "pointer", color: C.textMuted }} onClick={() => onRemove(o.itemId)} />
            </span>
          </div>
        );
      })}
      {table.order.length === 0 && <div style={{ fontSize: 12.5, color: C.textMuted, padding: "6px 0" }}>No items added yet.</div>}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <select value={pick} onChange={(e) => setPick(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
          {menuItems.map((m) => <option key={m.id} value={m.id}>{m.emoji} {m.name}</option>)}
        </select>
        <Btn onClick={() => pick && onAdd(pick)}><Plus size={14} /></Btn>
      </div>
    </div>
  );
}

function MoveTableSelect({ currentId, tables, onMove }) {
  const options = tables.filter((t) => t.id !== currentId && t.status === "available");
  const [target, setTarget] = useState("");
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <select value={target} onChange={(e) => setTarget(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
        <option value="">Move party to…</option>
        {options.map((t) => <option key={t.id} value={t.id}>Table #{t.number} (seats {t.capacity})</option>)}
      </select>
      <Btn onClick={() => target && onMove(target)} disabled={!target}><ArrowRightLeft size={14} /></Btn>
    </div>
  );
}

/* ---------------- RESERVATIONS ---------------- */
function ReservationsView({ ctx }) {
  const { reservations, setReservations, branch, branchTables, setTables, notify } = ctx;
  const [form, setForm] = useState({ customerName: "", phone: "", date: todayStr(), time: "19:00", guests: 2, tableId: "auto", specialRequests: "" });
  const [error, setError] = useState("");
  const [cancelId, setCancelId] = useState(null);
  const [reason, setReason] = useState("");

  const branchRes = reservations.filter((r) => r.branchId === branch.id).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  function findConflict(tableNumber, date, time) {
    return reservations.some((r) => r.branchId === branch.id && r.tableNumber === tableNumber && r.date === date && r.time === time && r.status === "confirmed");
  }

  function confirm() {
    setError("");
    if (!form.customerName.trim()) { setError("Enter a customer name."); return; }
    let tableNumber = null;
    if (form.tableId === "auto") {
      const candidate = branchTables.find((t) => t.capacity >= Number(form.guests) && !findConflict(t.number, form.date, form.time));
      if (!candidate) { setError("No table available for that party size and time."); return; }
      tableNumber = candidate.number;
    } else {
      const t = branchTables.find((t) => t.id === form.tableId);
      tableNumber = t.number;
      if (findConflict(tableNumber, form.date, form.time)) { setError(`Table #${tableNumber} is already booked at ${form.time} on ${form.date}.`); return; }
    }
    const res = { id: uid(), branchId: branch.id, customerName: form.customerName, phone: form.phone, date: form.date, time: form.time, guests: Number(form.guests), tableNumber, specialRequests: form.specialRequests, status: "confirmed", cancellationReason: null };
    setReservations((rs) => [...rs, res]);
    const t = branchTables.find((t) => t.number === tableNumber);
    if (t && t.status === "available") setTables((ts) => ts.map((x) => (x.id === t.id ? { ...x, status: "reserved" } : x)));
    notify("success", `Reservation confirmed for ${form.customerName} — table #${tableNumber}, ${form.date} at ${form.time}.`);
    setForm({ customerName: "", phone: "", date: todayStr(), time: "19:00", guests: 2, tableId: "auto", specialRequests: "" });
  }

  function doCancel(id) {
    const r = reservations.find((x) => x.id === id);
    setReservations((rs) => rs.map((x) => (x.id === id ? { ...x, status: "cancelled", cancellationReason: reason || "No reason given" } : x)));
    const t = branchTables.find((t) => t.number === r.tableNumber);
    if (t && t.status === "reserved") setTables((ts) => ts.map((x) => (x.id === t.id ? { ...x, status: "available" } : x)));
    notify("warning", `Reservation for ${r.customerName} cancelled — table #${r.tableNumber} released.`);
    setCancelId(null);
    setReason("");
  }

  return (
    <div>
      <SectionHeader title="Table reservations" subtitle={`Advance bookings for ${branch.name}.`} />
      <Card style={{ marginBottom: 22 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 0.8fr 0.8fr 0.7fr 1.3fr", gap: 10 }}>
          <Field label="Customer name"><input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} style={inputStyle} /></Field>
          <Field label="Phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} /></Field>
          <Field label="Date"><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} /></Field>
          <Field label="Time"><input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} style={inputStyle} /></Field>
          <Field label="Guests"><input type="number" min={1} value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} style={inputStyle} /></Field>
          <Field label="Table">
            <select value={form.tableId} onChange={(e) => setForm({ ...form, tableId: e.target.value })} style={inputStyle}>
              <option value="auto">Auto-assign</option>
              {branchTables.map((t) => <option key={t.id} value={t.id}>Table #{t.number} (seats {t.capacity})</option>)}
            </select>
          </Field>
        </div>
        <div style={{ marginTop: 10 }}>
          <Field label="Special requests"><input value={form.specialRequests} onChange={(e) => setForm({ ...form, specialRequests: e.target.value })} style={inputStyle} placeholder="Allergies, occasion, seating preference…" /></Field>
        </div>
        {error && <div style={{ color: "#B5342B", fontSize: 13, marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}><AlertCircle size={14} />{error}</div>}
        <div style={{ marginTop: 12 }}><Btn variant="primary" onClick={confirm}><Check size={14} />Confirm reservation</Btn></div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {branchRes.map((r) => (
          <Card key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.customerName} <span style={{ fontWeight: 400, color: C.textMuted, fontSize: 12.5 }}>· {r.phone}</span></div>
              <div style={{ fontSize: 12.5, color: C.textMuted, marginTop: 3 }}>{r.date} at {r.time} · {r.guests} guests · Table #{r.tableNumber}{r.specialRequests ? ` · "${r.specialRequests}"` : ""}</div>
              {r.status === "cancelled" && <div style={{ fontSize: 12, color: "#B5342B", marginTop: 3 }}>Cancelled — {r.cancellationReason}</div>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Badge color={r.status === "confirmed" ? "#3F8F5F" : "#B5342B"} bg={r.status === "confirmed" ? "#E7F1EA" : "#F5E6E3"}>{r.status}</Badge>
              {r.status === "confirmed" && cancelId !== r.id && <Btn variant="ghost" onClick={() => setCancelId(r.id)}><X size={13} />Cancel</Btn>}
            </div>
            {cancelId === r.id && (
              <div style={{ position: "absolute" }} />
            )}
          </Card>
        ))}
        {cancelId && (
          <Card>
            <Field label="Reason for cancellation">
              <div style={{ display: "flex", gap: 8 }}>
                <input value={reason} onChange={(e) => setReason(e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="Guest requested cancellation…" />
                <Btn variant="danger" onClick={() => doCancel(cancelId)}>Confirm cancel</Btn>
                <Btn variant="ghost" onClick={() => { setCancelId(null); setReason(""); }}>Back</Btn>
              </div>
            </Field>
          </Card>
        )}
        {branchRes.length === 0 && <div style={{ color: C.textMuted, fontSize: 13.5 }}>No reservations yet for this branch.</div>}
      </div>
    </div>
  );
}

/* ---------------- PAYMENT ---------------- */
function PaymentView({ ctx }) {
  const { branchTables, menuItems, setTables, payments, setPayments, branch, notify } = ctx;
  const occupiedTables = branchTables.filter((t) => t.status === "occupied");
  const [tableId, setTableId] = useState(occupiedTables[0]?.id || "");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(8);
  const [tip, setTip] = useState(15);
  const [split, setSplit] = useState(1);
  const [method, setMethod] = useState("card");

  useEffect(() => {
    if (!occupiedTables.find((t) => t.id === tableId)) setTableId(occupiedTables[0]?.id || "");
  }, [branchTables]);

  const table = branchTables.find((t) => t.id === tableId);
  const items = table ? table.order.map((o) => ({ ...o, item: menuItems.find((m) => m.id === o.itemId) })).filter((o) => o.item) : [];
  const subtotal = items.reduce((s, o) => s + o.item.branchPrice[branch.id] * o.qty, 0);
  const discountAmt = subtotal * (Number(discount) / 100);
  const taxAmt = (subtotal - discountAmt) * (Number(tax) / 100);
  const tipAmt = (subtotal - discountAmt) * (Number(tip) / 100);
  const total = subtotal - discountAmt + taxAmt + tipAmt;
  const perGuest = total / Math.max(1, Number(split));

  function confirmPayment() {
    if (!table || items.length === 0) return;
    const record = { id: uid(), branchId: branch.id, tableNumber: table.number, items, subtotal, discount: discountAmt, tax: taxAmt, tip: tipAmt, total, method, time: Date.now() };
    setPayments((p) => [record, ...p]);
    setTables((ts) => ts.map((t) => (t.id === table.id ? { ...t, status: "cleaning", guests: null, seatedAt: null, order: [] } : t)));
    notify("success", `Payment confirmed — table #${table.number}, ${fmt(total)} via ${method}.`);
    setDiscount(0); setTip(15); setSplit(1);
  }

  return (
    <div>
      <SectionHeader title="Payment" subtitle={`Generate and settle bills for ${branch.name}.`} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        <Card>
          <Field label="Table">
            <select value={tableId} onChange={(e) => setTableId(e.target.value)} style={inputStyle}>
              <option value="">Select an occupied table</option>
              {occupiedTables.map((t) => <option key={t.id} value={t.id}>Table #{t.number} · {t.guests} guests</option>)}
            </select>
          </Field>
          {table ? (
            <div style={{ marginTop: 16, fontFamily: FONT_MONO, fontSize: 13.5 }}>
              {items.map((o) => (
                <div key={o.itemId} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px dashed ${C.border}` }}>
                  <span>{o.item.name} × {o.qty}</span>
                  <span>{fmt(o.item.branchPrice[branch.id] * o.qty)}</span>
                </div>
              ))}
              {items.length === 0 && <div style={{ fontFamily: FONT_BODY, color: C.textMuted, fontSize: 13 }}>No order recorded for this table yet — add items from the floor plan.</div>}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", fontWeight: 600 }}><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            </div>
          ) : <div style={{ color: C.textMuted, fontSize: 13.5, marginTop: 14 }}>No occupied tables to bill right now.</div>}
        </Card>

        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Discount %"><input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} style={inputStyle} /></Field>
            <Field label="Tax %"><input type="number" value={tax} onChange={(e) => setTax(e.target.value)} style={inputStyle} /></Field>
            <Field label="Tip %"><input type="number" value={tip} onChange={(e) => setTip(e.target.value)} style={inputStyle} /></Field>
            <Field label="Split between (guests)"><input type="number" min={1} value={split} onChange={(e) => setSplit(e.target.value)} style={inputStyle} /></Field>
            <Field label="Payment method">
              <div style={{ display: "flex", gap: 6 }}>
                {["cash", "card", "wallet"].map((m) => (
                  <button key={m} onClick={() => setMethod(m)} style={{ flex: 1, border: `1px solid ${method === m ? C.rust : C.border}`, background: method === m ? "#F5E6E3" : "#fff", color: method === m ? C.rustDeep : C.text, borderRadius: 8, padding: "8px 6px", fontSize: 12.5, textTransform: "capitalize" }}>{m === "wallet" ? "Mobile wallet" : m}</button>
                ))}
              </div>
            </Field>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, fontFamily: FONT_MONO, fontSize: 13.5 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Tax</span><span>{fmt(taxAmt)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Tip</span><span>{fmt(tipAmt)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Discount</span><span>-{fmt(discountAmt)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, marginTop: 6 }}><span>Total</span><span>{fmt(total)}</span></div>
              {Number(split) > 1 && <div style={{ display: "flex", justifyContent: "space-between", color: C.textMuted, fontSize: 12.5 }}><span>Per guest × {split}</span><span>{fmt(perGuest)}</span></div>}
            </div>
            <Btn variant="primary" disabled={!table || items.length === 0} onClick={confirmPayment}><CreditCard size={15} />Confirm payment</Btn>
            <Btn disabled={!table} onClick={() => notify("info", `Receipt emailed for table #${table?.number}.`)}><Mail size={14} />Email receipt</Btn>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 26 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Payment history</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {payments.filter((p) => p.branchId === branch.id).slice(0, 8).map((p) => (
            <Card key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Receipt size={16} color={C.textMuted} />
                <div style={{ fontSize: 13 }}>Table #{p.tableNumber} · {new Date(p.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · <span style={{ textTransform: "capitalize" }}>{p.method}</span></div>
              </div>
              <div style={{ fontFamily: FONT_MONO, fontWeight: 600 }}>{fmt(p.total)}</div>
            </Card>
          ))}
          {payments.filter((p) => p.branchId === branch.id).length === 0 && <div style={{ color: C.textMuted, fontSize: 13.5 }}>No payments recorded yet.</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------------- NOTIFICATIONS ---------------- */
function NotificationsView({ ctx }) {
  const { notifications, setNotifications } = ctx;
  const [filter, setFilter] = useState("all");
  const list = notifications.filter((n) => filter === "all" || !n.read);

  const icon = (type) => {
    if (type === "success") return <CheckCircle2 size={16} color="#3F8F5F" />;
    if (type === "warning") return <AlertCircle size={16} color="#B5342B" />;
    return <BellRing size={16} color={C.gold} />;
  };

  return (
    <div>
      <SectionHeader title="Notifications" subtitle="Reservation confirmations, cancellations, payments, and table alerts." />
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["all", "unread"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 500, textTransform: "capitalize", background: filter === f ? C.rust : C.paperDeep, color: filter === f ? "#FBF3EA" : C.text }}>{f}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {list.map((n) => (
          <Card key={n.id} onClick={() => setNotifications((ns) => ns.map((x) => (x.id === n.id ? { ...x, read: true } : x)))} style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer", background: n.read ? C.card : "#FBF3E7" }}>
            {icon(n.type)}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5 }}>{n.message}</div>
              <div style={{ fontSize: 11.5, color: C.textMuted, marginTop: 3 }}>{new Date(n.time).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</div>
            </div>
            {!n.read && <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.rust, marginTop: 5 }} />}
          </Card>
        ))}
        {list.length === 0 && <div style={{ color: C.textMuted, fontSize: 13.5 }}>Nothing here.</div>}
      </div>
    </div>
  );
}

export default App;

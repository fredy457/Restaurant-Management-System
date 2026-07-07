import React from "react";
import { MapPin, CalendarDays, UtensilsCrossed, CreditCard } from "lucide-react";
import { Card, Btn, SectionHeader } from "../components/ui.jsx";
import { C, FONT_DISPLAY, FONT_MONO } from "../data/theme.js";
import { fmt, todayStr } from "../utils/helpers.js";

export default function DashboardView({ ctx }) {
  const { branch, branchTables, reservations, payments, notifications, setView, user } = ctx;
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
            {(user.role === "admin" || user.role === "manager") && <Btn onClick={() => setView("menu")}><UtensilsCrossed size={15} />Manage menu</Btn>}
            {(user.role === "admin" || user.role === "manager") && <Btn onClick={() => setView("payment")}><CreditCard size={15} />Take payment</Btn>}
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

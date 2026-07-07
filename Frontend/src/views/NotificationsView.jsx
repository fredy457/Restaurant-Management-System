import React, { useState } from "react";
import { CheckCircle2, AlertCircle, BellRing } from "lucide-react";
import { Card, SectionHeader } from "../components/ui.jsx";
import { C } from "../data/theme.js";

export default function NotificationsView({ ctx }) {
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

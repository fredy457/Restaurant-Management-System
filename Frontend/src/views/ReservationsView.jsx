import React, { useState } from "react";
import { AlertCircle, Check, X } from "lucide-react";
import { Card, Badge, Btn, Field, SectionHeader } from "../components/ui.jsx";
import { C, inputStyle } from "../data/theme.js";
import { uid, todayStr } from "../utils/helpers.js";

export default function ReservationsView({ ctx }) {
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

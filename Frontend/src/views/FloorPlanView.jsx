import React, { useState, useRef, useEffect } from "react";
import { Search, Users, Clock, GripVertical, Check, ArrowRightLeft, CreditCard, Plus, X } from "lucide-react";
import { Card, Badge, Btn, Field, SectionHeader } from "../components/ui.jsx";
import { C, FONT_MONO, STATUS, inputStyle } from "../data/theme.js";
import { fmt } from "../utils/helpers.js";

export default function FloorPlanView({ ctx }) {
  const { tables, setTables, branchTables, branch, menuItems, notify, setView } = ctx;
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
    if (status === "available") notify("info", `Table ${tables.find((t) => t.id === id).number} marked ready for the next party.`);
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
                <div style={{ fontFamily: "inherit", fontWeight: 600, fontSize: 17 }}>Table #{selected.number}</div>
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
    <Field label="Seat a walk-in — number of guests">
      <div style={{ display: "flex", gap: 8 }}>
        <input type="number" min={1} value={guests} onChange={(e) => setGuests(e.target.value)} style={inputStyle} />
        <Btn variant="primary" onClick={() => onSeat(guests)}><Check size={14} />Seat</Btn>
      </div>
    </Field>
  );
}

function OrderBuilder({ table, menuItems, onAdd, onRemove }) {
  const [pick, setPick] = useState(menuItems[0]?.id || "");
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

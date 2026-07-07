import React, { useState } from "react";
import { Plus, Check, X, Pencil, Trash2, ArrowRightLeft } from "lucide-react";
import { Card, Badge, Btn, Field, SectionHeader } from "../components/ui.jsx";
import { C, FONT_DISPLAY, inputStyle } from "../data/theme.js";
import { uid } from "../utils/helpers.js";

export default function BranchesView({ ctx }) {
  const { branches, setBranches, activeBranchId, setActiveBranchId, notify } = ctx;
  const [form, setForm] = useState(null);
  const [staffInput, setStaffInput] = useState({});

  function startAdd() {
    setForm({ id: null, name: "", address: "", manager: "" });
  }
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

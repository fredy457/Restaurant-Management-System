import React, { useState } from "react";
import { Plus, Check, X, Pencil, Trash2, Search } from "lucide-react";
import { Card, Badge, Btn, Field, SectionHeader } from "../components/ui.jsx";
import { C, FONT_DISPLAY, FONT_MONO, CATEGORIES, inputStyle } from "../data/theme.js";
import { uid } from "../utils/helpers.js";

export default function MenuView({ ctx }) {
  const { menuItems, setMenuItems, branch, branches, notify } = ctx;
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(null);

  const filtered = menuItems.filter((m) => (category === "All" || m.category === category) && m.name.toLowerCase().includes(search.toLowerCase()));

  function startAdd() {
    setForm({ id: null, name: "", category: "Appetizers", emoji: "🍽️", basePrice: 10 });
  }
  function save() {
    if (!form.name.trim()) return;
    if (form.id) {
      setMenuItems((ms) => ms.map((m) => (m.id === form.id ? { ...m, name: form.name, category: form.category, emoji: form.emoji, basePrice: Number(form.basePrice) } : m)));
    } else {
      const item = {
        id: uid(), name: form.name, category: form.category, emoji: form.emoji || "🍽️", basePrice: Number(form.basePrice),
        branchPrice: Object.fromEntries(branches.map((b) => [b.id, Number(form.basePrice)])),
        branchAvailable: Object.fromEntries(branches.map((b) => [b.id, true])),
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

import React from "react";
import { ChevronDown } from "lucide-react";
import { NAV } from "../data/nav.js";
import { C, FONT_DISPLAY } from "../data/theme.js";

export default function Topbar({ branches, activeBranchId, setActiveBranchId, view }) {
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

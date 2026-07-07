import React from "react";
import { C, FONT_DISPLAY, inputStyle } from "../data/theme.js";

export function Card({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, ...style }}>
      {children}
    </div>
  );
}

export function Badge({ children, color, bg }) {
  return <span style={{ fontSize: 11.5, fontWeight: 600, color, background: bg, padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap" }}>{children}</span>;
}

export function Btn({ children, onClick, variant = "secondary", style, disabled, type = "button" }) {
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

export function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }) {
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

export { inputStyle };

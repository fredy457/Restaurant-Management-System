import React from "react";
import { ChefHat } from "lucide-react";
import { C, FONT_DISPLAY, FONT_BODY } from "../data/theme.js";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div style={{ fontFamily: FONT_BODY, background: C.paper, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        input, select { font-family: inherit; }
      `}</style>
      <div style={{ width: 380 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 22 }}>
          <ChefHat size={26} color={C.rust} />
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 22 }}>RestaurantOS</span>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "28px 26px" }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 19, marginBottom: 4 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>{subtitle}</div>}
          {children}
        </div>
      </div>
    </div>
  );
}

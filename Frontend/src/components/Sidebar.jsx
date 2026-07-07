import React from "react";
import { ChefHat, LogOut } from "lucide-react";
import { NAV } from "../data/nav.js";
import { C, FONT_DISPLAY } from "../data/theme.js";

export default function Sidebar({ view, setView, unread, user, onLogout }) {
  const items = NAV.filter((n) => n.roles.includes(user.role));

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
        {items.map((n) => {
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
                fontSize: 14, fontWeight: 500, textAlign: "left",
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
      <div style={{ padding: "14px 18px", borderTop: "1px solid #3A2F24" }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{user.name}</div>
        <div style={{ fontSize: 11.5, color: "#A99B82", textTransform: "capitalize", marginBottom: 10 }}>{user.role}</div>
        <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 7, border: "none", background: "transparent", color: "#D8CBB2", fontSize: 13, padding: 0 }}>
          <LogOut size={14} /> Log out
        </button>
      </div>
    </div>
  );
}

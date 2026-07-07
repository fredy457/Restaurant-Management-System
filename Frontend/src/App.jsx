import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import Login from "./auth/Login.jsx";
import Signup from "./auth/Signup.jsx";
import DashboardView from "./views/DashboardView.jsx";
import BranchesView from "./views/BranchesView.jsx";
import MenuView from "./views/MenuView.jsx";
import FloorPlanView from "./views/FloorPlanView.jsx";
import ReservationsView from "./views/ReservationsView.jsx";
import PaymentView from "./views/PaymentView.jsx";
import NotificationsView from "./views/NotificationsView.jsx";
import { NAV } from "./data/nav.js";
import { C, FONT_BODY } from "./data/theme.js";
import { uid } from "./utils/helpers.js";
import {
  initialUsers, initialBranches, initialMenu, initialTables, initialReservations,
} from "./data/initialData.js";

export default function App() {
  const [users, setUsers] = useState(initialUsers());
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");

  const [branches, setBranches] = useState(initialBranches());
  const [activeBranchId, setActiveBranchId] = useState("b1");
  const [menuItems, setMenuItems] = useState(initialMenu());
  const [tables, setTables] = useState(initialTables());
  const [reservations, setReservations] = useState(initialReservations());
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: uid(), type: "info", message: "Welcome to RestaurantOS. This is a live prototype.", time: Date.now() - 3600000, read: true },
  ]);
  const [view, setView] = useState("dashboard");

  useEffect(() => {
    if (!currentUser) return;
    const allowed = NAV.filter((n) => n.roles.includes(currentUser.role)).map((n) => n.id);
    if (!allowed.includes(view)) setView("dashboard");
  }, [currentUser]);

  function notify(type, message) {
    setNotifications((n) => [{ id: uid(), type, message, time: Date.now(), read: false }, ...n]);
  }

  if (!currentUser) {
    if (authMode === "signup") {
      return (
        <Signup
          users={users}
          setUsers={setUsers}
          onSignup={(user) => setCurrentUser(user)}
          onSwitchToLogin={() => setAuthMode("login")}
        />
      );
    }
    return (
      <Login
        users={users}
        onLogin={(user) => setCurrentUser(user)}
        onSwitchToSignup={() => setAuthMode("signup")}
      />
    );
  }

  const branch = branches.find((b) => b.id === activeBranchId) || branches[0];
  const branchTables = tables.filter((t) => t.branchId === activeBranchId);

  const ctx = {
    user: currentUser,
    branches, setBranches, activeBranchId, setActiveBranchId, branch,
    menuItems, setMenuItems, tables, setTables, branchTables,
    reservations, setReservations, payments, setPayments,
    notifications, setNotifications, notify, view, setView,
  };

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.paper, minHeight: "100vh", color: C.text, display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        input, select, textarea { font-family: inherit; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: #D8CDB4; border-radius: 4px; }
      `}</style>
      <Sidebar
        view={view}
        setView={setView}
        unread={notifications.filter((n) => !n.read).length}
        user={currentUser}
        onLogout={() => { setCurrentUser(null); setAuthMode("login"); }}
      />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Topbar branches={branches} activeBranchId={activeBranchId} setActiveBranchId={setActiveBranchId} view={view} />
        <div style={{ flex: 1, padding: "28px 36px", overflowY: "auto" }}>
          {view === "dashboard" && <DashboardView ctx={ctx} />}
          {view === "branches" && <BranchesView ctx={ctx} />}
          {view === "menu" && <MenuView ctx={ctx} />}
          {view === "floor" && <FloorPlanView ctx={ctx} />}
          {view === "reservations" && <ReservationsView ctx={ctx} />}
          {view === "payment" && <PaymentView ctx={ctx} />}
          {view === "notifications" && <NotificationsView ctx={ctx} />}
        </div>
      </div>
    </div>
  );
}

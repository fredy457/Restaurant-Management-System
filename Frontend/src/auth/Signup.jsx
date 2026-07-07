import React, { useState } from "react";
import { AlertCircle, UserPlus } from "lucide-react";
import AuthLayout from "./AuthLayout.jsx";
import { Field, Btn } from "../components/ui.jsx";
import { inputStyle, C } from "../data/theme.js";
import { ROLES } from "../data/nav.js";
import { uid } from "../utils/helpers.js";

export default function Signup({ users, setUsers, onSignup, onSwitchToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "staff" });
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === form.email.trim().toLowerCase())) {
      setError("An account with that email already exists.");
      return;
    }
    const newUser = { id: uid(), name: form.name, email: form.email, password: form.password, role: form.role };
    setUsers((u) => [...u, newUser]);
    onSignup(newUser);
  }

  return (
    <AuthLayout title="Create an account" subtitle="Choose the role that matches your job.">
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Field label="Full name">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} required />
        </Field>
        <Field label="Email">
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} required />
        </Field>
        <Field label="Password">
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={inputStyle} required />
        </Field>
        <Field label="Confirm password">
          <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} style={inputStyle} required />
        </Field>
        <Field label="Role">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {ROLES.map((r) => (
              <label key={r.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", border: `1px solid ${form.role === r.id ? C.rust : C.border}`, borderRadius: 8, padding: "8px 10px", cursor: "pointer" }}>
                <input type="radio" name="role" checked={form.role === r.id} onChange={() => setForm({ ...form, role: r.id })} style={{ marginTop: 3 }} />
                <span>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.label}</div>
                  <div style={{ fontSize: 11.5, color: C.textMuted }}>{r.description}</div>
                </span>
              </label>
            ))}
          </div>
        </Field>
        {error && (
          <div style={{ color: "#B5342B", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            <AlertCircle size={14} />{error}
          </div>
        )}
        <Btn type="submit" variant="primary" style={{ justifyContent: "center", marginTop: 4 }}>
          <UserPlus size={14} />Create account
        </Btn>
      </form>
      <div style={{ fontSize: 13, marginTop: 16, textAlign: "center" }}>
        Already have an account?{" "}
        <button onClick={onSwitchToLogin} style={{ border: "none", background: "none", color: C.rust, fontWeight: 500, padding: 0, fontSize: 13 }}>
          Log in
        </button>
      </div>
    </AuthLayout>
  );
}

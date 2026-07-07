import React, { useState } from "react";
import { AlertCircle, LogIn } from "lucide-react";
import AuthLayout from "./AuthLayout.jsx";
import { Field, Btn } from "../components/ui.jsx";
import { inputStyle, C } from "../data/theme.js";

export default function Login({ users, onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    const match = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
    if (!match) {
      setError("Incorrect email or password.");
      return;
    }
    setError("");
    onLogin(match);
  }

  return (
    <AuthLayout title="Log in" subtitle="Sign in to manage your branches.">
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Field label="Email">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@restaurant.com" required />
        </Field>
        <Field label="Password">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="••••••••" required />
        </Field>
        {error && (
          <div style={{ color: "#B5342B", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            <AlertCircle size={14} />{error}
          </div>
        )}
        <Btn type="submit" variant="primary" style={{ justifyContent: "center", marginTop: 4 }}>
          <LogIn size={14} />Log in
        </Btn>
      </form>
      <div style={{ fontSize: 12.5, color: C.textMuted, marginTop: 16, lineHeight: 1.6 }}>
        Demo accounts — admin@restaurant.com / admin123 · manager@restaurant.com / manager123 · staff@restaurant.com / staff123
      </div>
      <div style={{ fontSize: 13, marginTop: 16, textAlign: "center" }}>
        Don't have an account?{" "}
        <button onClick={onSwitchToSignup} style={{ border: "none", background: "none", color: C.rust, fontWeight: 500, padding: 0, fontSize: 13 }}>
          Sign up
        </button>
      </div>
    </AuthLayout>
  );
}

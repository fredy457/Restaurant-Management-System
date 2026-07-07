import React, { useState, useEffect } from "react";
import { CreditCard, Mail, Receipt } from "lucide-react";
import { Card, Btn, Field, SectionHeader } from "../components/ui.jsx";
import { C, FONT_DISPLAY, FONT_MONO, inputStyle } from "../data/theme.js";
import { fmt, uid } from "../utils/helpers.js";

export default function PaymentView({ ctx }) {
  const { branchTables, menuItems, setTables, payments, setPayments, branch, notify } = ctx;
  const occupiedTables = branchTables.filter((t) => t.status === "occupied");
  const [tableId, setTableId] = useState(occupiedTables[0]?.id || "");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(8);
  const [tip, setTip] = useState(15);
  const [split, setSplit] = useState(1);
  const [method, setMethod] = useState("card");

  useEffect(() => {
    if (!occupiedTables.find((t) => t.id === tableId)) setTableId(occupiedTables[0]?.id || "");
  }, [branchTables]);

  const table = branchTables.find((t) => t.id === tableId);
  const items = table ? table.order.map((o) => ({ ...o, item: menuItems.find((m) => m.id === o.itemId) })).filter((o) => o.item) : [];
  const subtotal = items.reduce((s, o) => s + o.item.branchPrice[branch.id] * o.qty, 0);
  const discountAmt = subtotal * (Number(discount) / 100);
  const taxAmt = (subtotal - discountAmt) * (Number(tax) / 100);
  const tipAmt = (subtotal - discountAmt) * (Number(tip) / 100);
  const total = subtotal - discountAmt + taxAmt + tipAmt;
  const perGuest = total / Math.max(1, Number(split));

  function confirmPayment() {
    if (!table || items.length === 0) return;
    const record = { id: uid(), branchId: branch.id, tableNumber: table.number, items, subtotal, discount: discountAmt, tax: taxAmt, tip: tipAmt, total, method, time: Date.now() };
    setPayments((p) => [record, ...p]);
    setTables((ts) => ts.map((t) => (t.id === table.id ? { ...t, status: "cleaning", guests: null, seatedAt: null, order: [] } : t)));
    notify("success", `Payment confirmed — table #${table.number}, ${fmt(total)} via ${method}.`);
    setDiscount(0); setTip(15); setSplit(1);
  }

  return (
    <div>
      <SectionHeader title="Payment" subtitle={`Generate and settle bills for ${branch.name}.`} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        <Card>
          <Field label="Table">
            <select value={tableId} onChange={(e) => setTableId(e.target.value)} style={inputStyle}>
              <option value="">Select an occupied table</option>
              {occupiedTables.map((t) => <option key={t.id} value={t.id}>Table #{t.number} · {t.guests} guests</option>)}
            </select>
          </Field>
          {table ? (
            <div style={{ marginTop: 16, fontFamily: FONT_MONO, fontSize: 13.5 }}>
              {items.map((o) => (
                <div key={o.itemId} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px dashed ${C.border}` }}>
                  <span>{o.item.name} × {o.qty}</span>
                  <span>{fmt(o.item.branchPrice[branch.id] * o.qty)}</span>
                </div>
              ))}
              {items.length === 0 && <div style={{ fontFamily: "inherit", color: C.textMuted, fontSize: 13 }}>No order recorded for this table yet — add items from the floor plan.</div>}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", fontWeight: 600 }}><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            </div>
          ) : <div style={{ color: C.textMuted, fontSize: 13.5, marginTop: 14 }}>No occupied tables to bill right now.</div>}
        </Card>

        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Discount %"><input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} style={inputStyle} /></Field>
            <Field label="Tax %"><input type="number" value={tax} onChange={(e) => setTax(e.target.value)} style={inputStyle} /></Field>
            <Field label="Tip %"><input type="number" value={tip} onChange={(e) => setTip(e.target.value)} style={inputStyle} /></Field>
            <Field label="Split between (guests)"><input type="number" min={1} value={split} onChange={(e) => setSplit(e.target.value)} style={inputStyle} /></Field>
            <Field label="Payment method">
              <div style={{ display: "flex", gap: 6 }}>
                {["cash", "card", "wallet"].map((m) => (
                  <button key={m} onClick={() => setMethod(m)} style={{ flex: 1, border: `1px solid ${method === m ? C.rust : C.border}`, background: method === m ? "#F5E6E3" : "#fff", color: method === m ? C.rustDeep : C.text, borderRadius: 8, padding: "8px 6px", fontSize: 12.5, textTransform: "capitalize" }}>{m === "wallet" ? "Mobile wallet" : m}</button>
                ))}
              </div>
            </Field>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, fontFamily: FONT_MONO, fontSize: 13.5 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Tax</span><span>{fmt(taxAmt)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Tip</span><span>{fmt(tipAmt)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Discount</span><span>-{fmt(discountAmt)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, marginTop: 6 }}><span>Total</span><span>{fmt(total)}</span></div>
              {Number(split) > 1 && <div style={{ display: "flex", justifyContent: "space-between", color: C.textMuted, fontSize: 12.5 }}><span>Per guest × {split}</span><span>{fmt(perGuest)}</span></div>}
            </div>
            <Btn variant="primary" disabled={!table || items.length === 0} onClick={confirmPayment}><CreditCard size={15} />Confirm payment</Btn>
            <Btn disabled={!table} onClick={() => notify("info", `Receipt emailed for table #${table?.number}.`)}><Mail size={14} />Email receipt</Btn>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 26 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Payment history</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {payments.filter((p) => p.branchId === branch.id).slice(0, 8).map((p) => (
            <Card key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Receipt size={16} color={C.textMuted} />
                <div style={{ fontSize: 13 }}>Table #{p.tableNumber} · {new Date(p.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · <span style={{ textTransform: "capitalize" }}>{p.method}</span></div>
              </div>
              <div style={{ fontFamily: FONT_MONO, fontWeight: 600 }}>{fmt(p.total)}</div>
            </Card>
          ))}
          {payments.filter((p) => p.branchId === branch.id).length === 0 && <div style={{ color: C.textMuted, fontSize: 13.5 }}>No payments recorded yet.</div>}
        </div>
      </div>
    </div>
  );
}

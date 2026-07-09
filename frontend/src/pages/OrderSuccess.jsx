import React from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="container">
      <div className="success-wrap">
        <div className="success-icon">
          <CheckCircle2 size={36} />
        </div>
        <h1>Order placed successfully</h1>
        <p>
          Thanks, {order.customer.name}! Your order will be delivered to {order.customer.address},{" "}
          {order.customer.city}. Pay in cash when it arrives.
        </p>
        <div className="order-id-box">{order.id}</div>
        <p>
          Total due on delivery: <strong style={{ color: "var(--accent)" }}>
            Rs. {order.total.toLocaleString("en-PK")}
          </strong>
        </p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 20, display: "inline-flex" }}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

const nodemailer = require("nodemailer");

function getTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

function formatCurrency(amount) {
  return `Rs. ${Number(amount).toLocaleString("en-PK")}`;
}

async function sendOrderNotification(order) {
  const ownerEmail = process.env.OWNER_EMAIL || "hijaz8072@gmail.com";

  const itemsRows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatCurrency(item.price)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatCurrency(item.price * item.quantity)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#0b5fff;">New Order Received - COD</h2>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>

      <h3>Customer Details</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:4px 0;"><strong>Name:</strong></td><td>${order.customer.name}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Phone:</strong></td><td>${order.customer.phone}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Email:</strong></td><td>${order.customer.email || "N/A"}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Address:</strong></td><td>${order.customer.address}, ${order.customer.city}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Notes:</strong></td><td>${order.customer.notes || "None"}</td></tr>
      </table>

      <h3>Order Items</h3>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#f4f6fb;">
            <th style="padding:8px;text-align:left;">Product</th>
            <th style="padding:8px;">Qty</th>
            <th style="padding:8px;text-align:right;">Price</th>
            <th style="padding:8px;text-align:right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <p style="font-size:18px;margin-top:16px;"><strong>Total (Cash on Delivery): ${formatCurrency(order.total)}</strong></p>
    </div>
  `;
const transporter = getTransporter();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("OWNER_EMAIL:", process.env.OWNER_EMAIL);
console.log("Sending email...");
try {
  const info = await transporter.sendMail({
    from: `"Mobile Shop Orders" <${process.env.EMAIL_USER}>`,
    to: ownerEmail,
    subject: `New COD Order #${order.id} - ${formatCurrency(order.total)}`,
    html,
  });

  console.log("Email sent:", info.messageId);
} catch (err) {
  console.error("SMTP ERROR:", err);
  throw err;
}
console.log("SMTP Connected Successfully");

await transporter.sendMail({
  from: `"Mobile Shop Orders" <${process.env.EMAIL_USER}>`,
  to: ownerEmail,
  subject: `New COD Order #${order.id} - ${formatCurrency(order.total)}`,
  html,
});

console.log("Email sent successfully");}
module.exports = { sendOrderNotification };

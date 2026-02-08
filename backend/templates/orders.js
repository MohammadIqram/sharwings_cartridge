export const orderSuccessTemplate = `
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 2px 8px #0001;padding:32px;font-family:Arial,sans-serif;">
    <h2 style="color:#16a34a;font-size:2rem;font-weight:bold;margin-bottom:12px;">
      You have a new order from, {{name}}!
    </h2>
    <div style="margin-bottom:18px;">
        Hi There you have a new order from {{name}}. Here are the details:
    </div>
    <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:16px;border-radius:8px;margin-bottom:18px;">
      <strong>Order Summary:</strong>
      <ul style="margin:8px 0 0 16px;padding:0;">
        {{orderItems}}
      </ul>
      <div><strong>Total Amount:</strong> ₹{{totalAmount}}</div>
      <div><strong>Delivery Address:</strong> {{address}}</div>
      <div><strong>Payment Mode:</strong> {{paymentMode}}</div>
    </div>
    <div style="color:#555;font-size:0.95rem;margin-top:24px;">
      If you have any questions, reply to this email.<br>
      <strong>Sharwings Team</strong>
    </div>
  </div>
`;
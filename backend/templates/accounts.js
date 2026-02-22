export const forgotPasswordTemplate = `
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 2px 8px #0001;padding:32px;font-family:Arial,sans-serif;">
    
    <h2 style="color:#1e3a8a;font-size:2rem;font-weight:bold;margin-bottom:12px;">
      Reset Your Password
    </h2>

    <div style="margin-bottom:18px;color:#444;">
      Hi {{name}}, <br/><br/>
      We received a request to reset your password for your <strong>Sharwings</strong> account.
      Click the button below to create a new password.
    </div>

    <!-- Reset Button -->
    <div style="text-align:center;margin:24px 0;">
      <a href="{{resetLink}}" 
         style="background:#2563eb;color:#fff;padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
        Reset Password
      </a>
    </div>

    <!-- Important Block -->
    <div style="background:#eff6ff;border-left:4px solid #2563eb;padding:16px;border-radius:8px;margin-bottom:18px;">
      <strong>Important:</strong>
      <ul style="margin:8px 0 0 16px;padding:0;color:#333;">
        <li>This link will expire in {{expiryTime}}.</li>
        <li>The link can only be used once.</li>
        <li>Do not share this link with anyone.</li>
      </ul>
    </div>

    <!-- Fallback Link -->
    <div style="margin-bottom:18px;color:#444;font-size:0.95rem;">
      If the button above doesn’t work, copy and paste this link into your browser:
      <br/><br/>
      <a href="{{resetLink}}" style="color:#2563eb;word-break:break-all;">
        {{resetLink}}
      </a>
    </div>

    <!-- Token Display (Optional) -->
    <div style="background:#f3f4f6;padding:12px;border-radius:6px;font-size:0.85rem;color:#555;margin-bottom:18px;">
      <strong>Security Token:</strong><br/>
      {{token}}
    </div>

    <!-- Note Block -->
    <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:16px;border-radius:8px;margin-bottom:18px;color:#444;">
      <strong>Note:</strong>
      If you did not request a password reset, please ignore this email. 
      Your account is safe and no changes have been made.
    </div>

    <div style="color:#666;font-size:0.9rem;margin-top:24px;">
      For security reasons, this is an automated email. Please do not reply.<br/><br/>
      <strong>— Sharwings Team</strong>
    </div>

  </div>
`;
export const otpTemplate = (otp: string) => { 
    return `<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <head>
    <meta charset="UTF-8" />
    <title>Your Phinmon Code</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f9f9f9;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <tr>
        <td style="padding: 32px; text-align: center;">
          <h2 style="color: #111827; font-size: 24px; margin-bottom: 16px;">Your Phinmon Login Code</h2>
          <p style="font-size: 16px; color: #4b5563; margin-bottom: 24px;">
            Hey there 👋, use the code below to log in to your Phinmon account. It’s valid for the next 10 minutes.
          </p>

          <div style="display: inline-block; background-color: #f3f4f6; padding: 16px 24px; font-size: 32px; color: #111827; font-weight: bold; border-radius: 8px; letter-spacing: 4px;">
            ${otp}
          </div>

          <p style="margin-top: 32px; font-size: 14px; color: #9ca3af;">
            Didn’t request this? You can safely ignore it.
          </p>

          <p style="margin-top: 12px; font-size: 14px; color: #9ca3af;">
            💜 From your friends at Phinmon
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}
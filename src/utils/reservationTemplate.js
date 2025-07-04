// Reservation template utility
// Usage: const template = reservationTemplate({ name, date, time, guests });

function reservationTemplate({ name, date, time, guests }) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  return `
  <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px; border-radius: 12px; max-width: 480px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">
    <h2 style="color: #2d7a2d; text-align: center;">Reservation Confirmed!</h2>
    <p style="font-size: 1.1em;">Dear <strong>${name}</strong>,</p>
    <p>Your reservation is confirmed for:</p>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 18px;">
      <tr>
        <td style="padding: 8px 0; color: #555;">Date:</td>
        <td style="padding: 8px 0;"><strong>${formattedDate}</strong></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #555;">Time:</td>
        <td style="padding: 8px 0;"><strong>${time}</strong></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #555;">Guests:</td>
        <td style="padding: 8px 0;"><strong>${guests}</strong></td>
      </tr>
    </table>
    <p style="margin-top: 24px;">Thank you for choosing us! We look forward to serving you.</p>
    <div style="text-align: center; margin-top: 32px;">
      <span style="font-size: 2em; color: #2d7a2d;">&#127869;&#65039;</span>
    </div>
  </div>
  `;
}

module.exports = reservationTemplate;

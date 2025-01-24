import sgMail from "@sendgrid/mail";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("SendGrid API key not configured - email not sent");
    console.log("Would send email to:", to);
    console.log("Subject:", subject);
    console.log("HTML content:", html);
    return;
  }

  const msg = {
    to,
    from: process.env.EMAIL_FROM || "noreply@seri-ghanial.org",
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
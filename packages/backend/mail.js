// mail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ahmed.massoudi@horizon-tech.tn",
        pass: "xoqj awyj ikoc avop",
    },
});

async function sendEmail(to, subject, text) {
    console.log("📧 Preparing to send email to:", to);

    const mailOptions = {
        from: `"Play2Grow" <ahmed.massoudi@horizon-tech.tn>`,
        to,
        subject,
        text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.response);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
}

// ✅ Export the function like this:
module.exports = { sendEmail };

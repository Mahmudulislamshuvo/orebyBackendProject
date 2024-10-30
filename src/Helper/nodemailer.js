const nodemailer = require("nodemailer");
const otptemplete = require("./otpTemplate");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

// async function sendMail(userEmail, Otp) {
//   const info = await transporter.sendMail({
//     from: process.env.EMAIL, // sender address
//     to: userEmail, // list of receivers
//     subject: "Verify Your Account ✔", // Subject line
//     html: otptemplete(Otp),
//   });

//   if (info.messageId) {
//     return true;
//   }
// }

async function sendMail(userEmail, Otp) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: userEmail,
      subject: "Verify Your Account ✔",
      html: otptemplete(Otp),
    });
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending mail:", error);
    return false;
  }
}

module.exports = { sendMail };

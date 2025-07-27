import nodemailer from 'nodemailer'
import 'dotenv/config'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME, // your gmail
    pass: process.env.EMAIL_PASSWORD, // use App Password if 2FA is on
  },
})

export const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"CodeAsh" <${process.env.EMAIL_USERNAME}>`,
    to,
    subject: 'Verify Your Email - CodeAsh',
    html: `
      <div style="font-family: sans-serif;">
        <h2>👋 Welcome to CodeAsh!</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #0FA;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

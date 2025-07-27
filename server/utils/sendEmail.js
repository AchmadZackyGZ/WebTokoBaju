import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Toko Baju Zacky" <${process.env.GMAIL_USERNAME}>`,
      to,
      subject,
      text,
    });

    console.log(`Email berhasil dikirim ke ${to}`);
  } catch (error) {
    console.error(`Gagal mengirim email ke ${to}:`, error.message);
  }
};

export default sendEmail;

// import nodemailer from "nodemailer";

// const sendEmail = async ({ to, subject, text }) => {
//   try {
//     const transpoter = nodemailer.createTransport({
//       host: "smtp-relay.brevo.com",
//       port: 587,
//       secure: false, //pakai TLS, bukan SSL
//       auth: {
//         user: process.env.BREVO_EMAIL,
//         pass: process.env.BREVO_API_KEY,
//       },
//     });
//     await transpoter.sendMail({
//       from: `"Toko Baju" <${process.env.BREVO_EMAIL}>`,
//       to,
//       subject,
//       text,
//       html: `
//     <h3>Halo ${buyer.name},</h3>
//     <p>Pesanan <strong>#${order._id}</strong> Anda telah berhasil dibayar.</p>
//     <p>Terima kasih atas pembelian Anda!</p>
//   `,
//     });
//     console.log(`Email berhasil dikirim ke ${to}`);
//   } catch (error) {
//     console.log(`Gagal mengirim email ke ${to}:`, error);
//   }
// };

// export default sendEmail;

import nodemailer from "nodemailer";

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // e.g., smtp.gmail.com
      auth: {
        user: process.env.MAIL_USER, // Your email
        pass: process.env.MAIL_PASS, // Your App Password
      },
    });

    let info = await transporter.sendMail({
      from: `"Lynk Platform" <${process.env.MAIL_USER}>`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    return info;
  } catch (error) {
    console.log("Email Send Error: ", error);
  }
};

export default mailSender;
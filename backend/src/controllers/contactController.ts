import { Request, Response, NextFunction } from "express";
import { sendEmail } from "../services/emailService";

export default class ContactController {
  static async submitContactForm(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        res.status(400).json({ error: "All fields are required." });
        return;
      }

      const subject = `New Contact Form Submission from ${name}`;
      const text = `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`;
      const html = `<p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong><br>${message}</p>`;

      await sendEmail("deemohuang@gmail.com", subject, text, html);

      res.status(200).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
      next(error);
    }
  }
}

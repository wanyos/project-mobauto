import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

interface EmailOptions {
  to: string | string[]        // destinatario(s)
  subject: string              // asunto
  html: string                 // cuerpo del email en HTML
  cc?: string | string[]       // copia (visible para todos)
  bcc?: string | string[]      // copia oculta
}

export async function sendEmail(options: EmailOptions) {
  return transporter.sendMail({
    from: `"MobautoRomero" <${process.env.GMAIL_USER}>`,
    ...options,
  })
}
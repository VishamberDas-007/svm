import nodeMailer from 'nodemailer'
import { nodeMailerCredentials } from '../config/const'

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: nodeMailerCredentials.USER_NAME,
        pass: nodeMailerCredentials.APP_PASSWORD,
    },
})

export const sendEmail = async (to: string, subject: string, html: string) => {
    const mailOptions = {
        from: nodeMailerCredentials.USER_NAME,
        to: to,
        subject: subject,
        html: html,
    }

    await transporter.sendMail(mailOptions)
}

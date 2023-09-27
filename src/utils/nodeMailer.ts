import nodeMailer from 'nodemailer'
import { nodeMailerCredentials } from '../config/const'

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: nodeMailerCredentials.USER_EMAIL,
        pass: nodeMailerCredentials.APP_PASSWORD,
    },
})

export const sendEmailToCustomer = async (
    to: string,
    subject: string,
    html: string
) => {
    const mailOptions = {
        from: nodeMailerCredentials.USER_EMAIL,
        to: to,
        subject: subject,
        html: html,
    }

    await transporter.sendMail(mailOptions)
}

export const sendEmailToAdmin = async (
    from: string,
    subject: string,
    html: string
) => {
    const mailOptions = {
        from,
        to: nodeMailerCredentials.USER_EMAIL,
        subject: subject,
        html: html,
    }

    await transporter.sendMail(mailOptions)
}

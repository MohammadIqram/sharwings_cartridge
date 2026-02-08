import nodemailer from "nodemailer";

class EmailHelper {
    constructor(config = {}) {
        const {
            host = process.env.NODEMAILER_HOST,
            port = process.env.NODEMAILER_PORT,
            secure = true,
            user = process.env.NODEMAILER_EMAIL,
            pass = process.env.NODEMAILER_PASS,
        } = config;

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: { user, pass }
        });
    }

    logger () {
        console.log(this.transporter);
    }

    static renderTemplate (template, variables) {
        return template.replace(/\{\{(.*?)\}\}/g, (_, key) => variables[key.trim()] || '');
    }

    async sendEmail ({to, subject, text, html}) {
        const mailOptions = {
            from: `"Sharwings" <${process.env.NODEMAILER_EMAIL}>`,
            to,
            subject,
            text,
            html
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Email sent: ", info.messageId);
            return info;
        } catch (error) {
            console.error("Error sending email: ", error);
            throw error;
        }
    }
}

export default EmailHelper;
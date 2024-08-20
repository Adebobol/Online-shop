const nodemailer = require('nodemailer')
const catchAsync = require("../utils/CatchAsync")

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const sendEmail = (options) => {
    const transportEmail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'adepojuadebobola6@gmail.com',
            pass: 'mzmfavgirpjancks'
        }
    })

    const mailInformation = {
        // from: "Online Shop",
        // to: "adepojuadebobola6@gmail.com",
        // subject: "Reset Your Password.",
        // text: "http://localhost:4000/api/user/resetPassword/4000200"

        from: "Online Shop",
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    transportEmail.sendMail(mailInformation, function (err, val) {
        if (err) {
            console.log(err)
        } else {
            console.log(val.response, 'sent email')
        }
    })

}


module.exports = sendEmail

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email
        this.firstName = user.name.split(" ")[0]
        this.url = url
        this.from = `Adepoju Adebobola<${process.env.EMAIL_FROM}>`
    }

    createTransport() {
        if (process.env.NODE_ENV === 'production') {
            // Sendgrid
            return 1
        }
        return createTransport({
            service: 'gmail',
            auth: {
                user: 'adepojuadebobola6@gmail.com',
                pass: 'mzmfavgirpjancks'
            }
        })

    }

    send(template, subject) {
        // 1) render html template

        // 2) Define email options
        const mailInformation = {
            from: this.from,
            to: this.to,
            subject: options.subject,
            text: options.message
        }
        // 3) Create transport and send email
    }

    sendWelcome() {
        this.send('Welcome', 'welcome to Online Shop')
    }
}
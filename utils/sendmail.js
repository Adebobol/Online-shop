const nodemailer = require('nodemailer')
const catchAsync = require("../utils/CatchAsync")
// const htmlToText = require('html-to-text')
// const hbs = require('hbs')


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

// module.exports = class Email {
//     constructor(user, url) {
//         this.to = user.email
//         this.firstName = user.firstName
//         // .split(" ")[0]
//         this.url = url
//         this.from = `Adepoju Adebobola<${process.env.EMAIL_FROM}>`
//     }

//     newTransport() {
//         if (process.env.NODE_ENV === 'production') {
//             // Sendgrid
//             return 1
//         }
//         return nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'adepojuadebobola6@gmail.com',
//                 pass: 'mzmfavgirpjancks'
//             }
//         })

//     }

//     async send(template, subject) {
//         // 1) render html template
//         const html = hbs.compile(`${__dirname}/../views/email/${template}.hbs`)
//         // , {
//         //         firstName: this.firstName,
//         //         url: this.url,
//         //         subject
//         //     })

//         // 2) Define email options
//         const mailInformation = {
//             from: this.from,
//             to: this.to,
//             subject,
//             html,
//         }
//         // 3) Create transport and send email

//         await this.newTransport().sendMail(mailInformation)
//     }

//     async sendWelcome() {
//         await this.send('Welcome', `${this.to} We kindly welcome you to Online Shop.`)
//     }
// }
const nodemailer = require('nodemailer')
const catchAsync = require("../utils/CatchAsync")

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// const sendEmail = catchAsync(async (options) => {

//     // let testAccount = await nodemailer.createTestAccount()
//     // Create a transporter object
//     const transporter = nodemailer.createTransport({
//         host: 'etheral.email',
//         port: 587,
//         // secure: false, // use SSL
//         auth: {
//             user: 'devon.ruecker@ethereal.email',
//             pass: '9C3ff5Crfjfhx9mZbr',
//         }
//     });

//     // Configure the mailoptions object
//     const information = {
//         from: 'Online Shop',
//         to: options.email,
//         subject: options.subject,
//         text: options.message
//     };

//     // Send the email
//     transporter.sendMail(information);

// })

// module.exports = sendEmail

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

    // console.log("sent email")
}


module.exports = sendEmail
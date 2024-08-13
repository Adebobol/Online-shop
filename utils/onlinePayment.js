// const paystack = (request) => {
//     const MySecretKey = process.env.PAYSTACK_SECRET_KEY


//     const initializePayment = (form, mycallback) => {
//         const options = {
//             url: 'https://api.paystack.co/transaction/initialize',
//             headers: {
//                 authorization: MySecretKey,
//                 'content-type': 'application/json',
//                 'cache-control': 'no-cache'
//             },
//             form
//         }

//         const callback = (error, response, body) => {
//             return mycallback(error, body)
//         }
//         request.post(options, callback)
//     }
// }
const https = require('https')
// const order = require('../Models/orderModel')
class payStack {

    constructor(email, name, amount) {
        this.email = email
        this.name = name
        this.amount = amount
    }

    acceptPayment() {

        const params = JSON.stringify({
            // "email": "customer@email.com",
            // "amount": "20000"

            "email": this.email,
            "amount": this.amount


        })

        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: '/transaction/initialize',
            method: 'POST',
            headers: {
                Authorization: 'Bearer sk_test_732c6d70fd65fd4c6c08f0cc46a50e3f6d243bcb',
                'Content-Type': 'application/json'
            }
        }

        const req = https.request(options, res => {
            let data = ''

            res.on('data', (chunk) => {
                data += chunk
            });

            res.on('end', () => {
                console.log(JSON.parse(data))
            })
        }).on('error', error => {
            console.error(error)
        })

        req.write(params)
        req.end()
    }


}

const initializePayment = payStack
module.exports = initializePayment


//     const verifyPayment = (ref, mycallback) => {
//         const options = {
//             url: 'https://api.paystack.co/transaction/verify/' + encodeURIComponent(ref),
//             headers: {
//                 authorization: MySecretKey,
//                 'content-type': 'application/json',
//                 'cache-control': 'no-cache'
//             },
//         }
//         const callback = (error, response, body) => {
//             return mycallback(error, body)
//         }
//         request(options, callback)
//     }

//     return { initializePayment, verifyPayment }
// }

// module.exports = paystack
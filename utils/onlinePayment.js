const https = require('https')
class payStack {

    constructor(email, name, amount) {
        this.email = email
        this.name = name
        this.amount = amount
    }

    acceptPayment() {

        const params = JSON.stringify({
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

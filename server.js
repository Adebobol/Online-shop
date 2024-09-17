const app = require('./app')
const mongoose = require('mongoose')
const dotenv = require("dotenv")


dotenv.config({ path: '././.env' })


// port def
const PORT = process.env.PORT|| 4000


// database connect
mongoose.connect("mongodb://127.0.0.1/OnlineShop", {}).then(() => console.log('Database connected'))

// app connect
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

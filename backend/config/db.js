const mongoose = require('mongoose')

const URL = process.env.MONGO_URI

mongoose.connect(URL)

    .then(() => {
        console.log('connect is done')
    })
    .catch((err) => {
        console.log("error in config",err)
    })
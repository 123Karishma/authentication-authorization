const mongoose = require("mongoose")

async function dbConnects(url) {
    try {
        const connet = mongoose.connect(url)
        console.log("db connected")
    } catch (err) {
        console.log("mongodb error", err)
        process.exit(1)
    }

}

module.exports = { dbConnects }
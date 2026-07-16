const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const app = express()

// SECURITY OPTIMIZATION:
// Helmet middleware enabled to secure Express headers.
// Why it is used: It helps secure the app by setting various HTTP headers to mitigate cross-site scripting (XSS), clickjacking, and other vulnerabilities.
// What problem it solves: Prevents information disclosure and MIME-type sniffing.
// What output improvement we get: Removes unsafe response headers and adds security controls.
// Why modern companies use it: Production apps use it to secure APIs automatically with industry-standard HTTP headers.
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Required if server serves static images/uploads to a different origin
}))

// PERFORMANCE OPTIMIZATION:
// Compression middleware enabled to compress response bodies.
// Why it is used: Gzip/Brotli compression decreases the payload size transmitted over the network.
// What problem it solves: Slow load times and high bandwidth consumption.
// What output improvement we get: Compressed JSON and assets, yielding faster download times.
// Why modern companies use it: To improve API response times and reduce network egress costs.
app.use(compression())

require('./config/db')

const authRoute = require('./routes/authRoute')
const panditRoute = require('./routes/panditRoute')
const bookingRoute = require('./routes/bookingRoute')
const uploadRoute = require('./routes/uploadRoute')
const UserRoute = require('./routes/userRoute')
const contactRoute = require('./routes/contactRoute')
const adminRoute = require('./routes/adminRoutes')
const reviewRoute = require('./routes/reviewRoute')

const path = require('path')

const cors = require('cors')

const corsoptions = {
    origin: ["http://localhost:3000", "http://localhost:3001", "https://book-my-pandit-nine.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}

app.use(cors(corsoptions))

// middleware
app.use(express.json())

app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.use('/api/auth', authRoute)
app.use('/api/pandit', panditRoute)
app.use('/api/booking', bookingRoute)
app.use('/api/upload', uploadRoute)
app.use('/api/user', UserRoute)
app.use('/api/contact', contactRoute)
app.use('/api/admin', adminRoute)
app.use('/api/review', reviewRoute)


app.listen(5000, () => {
    console.log("server is running on port 5000")
})
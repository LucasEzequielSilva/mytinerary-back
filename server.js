require('dotenv').config()
const cors = require('cors')
const express = require('express')
require('./config/database')
const Router = require('./routes/routes')
const port = 8080

const app = express()


app.use(cors())
app.use(express.json())
app.use('/api', Router)


app.listen(port, ()=>console.log('server ready on port' + port))

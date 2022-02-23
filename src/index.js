const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const port = process.env.PORT || 3000
const reporterRouter = require('./routers/reporters')

require('./db/mongoose')

app.use(express.json())
app.use(reporterRouter)














app.listen(port, () => {
    console.log('Server is running')
})
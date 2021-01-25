const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const csvParser = require('./csv-parser')

app.use(cors())
app.use(express.json())

app.post('/app', csvParser.parse)

app.listen('3333')
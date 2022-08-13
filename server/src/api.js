const express = require('express')
const serverless = require('serverless-http')
const cors = require('cors')
const Parser = require('rss-parser')

const parser = new Parser()

const app = express()

app.use(express.json())
app.use(cors())

const RSS_URL = 'https://feeds.simplecast.com/qm_9xx0g'

const router = express.Router()

router.get('/feed', async (req, res, next) => {
    try {
        const data = await parser.parseURL(RSS_URL)
        res.json(data)
    } catch (err) {
        console.warn(err)
    }
})

app.use('/.netlify/functions/api', router)

module.exports = app
module.exports.handler = serverless(app)

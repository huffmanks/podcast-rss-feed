const express = require('express')
const serverless = require('serverless-http')
const cors = require('cors')

const { rateLimit } = require('express-rate-limit')
const Parser = require('rss-parser')

const parser = new Parser()

const app = express()

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
})

app.use(express.json())
app.use(cors())
app.use(limiter)

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

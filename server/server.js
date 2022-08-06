import express from 'express'
import cors from 'cors'
import Parser from 'rss-parser'

const parser = new Parser()

const app = express()

app.use(express.json())
app.use(cors())

const RSS_URL = 'https://feeds.simplecast.com/qm_9xx0g'

app.get('/feed', async (req, res, next) => {
    try {
        const data = await parser.parseURL(RSS_URL)
        res.json(data)
    } catch (err) {
        console.warn(err)
    }
})

const PORT = 5000
app.listen(PORT, console.log(`Sever running on port http://localhost:${PORT}`))

import { useEffect, useState } from 'react'

const FEED_URL = 'http://localhost:5000/feed'

const App = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await fetch(FEED_URL)

                if (!res.ok) {
                    throw new Error(`This is an HTTP error: The status is ${res.status}`)
                }

                const data = await res.json()

                setData(data)
                setError(null)
            } catch (err) {
                setError(err.message)
                setData(null)
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [])

    if (loading) return <p>Loading...</p>

    if (error) return <p>{error}</p>

    console.log(data)

    const formatDuration = (text) => {
        const textArr = text.split(':')

        const hour = textArr[0] === '00' ? '' : `${textArr[0].slice(1)}h `
        const minutes = `${textArr[1]}m `
        const seconds = `${textArr[2]}s`

        return hour + minutes + seconds
    }

    return (
        <div className='container'>
            <header>
                <div>
                    <a className='logo' href={data.link} target='_blank' rel='noopener'>
                        <img src={data.image.url} alt='logo' />
                    </a>
                </div>
                <div className='description'>{data.description}</div>
            </header>
            <section className='feed'>
                <div className='articles'>
                    {data.items.map((item) => (
                        <article key={item.guid} className='article'>
                            <div className='title'>{item.title}</div>
                            <div className='date-duration'>
                                <div className='date'>{item?.pubDate?.slice(0, -15)}</div>
                                <div className='duration'>{formatDuration(item.itunes.duration)}</div>
                            </div>
                            <div className='snippet'>{item.itunes.summary}</div>
                            <audio className='audio' src={item.enclosure.url} controls></audio>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default App

// title: 'Rep. Victoria Spartz was not invited to a bipartisan Congressional trip to the Ukrainian border. She
// showed up anyway.',
//       link: 'https://www.cnn.com/2022/08/05/politics/victoria-spartz-ukraine-republican-reaction/index.html',
//       pubDate: 'Fri, 05 Aug 2022 14:59:00 GMT',
//       content: '• Russia is ready to discuss prisoner swap with US after Griner conviction',
//       contentSnippet: '• Russia is ready to discuss prisoner swap with US after Griner conviction',
//       guid: 'https://www.cnn.com/2022/08/05/politics/victoria-spartz-ukraine-republican-reaction/index.html',
//       isoDate: '2022-08-05T14:59:00.000Z'

import { useEffect, useRef, useState } from 'react'

const FEED_URL = 'https://podcast-rss-feed-api.netlify.app/.netlify/functions/api/feed'

const App = () => {
    const itemRef = useRef()

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [id, setId] = useState(null)

    const handleListen = (itemId) => {
        setId(itemId)
    }

    const formatDuration = (text) => {
        const textArr = text.split(':')

        const hour = textArr[0] === '00' ? '' : `${textArr[0].slice(1)}h `
        const minutes = `${textArr[1]}m `
        const seconds = `${textArr[2]}s`

        return hour + minutes + seconds
    }

    useEffect(() => {
        if (id) {
            const playAudio = async () => {
                const audioEl = await itemRef.current.querySelector('audio')

                if (audioEl) return audioEl.play()
            }

            playAudio()
        }
    }, [id])

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
                <div ref={itemRef} className='articles'>
                    {data.items.slice(0, 10).map((item) => (
                        <article key={item.guid} className='article'>
                            <div className='title'>{item.title}</div>
                            <div className='date-duration'>
                                <div className='date'>{item?.pubDate?.slice(0, -15)}</div>
                                <div className='duration'>{formatDuration(item.itunes.duration)}</div>
                            </div>
                            <div className='snippet'>{item.itunes.summary}</div>
                            <div>
                                {id === item.guid ? (
                                    <audio className='audio' src={item.enclosure.url} controls></audio>
                                ) : (
                                    <button className='listen-btn' onClick={() => handleListen(item.guid)}>
                                        Listen
                                    </button>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default App

// import { Container, Box } from '@material-ui/core'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import './home.scss'
// import skey from '../img/skey.png';

const Home = () => {
    const navigate = useNavigate()
    // const [memory, setMemory] = useState<number>(0)
    // const [currentTime, setCurrentTime] = useState(0)
    // const intervalRef = useRef<Number>()
    useEffect(() => {
        // setMemory(Date.now())
        setTimeout(() => {
            navigate('/societykey')
        }, 1 * 1000) //30 sec idle time
    }, [])

    // useEffect(() => {
    //   if (!intervalRef.current) {
    //     intervalRef.current = window.setInterval(
    //       () => setCurrentTime(Date.now()),
    //       800,
    //     )
    //   }
    //   return () => {
    //     clearInterval(Number(intervalRef.current))
    //   }
    // }, [])
    return (
        // <Box className='home-total'>
        //   <Container className='home-middle'>
        //     <span className='home-title'>HOLY CITY</span>
        //     <span className='home-logos'>
        //       <img className='home-logo' src='./img/skey.png' alt='skey' />
        //     </span>
        //     <span className='home-title'>SOCIETYKEY</span>
        //   </Container>
        // </Box>
        <div
            className='home-total'
            // style={{ filter: `blur(${(currentTime - memory) / 100}px)` }}
        >
            <img className='home-logos' src='./img/spage3.PNG' alt='spage2' />
        </div>
    )
}
export default Home

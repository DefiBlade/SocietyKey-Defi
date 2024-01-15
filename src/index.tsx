import { createRoot } from 'react-dom/client'
import { ChainId, DAppProvider, Polygon, Rinkeby } from '@usedapp/core'
import { Buffer } from 'buffer'
import 'react-toastify/dist/ReactToastify.css'
import { InfuraId } from './global/constants'

import App from './App'
import './styles.scss'

window.Buffer = Buffer

const config = {
    readOnlyChainId: ChainId.Polygon,

    networks: [Polygon],
    readOnlyUrls: {
        [ChainId.Polygon]: 'https://polygon-rpc.com/',
    },
    pollingInterval: 1000,
}

// const config = {
//     readOnlyChainId: ChainId.Rinkeby,

//     networks: [Rinkeby],
//     readOnlyUrls: {
//         [Rinkeby.chainId]: `https://rinkeby.infura.io/v3/${InfuraId}`,
//     },
//     pollingInterval: 1000,
// }

const container = document.getElementById('root')
const root = createRoot(container!) // createRoot(container!) if you use TypeScript
root.render(<DAppProvider config={config} children={<App />} />)

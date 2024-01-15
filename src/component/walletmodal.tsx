import { useEffect, useState } from 'react'
import { useLocalStorage } from '@usedapp/core/dist/esm/src/hooks'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Button from './button'
import { useEthers } from '@usedapp/core'

import MetamaskImage from '../img/wallet/metamask.svg'
import WalletconnectImage from '../img/wallet/walletconnect.svg'

import './walletmodal.scss'
import { ChainId } from '@usedapp/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

const injected = new InjectedConnector({
    supportedChainIds: [ChainId.Rinkeby, ChainId.Polygon],
})

const walletconnect = new WalletConnectConnector({
    rpc: {
        [ChainId.Polygon]: 'https://polygon-rpc.com/',
    },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    supportedChainIds: [ChainId.Polygon],
    chainId: ChainId.Polygon,
})

const activateInjectedProvider = (providerName: string) => {
    const { ethereum } = window

    if (!ethereum?.providers) {
        return undefined
    }

    let provider
    switch (providerName) {
        case 'coinbase':
            provider = ethereum.providers.find(
                ({ isCoinbaseWallet }: { isCoinbaseWallet: string }) =>
                    isCoinbaseWallet,
            )
            break
        case 'metamask':
            provider = ethereum.providers.find(
                ({ isMetaMask }: { isMetaMask: string }) => isMetaMask,
            )
            break
        default:
            return
    }
    if (provider) {
        ethereum.setSelectedProvider(provider)
    }
}
const WalletConnectionModal = ({
    open,
    onClose,
}: {
    open: boolean
    onClose: () => void
}) => {
    const [value, setValue] = useLocalStorage('naisWalletConnectedme')
    const { account, activate, deactivate, connector, chainId, switchNetwork } =
        useEthers()

    useEffect(() => {
        if (account && chainId !== ChainId.Polygon) {
            if (value === 'metamask' || value === 'coinbase') {
                setTimeout(() => {
                    deactivate()
                }, 100)
                switchNetwork(ChainId.Polygon)
            }
        } else if (!account && chainId === ChainId.Polygon) {
            if (value === 'metamask' || value === 'coinbase') activate(injected)
            if (value === 'walletconnect') activate(walletconnect)
        }
    }, [account, value, chainId, deactivate, activate, switchNetwork])

    return (
        <Modal
            aria-labelledby='transition-modal-title'
            aria-describedby='transition-modal-description'
            className='modal'
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <div className='paper'>
                    <div className='content'>
                        <Button
                            secondary
                            customClass={
                                'button ' + account &&
                                connector === injected &&
                                'selected'
                            }
                            onClick={async () => {
                                activateInjectedProvider('metamask')
                                await activate(injected)
                                setValue('metamask')
                                onClose()
                            }}
                            fullWidth
                        >
                            <img src={MetamaskImage} alt='metamask' />
                            <span className='inner'>
                                Metamask
                                <small>Connect to your MetaMask Wallet</small>
                            </span>
                        </Button>

                        <Button
                            secondary
                            customClass={
                                'button ' + account &&
                                connector === walletconnect &&
                                'selected'
                            }
                            onClick={async () => {
                                await activate(walletconnect)
                                setValue('walletconnect')
                                onClose()
                            }}
                            fullWidth
                        >
                            <img src={WalletconnectImage} alt='walletconnect' />
                            <span className='inner'>
                                WalletConnect
                                <small>
                                    Scan with WalletConnect to connect
                                </small>
                            </span>
                        </Button>
                        {/* <Button
              customClass={
                'button ' + account && connector === injected && 'selected'
              }
              onClick={async () => {
                activateInjectedProvider('coinbase');
                await activate(injected);
                setValue('coinbase');
                onClose();
              }}
              fullWidth
            >
              <img src={CoinbaseImage} alt='coinbase' />
              <span className='inner'>
                Coinbase
                <small>Connect to your Coinbase Wallet</small>
              </span>
            </Button> */}
                        {account && (
                            <Button
                                secondary
                                customClass='disconnect'
                                onClick={() => {
                                    deactivate()
                                    setValue('')
                                }}
                            >
                                Disconnect
                            </Button>
                        )}
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}
export default WalletConnectionModal

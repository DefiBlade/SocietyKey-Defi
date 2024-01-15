import { useState, useMemo, useEffect, useCallback } from 'react'
import { Container, Box, useMediaQuery, useTheme } from '@material-ui/core'
import { Button, Grid, Stack } from '@mui/material'
import { useEthers, shortenAddress, TransactionStatus } from '@usedapp/core'
import { toast } from 'react-toastify'
import { ethers } from 'ethers'

import Card from './card'
import WalletConnectionModal from '../component/walletmodal'
import {
    useSocietyNobleBalance,
    useSocietyCoinBalance,
    useSocietyKeyBalance,
    useSocietyNobleGift,
    useSocietyCoinGift,
    useSocietyKeyGift,
    useClaimSocietyNoble,
    useClaimSocietyCoin,
    useClaimSocietyKey,
    useSendSocietyKey,
    useSendSocietyCoin,
    useSendSocietyNoble
} from '../hooks/useContract'
import useEstimateGas from '../hooks/useEstimateGas'
import {
    SocietyNobleContract,
    SocietyCoinContract,
    SocietyKeyContract,
} from '../global/constants'
import { BIG_ZERO } from '../global/constants'

import './about.scss'
import NeoTigerCard from './NeonTigerCard'
import SocietyH2oCard from './SocietyH2oCard'
import NobleStackCard from './NobleStackCard'
import P2pSwapCard from './P2pSwapCard'
import NobleOz from './NobleOz'

const toastMsg = (state: TransactionStatus) => {
    if (state.status === 'PendingSignature')
        toast.info('Waiting for signature', {
            position: toast.POSITION.BOTTOM_RIGHT,
            hideProgressBar: true,
        })

    if (state.status === 'Exception')
        toast.warning('User denied signature', {
            position: toast.POSITION.BOTTOM_RIGHT,
            hideProgressBar: true,
        })

    if (state.status === 'Mining')
        toast.info('Pending transaction', {
            position: toast.POSITION.BOTTOM_RIGHT,
            hideProgressBar: true,
        })

    if (state.status === 'Success')
        toast.success('Successfully confirmed', {
            position: toast.POSITION.BOTTOM_RIGHT,
            hideProgressBar: true,
        })
}

const About = () => {
    const [wallet, setWallet] = useState(false)
    const { account } = useEthers()
    const {
        claimSocietyNobleGas,
        claimSocietyCoinGas,
        claimSocietyKeyGas,
        sendSocietyKeyGas,
        sendSocietyCoinGas,
        sendSocietyNobleGas
    } = useEstimateGas()
    const societyNobleBalance = useSocietyNobleBalance(account)
    const societyCoinBalance = useSocietyCoinBalance(account)
    const societyKeyBalance = useSocietyKeyBalance(account)
    const societyNobleGift = useSocietyNobleGift(account)
    const societyCoinGift = useSocietyCoinGift(account)
    const societyKeyGift = useSocietyKeyGift(account)
    const { claimSocietyNobleState, claimSocietyNoble } = useClaimSocietyNoble()
    const { claimSocietyCoinState, claimSocietyCoin } = useClaimSocietyCoin()
    const { claimSocietyKeyState, claimSocietyKey } = useClaimSocietyKey()
    const { sendSocietyKeyState, sendSocietyKey } = useSendSocietyKey()
    const {sendSocietyCoinState, sendSocietyCoin} = useSendSocietyCoin();
    const {sendSocietyNobleState, sendSocietyNoble} = useSendSocietyNoble();
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const claimSN = useCallback(
        async (address: string | undefined = account) => {
            console.log(address)
            try {
                const estimatedGas = await claimSocietyNobleGas(address)
                console.log(estimatedGas)
                claimSocietyNoble(address, { gasLimit: estimatedGas })
            } catch (error) {
                if (error.error)
                    toast.error(
                        error.error.data.message
                            .split('execution reverted: ')
                            .join(''),
                        {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            hideProgressBar: true,
                        },
                    )
                else
                    toast.error(error.message, {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        hideProgressBar: true,
                    })
            }
        },
        [account],
    )

    const claimSC = useCallback(
        async (address: string | undefined = account) => {
            console.log(address, 'SC')
            try {
                const estimatedGas = await claimSocietyCoinGas(address)
                console.log(estimatedGas)
                claimSocietyCoin(address, { gasLimit: estimatedGas })
            } catch (error) {
                if (error.error)
                    toast.error(
                        error.error.data.message
                            .split('execution reverted: ')
                            .join(''),
                        {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            hideProgressBar: true,
                        },
                    )
                else
                    toast.error(error.message, {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        hideProgressBar: true,
                    })
            }
        },
        [account],
    )

    const claimSK = useCallback(
        async (address: string | undefined = account) => {
            console.log(address)
            try {
                const estimatedGas = await claimSocietyKeyGas(address)
                claimSocietyKey(address, { gasLimit: estimatedGas })
            } catch (error) {
                if (error.error)
                    toast.error(
                        error.error.data.message
                            .split('execution reverted: ')
                            .join(''),
                        {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            hideProgressBar: true,
                        },
                    )
                else
                    toast.error(error.message, {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        hideProgressBar: true,
                    })
            }
        },
        [account],
    )

    const sendSK = useCallback(
        async (
            address: string | undefined = account,
            amount: string | undefined,
        ) => {
            try {
                const num: string = amount as string
                const tokenAmount = ethers.utils.parseEther(num)
                const { estimatedGas, gasPrice } = await sendSocietyKeyGas(
                    address,
                    tokenAmount,
                )
                console.log(gasPrice)
                sendSocietyKey(address, tokenAmount, {
                    gasLimit: estimatedGas,
                    gasPrice: gasPrice,
                })
            } catch (error) {
                if (error.error)
                    toast.error(
                        error.error.data.message
                            .split('execution reverted: ')
                            .join(''),
                        {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            hideProgressBar: true,
                        },
                    )
                else
                    toast.error(error.message, {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        hideProgressBar: true,
                    })
            }
        },
        [account],
    )

    const sendSC = useCallback(
        async (
            address: string | undefined = account,
            amount: string | undefined,
        ) => {
            try {
                const num: string = amount as string
                const tokenAmount = ethers.utils.parseEther(num)
                const { estimatedGas, gasPrice } = await sendSocietyCoinGas(
                    address,
                    tokenAmount,
                )
                console.log(gasPrice)
                sendSocietyCoin(address, tokenAmount, {
                    gasLimit: estimatedGas,
                    gasPrice: gasPrice,
                })
            } catch (error) {
                if (error.error)
                    toast.error(
                        error.error.data.message
                            .split('execution reverted: ')
                            .join(''),
                        {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            hideProgressBar: true,
                        },
                    )
                else
                    toast.error(error.message, {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        hideProgressBar: true,
                    })
            }
        },
        [account],
    )

    const sendSN = useCallback(
        async (
            address: string | undefined = account,
            amount: string | undefined,
        ) => {
            try {
                const num: string = amount as string
                const tokenAmount = ethers.utils.parseEther(num)
                const { estimatedGas, gasPrice } = await sendSocietyNobleGas(
                    address,
                    tokenAmount,
                )
                console.log(gasPrice)
                sendSocietyNoble(address, tokenAmount, {
                    gasLimit: estimatedGas,
                    gasPrice: gasPrice,
                })
            } catch (error) {
                if (error.error)
                    toast.error(
                        error.error.data.message
                            .split('execution reverted: ')
                            .join(''),
                        {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            hideProgressBar: true,
                        },
                    )
                else
                    toast.error(error.message, {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        hideProgressBar: true,
                    })
            }
        },
        [account],
    )

    const copyAddress = (addresToCopy: any) => {
        navigator.clipboard.writeText(addresToCopy);
        toast.success('Copied',
        {
            position: toast.POSITION.BOTTOM_RIGHT,
            hideProgressBar: true,
        })
    }

    useEffect(() => {
        toastMsg(claimSocietyNobleState)
    }, [claimSocietyNobleState])

    useEffect(() => {
        toastMsg(claimSocietyCoinState)
    }, [claimSocietyCoinState])

    useEffect(() => {
        toastMsg(claimSocietyKeyState)
    }, [claimSocietyKeyState])

    useEffect(() => {
        toastMsg(sendSocietyKeyState)
    }, [sendSocietyKeyState])

    const adata = useMemo(
        () => [
            {
                imgurl: './img/scoin.png',
                copycontract: './img/copycontract.png',
                cointitle: 'SOCIETYCOIN',
                coinmoney: societyCoinBalance,
                gifttitle: 'SOCIETYKEY GOOD WORKS GIFT',
                giftmoney: societyCoinGift,
                buttonname: 'RECEIVE & GIFT',
                claim: claimSC,
                sendGift: sendSC,
                copyAddress: () => {copyAddress(SocietyCoinContract)},
            },
            {
                imgurl: './img/snoble.png',
                copycontract: './img/copycontract.png',
                cointitle: 'SOCIETYNOBLE',
                coinmoney: societyNobleBalance,
                gifttitle: 'SOCIETYKEY GOOD WORKS GIFT',
                giftmoney: societyNobleGift,
                buttonname: 'RECEIVE & GIFT',
                claim: claimSN,
                sendGift: sendSN,
                copyAddress: () => {copyAddress(SocietyCoinContract)},
            },
            {
                imgurl: './img/skey.png',
                copycontract: './img/copycontract.png',
                cointitle: 'SOCIETYKEY',
                coinmoney: societyKeyBalance,
                gifttitle: 'THE KEY TO BUILDING A HIGH TRUST SOCIETY',
                reward: 'reward',
                buttonname: `UNLOCK & GIFT`,
                background: '#88abc6',
                claim: claimSK,
                sendGift: sendSK,
                copyAddress: () => {copyAddress(SocietyKeyContract)},
            },
        ],
        [
            societyNobleBalance,
            societyCoinBalance,
            societyKeyBalance,
            societyNobleGift,
            societyCoinGift,
        ],
    )

    return (
        <>
            <img src={'./img/new_bg.jpg'} id="myVideo"/> 
            <Box className='claims'>
                <WalletConnectionModal
                    open={wallet}
                    onClose={() => setWallet(false)}
                />
                <Container className='claim'>
                    <div className='claim-content'>
                        <div className='connects-wallet'>
                            <Button className='connects-button'>
                                <div
                                    onClick={() => {
                                        setWallet(true)
                                    }}
                                >
                                    {
                                        account
                                        ? 
                                            `${shortenAddress(account)}`
                                        : 
                                            `CONNECT WALLET`
                                    }
                                </div>

                                <img
                                    className='connects-button-refresh'
                                    src='./img/refresh.PNG'
                                    onClick={() => {
                                        window.location.reload()
                                    }}
                                />
                            </Button>
                        </div>
                        <div className='total-balance'>
                            <p className='balance-title'>TOTAL BALANCE</p>
                            <p className='balance-number'>
                                <span className='balance-number-money'>
                                    {(
                                        (societyCoinBalance &&
                                            societyNobleBalance &&
                                            societyKeyBalance &&
                                            Number(
                                                societyCoinBalance.add(
                                                    societyNobleBalance.add(
                                                        societyKeyBalance,
                                                    )
                                                ),
                                            ) / 1e18) ||
                                        0
                                    ).toFixed(4)}
                                </span>
                                <img
                                    className='balance-number-img'
                                    src='./img/symbol.png'
                                />
                            </p>
                        </div>
                    </div>
                    <div className='claim-gifts'>
                        <div>
                            <Grid
                                container
                                columns={12}
                                direction='row'
                                justifyContent='center'
                                >
                                {adata.map(({ ...item }, index) => (
                                    <Grid item xs={12} md={8} mt={2} key={index}>
                                        <Card {...item} />
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid
                                container
                                columns={12}
                                direction='row'
                                justifyContent='center'
                            >
                                <Grid xs={12} md={8} mt={2}>
                                    <span className='coin-number' style={{color:"#fff"}}>WORKS SOCIETY</span>
                                </Grid>
                                <Grid xs={12} md={8} mt={1}>
                                    <NeoTigerCard/>
                                </Grid>
                            </Grid>

                            <Grid
                                container
                                columns={12}
                                direction='row'
                                justifyContent='center'
                            >
                                <Grid xs={12} md={8} mt={2}>
                                    <span className='coin-number' style={{color:"#fff"}}>SOCIETY SUPPLY CHAIN</span>
                                </Grid>
                                <Grid xs={12} md={8} mt={1}>
                                    <SocietyH2oCard/>
                                </Grid>
                            </Grid>

                            <Grid
                                container
                                columns={12}
                                direction='row'
                                justifyContent='center'
                            >
                                <Grid xs={12} md={8} mt={2}>
                                    <span className='coin-number' style={{color:"#fff"}}>COMING SOON</span>
                                </Grid>
                                <Grid xs={12} md={8} mt={1}>
                                    <NobleOz/>
                                </Grid>
                            </Grid>

                            <Grid
                                container
                                columns={12}
                                direction='row'
                                justifyContent='center'
                            >
                                <Grid xs={12} md={8} mt={2}>
                                    <span className='coin-number' style={{color:"#fff"}}>NOBLE STACKS - STACK FOR TRANSFER</span>
                                </Grid>
                                <Grid xs={12} md={8} mt={1}>
                                    <NobleStackCard/>
                                </Grid>
                            </Grid>

                            <Grid
                                id="swap-card"
                                container
                                columns={12}
                                direction='row'
                                justifyContent='center'
                            >
                                <Grid xs={12} md={8} mt={2}>
                                    <span className='coin-number' style={{color:"#fff"}}>PEER TO PEER SOCIETY SWAP</span>
                                </Grid>
                                <Grid xs={12} md={8} mt={1}>
                                    <P2pSwapCard/>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Container>
            </Box>
        </>
    )
}
export default About

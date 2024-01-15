import { memo, useState } from 'react'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { BigNumber } from '@ethersproject/bignumber'

import './card.scss'

import { QrReader } from 'react-qr-reader';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CloseIcon from '@mui/icons-material/Close';
import CameraIcon from '@mui/icons-material/Camera';
import { Grid } from '@mui/material'

const Card = (props: {
    cointitle: string
    gifttitle: string
    imgurl: string
    opacity?: string
    copycontract?: string
    coinmoney: BigNumber
    giftmoney?: BigNumber
    buttonname: string
    reward?: string
    background?: string
    claim?: (address?: string | undefined) => void
    sendGift?: (address: string | undefined, amount: string | undefined) => void
    copyAddress?: () => void
}) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#0b1324',
        border: '1px solid #2a2d3c',
        borderRadius: '10px',
        boxShadow: 24,
        p: 4,
    }

    const styleb = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#0b1324',
        border: '1px solid #2a2d3c',
        borderRadius: '10px',
        boxShadow: 24,
        pl: 4,
        pr: 4,
        pt: 10,
        pb: 10,
    }

    const {
        cointitle,
        gifttitle,
        imgurl,
        copycontract,
        coinmoney,
        giftmoney,
        opacity,
        buttonname,
        reward,
        background,
        claim,
        sendGift,
        copyAddress,
    } = props

    const [opena, setOpena] = useState(false)
    const [claimAddress, setClaimAddress] = useState('')
    const [claimAmount, setClaimAmount] = useState('')
    const handleOpena = () => claim && setOpena(true)
    const handleClosea = () => setOpena(false)

    const [openb, setOpenb] = useState(false)
    const handleOpenb = () => claim && setOpenb(true)
    const handleCloseb = () => setOpenb(false)
    const [showQrScan, setShowQrScan] = useState(false);
    const openQrScanner = () => {
        setClaimAddress('');
        setShowQrScan(true)
    };
    const closeQrScanner = () => setShowQrScan(false);
    const [camera, setCamera] = useState('environment');
    const switchCamera = () => {
        if(camera == 'environment') {
            setCamera('user');
        } else {
            setCamera('environment')
        }
        setShowQrScan(false);
    }

    const [openc, setOpenc] = useState(false)
    const handleOpenc = () => claim && setOpenc(true)
    const handleClosec = () => setOpenc(false)

    return (
        <div>
            <div className={`coin-total ${opacity}`}>
                <div className='coin-img'>
                    <img src={imgurl} alt='imgs' className='coin-img-coin' />
                </div>
                <div className='coin-content'>
                    <div className='coin-number'>
                        <p>
                            {cointitle}{' '}
                            {copycontract && (
                                <img
                                    className='coin-number-contract'
                                    src={copycontract}
                                    onClick={() => {if (copyAddress) copyAddress()}}
                                />
                            )}
                        </p>
                        <p style={{ display: 'flex', alignItems: 'center' }}>
                            <span>
                                {(Number(coinmoney) / 1e18 || 0).toFixed(4)}
                            </span>{' '}
                            <img
                                className='coin-number-symbol'
                                src='./img/symbol.png'
                            />{' '}
                        </p>
                    </div>
                    <div className='coin-gift'>
                        <span>{gifttitle}</span>
                        <p style={{ display: 'flex', alignItems: 'center' }}>
                            {giftmoney && (
                                <>
                                    <span>
                                        {(
                                            Number(giftmoney) / 1e18 || 0
                                        ).toFixed(4)}
                                    </span>{' '}
                                    <img
                                        className='coin-number-symbol'
                                        src='./img/symbol.png'
                                    />{' '}
                                </>
                            )}
                        </p>
                    </div>
                    <div className='coin-button-group'>
                        <button
                            className='coin-button-receive'
                            onClick={(e) => {
                                e.stopPropagation()
                                if (claim) {
                                    if (reward) setOpenb(true)
                                    else claim()
                                }
                            }}
                        >
                            {
                                reward
                                ?
                                'UNLOCK'
                                :
                                'RECEIVE'
                            }
                            <img
                                className='coin-number-symbol'
                                src='./img/symbol_blue.png'
                            />&nbsp;
                            {'GIFT'}
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                if (claim) {
                                if (sendGift) setOpenc(true)
                                else setOpena(true)}
                            }}
                            className='coin-button-gift'
                        >
                            SEND 
                            <img
                                className='coin-number-symbol'
                                src='./img/symbol_blue.png'
                            />
                        </button>
                    </div>
                </div>
            </div>


            <Modal
                aria-labelledby='transition-modal-title'
                aria-describedby='transition-modal-description'
                open={opena}
                onClose={handleClosea}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={opena}>
                    <Box sx={style} className='give-modal'>
                        <p
                            style={{
                                fontSize: '20px',
                                color: '#d0d1d5',
                                letterSpacing: '0.2em',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                
                            }}
                        >
                            SEND
                            <img
                                style={{
                                    width: '11px',
                                    height: '20px',
                                    margin: '0px 6px',
                                }}
                                src='./img/symbol.png'
                            />
                        </p>

                        <Box
                            sx={{
                                width: 500,
                                maxWidth: '100%',
                            }}
                        >
                            <TextField
                                fullWidth
                                label='RECIPIENT ADDRESS'
                                id='claim'
                                sx={{ mb: 5, mt: 2 }}
                                style={{
                                    backgroundColor: '#eee',
                                    borderRadius: '5px',
                                }}
                                value={claimAddress}
                                onChange={(e) =>
                                    setClaimAddress(e.target.value)
                                }
                            />
                            <QrCodeIcon
                                onClick={openQrScanner}
                                style={{position:'absolute', right:'32px',top:'88px', cursor:'pointer'}}
                            />
                        </Box>
                        <Box>
                            <Button
                                className='card-modal-button'
                                sx={{ mr: 3, backgroundColor:'#243954 !important', color:'#72aee8', fontWeight:'bold' }}
                                variant='contained'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    console.log(claimAddress)
                                    console.log(claim)
                                    if (claim) claim(claimAddress)
                                }}
                            >
                                Confirm
                            </Button>
                            <Button
                                variant='contained'
                                className='card-modal-button-a'
                                onClick={handleClosea}
                                sx={{backgroundColor:'#243954 !important', color:'#72aee8', fontWeight:'bold'}}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby='transition-modal-title'
                aria-describedby='transition-modal-description'
                open={openb}
                onClose={handleCloseb}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openb}>
                    <Box sx={styleb} className='give-modal'>
                        <span
                            style={{
                                fontSize: '20px',
                                color: '#d0d1d5',
                                letterSpacing: '0.2em',
                            }}
                        >
                            REDEEM YOUR SOCIETYKEYS AT ONE OF OUR SOCIETYMAKER
                            LOCATIONS-{' '}
                            <a
                                href='http://localist.societykey.app/'
                                style={{
                                    color: '#eee',
                                    textDecoration: 'none',
                                }}
                            >
                                SOCIETY LOCALIST
                            </a>
                        </span>
                    </Box>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby='transition-modal-title'
                aria-describedby='transition-modal-description'
                open={openc}
                onClose={handleClosec}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openc}>
                    <Box sx={style} className='give-modal'>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <p
                                style={{
                                    fontSize: '20px',
                                    color: '#d0d1d5',
                                    letterSpacing: '0.2em',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                SEND
                                <img
                                    style={{
                                        width: '11px',
                                        height: '20px',
                                        margin: '0px 6px',
                                    }}
                                    src='./img/symbol.png'
                                />
                            </p>
                            <TextField
                                className='give-modal-amount'
                                fullWidth
                                label='ADD AMOUNT FIELD'
                                id='amount'
                                sx={{ ml: 5 }}
                                style={{
                                    backgroundColor: '#eee',
                                    borderRadius: '3px',
                                    color:'#72aee8'
                                }}
                                value={claimAmount}
                                onChange={(e) => setClaimAmount(e.target.value)}
                            />
                        </Box>

                        <Box
                            sx={{
                                width: 500,
                                maxWidth: '100%',
                            }}
                        >
                            <TextField
                                fullWidth
                                label='RECIPIENT ADDRESS'
                                id='claim'
                                sx={{ mb: 5, mt: 2 }}
                                style={{
                                    backgroundColor: '#eee',
                                    borderRadius: '5px',
                                }}
                                value={claimAddress}
                                onChange={(e) =>
                                    setClaimAddress(e.target.value)
                                }
                            />
                            <QrCodeIcon
                                onClick={openQrScanner}
                                style={{position:'absolute', right:'32px',top:'110px', cursor:'pointer'}}
                            />
                        </Box>
                        <Box>
                            <Button
                                className='card-modal-button'
                                sx={{ mr: 3, backgroundColor:'#243954 !important', color:'#72aee8', fontWeight:'bold' }}
                                variant='contained'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (sendGift)
                                        sendGift(claimAddress, claimAmount)
                                }}
                            >
                                Confirm
                            </Button>
                            <Button
                                variant='contained'
                                className='card-modal-button-a'
                                onClick={handleClosec}
                                sx={{backgroundColor:'#243954 !important', color:'#72aee8', fontWeight:'bold'}}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            {
                showQrScan
                ?
                    <Box style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform:'translate(-50%, -50%)',
                        // backgroundColor:'#fff',
                        zIndex:999999,
                        width:'50%',
                    }}>
                        <CloseIcon
                            onClick={closeQrScanner} 
                            style={{
                                color:'#fff',
                                cursor:'pointer',
                                position: 'absolute',
                                zIndex: 1,
                                right:0,
                                width:'27px'
                            }}
                        />
                        <CameraIcon
                            onClick={switchCamera}
                            style={{
                                color:'#fff',
                                cursor:'pointer',
                                position: 'absolute',
                                zIndex: 1,
                                left:0,
                                width:'27px'
                            }}
                        />
                        <QrReader
                            constraints={{facingMode: camera}}
                            onResult={(result, error) => {
                            if (!!result) {
                                setClaimAddress(result.getText().replace('ethereum:','').slice(0,42));
                                closeQrScanner();
                            }

                            if (!!error) {
                                console.info(error);
                            }
                            }}
                        />
                    </Box>
                :
                ''
            }
        </div>
    )
}
export default memo(Card)

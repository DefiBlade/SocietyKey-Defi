import { memo, useEffect, useState } from 'react'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SocietyCoinABI from '../abis/NeonTigerSociety.json';
import SocietyH2OABI from '../abis/SocietyH2O.json';
import Staking_SctyH2OABI from '../abis/Staking_SctyH2O.json';
import Staking_NTSctyABI from '../abis/Staking_NTScty.json';

import { SocietyCoinContract, SocietyH2O, Staking_SctyH2O } from '../global/constants'

import { BIG_ZERO } from '../global/constants'

import './card.scss'
import { useNoWalletContract } from '../hooks/useContract'
import { useEthers, TransactionStatus } from '@usedapp/core'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { QrReader } from 'react-qr-reader';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CloseIcon from '@mui/icons-material/Close';
import CameraIcon from '@mui/icons-material/Camera';
import { Grid } from '@mui/material'

const NobleOz = () => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#0b1324',
        border: '1px solid #0b1324',
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
        border: '1px solid #0b1324',
        borderRadius: '10px',
        boxShadow: 24,
        pl: 4,
        pr: 4,
        pt: 10,
        pb: 10,
    }

    const { account } = useEthers()

    const societyContract: any = useNoWalletContract(SocietyCoinABI.abi, SocietyCoinContract);
    const societyH2o: any = useNoWalletContract(SocietyH2OABI.abi, SocietyH2O);
    const stakingContract: any = useNoWalletContract(Staking_NTSctyABI.abi, Staking_SctyH2O);

    const [balance, setBalance] = useState<any>(BIG_ZERO);
    const [approved, setApproved] = useState(false);

    const copycontract = './img/copycontract.png';

    

    const [opena, setOpena] = useState(false)
    const [claimAddress, setClaimAddress] = useState('')
    const [claimAmount, setClaimAmount] = useState('')
    const handleOpena = () => setOpena(true)
    const handleClosea = () => setOpena(false)
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

    const [openb, setOpenb] = useState(false)
    const handleOpenb = () => setOpenb(true)
    const handleCloseb = () => setOpenb(false)

    const [openc, setOpenc] = useState(false)
    const handleOpenc = () => setOpenc(true)
    const handleClosec = () => setOpenc(false)

    const copyAddress = () => {
        // navigator.clipboard.writeText(SocietyCoinContract);
        toast.success('Copied',
        {
            position: toast.POSITION.BOTTOM_RIGHT,
            hideProgressBar: true,
        })
    }


    const showError = (error: any) => {
        if (error.error){
            toast.error(
                error.error.data.message
                    .split('execution reverted: ')
                    .join(''),
                {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    hideProgressBar: true,
                },
            )
        }
        else {
            toast.error(error.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                hideProgressBar: true,
            })
        }
    }

    const approve = async () => {
        try {
            return;
            await societyContract.approve(Staking_SctyH2O, ethers.constants.MaxUint256).then((tx: any) => {
                tx.wait().then((res: any) => {
                    setApproved(true);
                    toast.success('Approve successful', {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        hideProgressBar: true,
                    })
                })
            })
        } catch (error) {
            showError(error);
        }
    }

    const stake = async () => {
        try {
            return;
            await stakingContract.stake(ethers.utils.parseEther(claimAmount)).then((tx: any) => {
                tx.wait().then((responce: any ) => {
                    toast.success('Stake successful', {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        hideProgressBar: true,
                    })
                })
            })
        } catch (error) {
            showError(error);
        }
    }

    const claimStake = async () => {
        try {
            return;
            await stakingContract.withdraw(ethers.utils.parseEther(claimAmount)).then((tx:any) => {
                tx.wait().then((response: any) => {
                    toast.success('Stake Claimed', {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        hideProgressBar: true,
                    })
                })
            })
        } catch (error) {
            showError(error)
        }
    }

    

    const transfer = async () => {
        try {
            return;
            if(!claimAddress) throw "No claim address defined"
            if(!claimAmount) throw "No amount entered to trnasfer"
            await societyH2o.transfer(claimAddress, ethers.utils.parseEther(claimAmount)).then((tx: any) => {
                tx.wait().then((response: any) => {
                    toast.success('Transfer successful', {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        hideProgressBar: true,
                    })
                })
            })
        } catch (error) {
            showError(error)
        }
    }

    const checkApproved = async () => {
        try {
            let allowance = await societyContract.allowance(account, Staking_SctyH2O);
            let amount = ethers.utils.parseEther(claimAmount);

            if(Number(allowance) >= Number(amount)){
                setApproved(true)
            } else {
                setApproved(false);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const checkBalance = async () => {
        try {
            if(account) {
                const blnc = await societyH2o.balanceOf(account);
                setBalance(Number(blnc)/1e18);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        checkApproved();
    },[claimAmount])
    
    useEffect(()=> {
        checkBalance();
    },[account])

    return (
        <div>
            <Box sx={{flexGrow: 1}} className={`coin-total`}>
                <Grid container spacing={2}>
                    <Grid item sm={2} xs={3} sx={{marginTop:'5px'}}>
                    {/* <img className='coin-img coin-img1' src='./img/h2o_pink.jpg' alt='imgs' style={{width:'100%'}} /> */}
                    </Grid>
                    <Grid item sm={10} xs={9}>
                        <Box sx={{flexGrow: 1}}>
                            <Grid container spacing={1} className='margin-top-device'>
                                <Grid item xs={8}>
                                    <p style={{
                                        color:'#ffffff', 
                                        fontSize:'1.5em', 
                                        letterSpacing:'0.1em'
                                    }}
                                    className='card-title'
                                    >
                                        {'NOBLE OZ'}{' '}
                                        {copycontract && (
                                            <img
                                                className='coin-number-contract'
                                                src={copycontract}
                                                onClick={() => {copyAddress()}}
                                            />
                                        )}
                                    </p>
                                </Grid>
                                <Grid item xs={4}>
                                    <p style={{
                                        color:'#ffffff', 
                                        fontSize:'1.5em', 
                                        letterSpacing:'0.1em', 
                                        textAlign:'right', 
                                    }}
                                    className='card-title'
                                    >
                                        <span>
                                            {(Number(balance)).toFixed(4)}
                                        </span>{' '}
                                        <img
                                            className='coin-number-symbol'
                                            src='./img/symbol.png'
                                        />
                                        {' '}
                                    </p>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} className='margin-top-device'>
                                <Grid item xs={12}>
                                    <p style={{
                                        fontSize:'1.3em',
                                        letterSpacing:'0.1em',
                                        color:'#7f95be',
                                    }}
                                    className='card-sub-title'
                                    >
                                        <span>{'SECURE YOUR LOCAL NOBLEOZ SUPPLY CHAIN'}</span>
                                    </p>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} className='margin-top-device'>
                                <Grid item xs={4}>
                                    <button
                                            className='coin-button-receive'
                                            onClick={handleOpena}
                                            style={{backgroundColor:'#2f8af5', color:'#ffffff'}}
                                        >
                                        {'BUY'}
                                    </button>
                                </Grid>
                                <Grid item xs={4} className='margin-top-device'>
                                    <button
                                        className='coin-button-receive'
                                        onClick={handleOpenb}
                                        style={{backgroundColor:'#2f8af5', color:'#ffffff'}}
                                    >
                                        {'SELL'}
                                    </button>
                                </Grid>
                                <Grid item xs={4}>
                                    <button
                                        onClick={handleOpenc}
                                        className='coin-button-gift'
                                    >
                                        SEND
                                        <img
                                            className='coin-number-symbol'
                                            src='./img/symbol_blue.png'
                                        />
                                    </button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            
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
                            BUY
                        </p>

                        <Box
                            sx={{
                                width: 500,
                                maxWidth: '100%',
                            }}
                        >
                            <TextField
                                fullWidth
                                label='BUY AMOUNT'
                                id='claim'
                                sx={{ mb: 5, mt: 2 }}
                                style={{
                                    backgroundColor: '#eee',
                                    borderRadius: '5px',
                                }}
                                value={claimAmount}
                                onChange={(e) =>
                                    setClaimAmount(e.target.value)
                                }
                            />
                        </Box>
                        <Box>
                            <Button
                                className='card-modal-button'
                                sx={{ mr: 3, backgroundColor:'#243954 !important', color:'#72aee8', fontWeight:'bold' }}
                                variant='contained'
                                onClick={approved ? stake : approve}
                            >
                                {
                                    approved
                                    ?"CONFIRM"
                                    :"APPROVE"
                                }
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
                            SELL
                        </p>

                        <Box
                            sx={{
                                width: 500,
                                maxWidth: '100%',
                            }}
                        >
                            <TextField
                                fullWidth
                                label='SELL AMOUNT'
                                id='claim'
                                sx={{ mb: 5, mt: 2 }}
                                style={{
                                    backgroundColor: '#eee',
                                    borderRadius: '5px',
                                }}
                                value={claimAmount}
                                onChange={(e) =>
                                    setClaimAmount(e.target.value)
                                }
                            />
                        </Box>
                        <Box>
                            <Button
                                className='card-modal-button'
                                sx={{ mr: 3, backgroundColor:'#243954 !important', color:'#72aee8', fontWeight:'bold' }}
                                variant='contained'
                                onClick={claimStake}
                            >
                                {'CONFIRM'}
                            </Button>
                            <Button
                                variant='contained'
                                className='card-modal-button-a'
                                onClick={handleCloseb}
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
                                sx={{ mb: 5, mt: 2, width:'100%' }}
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
                                onClick={transfer}
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
                        width:'50%'
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

export default memo(NobleOz)

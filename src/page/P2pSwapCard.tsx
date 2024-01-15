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
import StackLv1NoblestackABI from '../abis/StackLv1NobleStacks.json';
import P2pSwapLv1NoblestackABI from '../abis/P2PSwapLv1NobleStack.json';
import LV1NobleStackABI from "../abis/Lv1NobleStack.json";
import { Interface } from '@ethersproject/abi'
import { Contract } from '@ethersproject/contracts'

import { 
    SocietyCoinContract, 
    SocietyNobleContract,
    SocietyH2O, 
    Staking_SctyH2O,

    StackLv1Noblestack,
    StackLv2Noblestack,
    StackLv3Noblestack,
    StackLv4Noblestack,
    LV1NobleStack,
    LV2NobleStack,
    LV3NobleStack,
    LV4NobleStack,
    P2pSwapLv1Noblestack,
    P2pSwapLv2Noblestack,
    P2pSwapLv3Noblestack,
    P2pSwapLv4Noblestack,
    UsdcAdress,
    SocietyKeyContract
} from '../global/constants'

import { BIG_ZERO } from '../global/constants'

import './card.scss'
import { getProviderOrSigner, getSigner, useNoWalletContract } from '../hooks/useContract'
import { useEthers, TransactionStatus } from '@usedapp/core'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { Grid } from '@mui/material'
const P2pSwapCard = () => {
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

    const SwapType = {
        usdc:'USDC',
        key: 'SOCIETYKEY'
    }


    const { account, library } = useEthers()
    const [posAmount, setPosAmount] = useState<any>(BIG_ZERO)
    const [stackAddress, setStackAddress] = useState(StackLv1Noblestack);
    const [posAddress, setPosAddress] = useState(LV1NobleStack);
    const [p2pAddress, setP2pAddress] = useState(P2pSwapLv1Noblestack);
    const [swapAddress, setSwapAddress] = useState(UsdcAdress);
    const [ratio, setRatio] = useState("19:1");
    const [level, setLevel] = useState(1);
    const [contractBalance, setContractBalance] = useState<any>(BIG_ZERO);
    const [balance, setBalance] = useState<any>(BIG_ZERO);
    const [approved, setApproved] = useState(false);
    const [approvedUsdc, setApprovedUsdc] = useState(false);
    const [swapIn, setSwapIn] = useState(SwapType.usdc);

    const changeSwapIn = (swapType: any) => {
        let addr = UsdcAdress;
        if(swapType == SwapType.key) {
            addr = SocietyKeyContract;
        }
        setSwapAddress(addr);
        setSwapIn(swapType);
    }
    
    const copycontract = './img/copycontract.png';
    const [opena, setOpena] = useState(false)
    const [claimAddress, setClaimAddress] = useState('')
    const [claimAmount, setClaimAmount] = useState('')
    const handleOpena = () => setOpena(true)
    const handleClosea = () => setOpena(false)

    const [openb, setOpenb] = useState(false)
    const handleOpenb = () => setOpenb(true)
    const handleCloseb = () => setOpenb(false)

    const [openc, setOpenc] = useState(false)
    const handleOpenc = () => setOpenc(true)
    const handleClosec = () => setOpenc(false)

    const [opend, setOpend] = useState(false)
    const handleOpend = () => setOpend(true)
    const handleClosed = () => setOpend(false)

    const [opene, setOpene] = useState(false)
    const handleOpene = () => setOpene(true)
    const handleClosee = () => setOpene(false)    

    const copyAddress = () => {
        navigator.clipboard.writeText(posAddress);
        toast.success('Copied',
        {
            position: toast.POSITION.BOTTOM_RIGHT,
            hideProgressBar: true,
        })
    }

    const setLevelDetail = (lvl: any) => {
        if(lvl == 1) {
            setLevel(1)
            setRatio("19:1")
            setStackAddress(StackLv1Noblestack)
            setPosAddress(LV1NobleStack)
            setP2pAddress(P2pSwapLv1Noblestack);
        } else if (lvl == 2 ) {
            setLevel(2)
            setRatio("19:2")
            setStackAddress(StackLv2Noblestack)
            setPosAddress(LV2NobleStack)
            setP2pAddress(P2pSwapLv2Noblestack);
        } else if (lvl == 3) {
            setLevel(3)
            setRatio("19:3")
            setStackAddress(StackLv3Noblestack)
            setPosAddress(LV3NobleStack)
            setP2pAddress(P2pSwapLv3Noblestack);
        } else if (lvl == 4) {
            setLevel(4)
            setRatio("19:4")
            setStackAddress(StackLv4Noblestack)
            setPosAddress(LV4NobleStack)
            setP2pAddress(P2pSwapLv4Noblestack);
        }
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
            toast.error("Eror: error rejection", {
                position: toast.POSITION.BOTTOM_RIGHT,
                hideProgressBar: true,
            })
        }
    }

    const approve = async () => {
        try {
            const posContract = new Contract(posAddress, new Interface(LV1NobleStackABI.abi), getProviderOrSigner(library, account));
            await posContract.approve(p2pAddress, ethers.constants.MaxUint256).then((tx: any) => {
                tx.wait().then((res: any) => {
                    setApproved(true)
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

    const approveUsdc = async () => {
        try {
            const swapContract = new Contract(swapAddress, new Interface(SocietyCoinABI.abi), getProviderOrSigner(library, account));
            await swapContract.approve(p2pAddress, ethers.constants.MaxUint256).then((tx: any) => {
                tx.wait().then((res: any) => {
                    setApprovedUsdc(true);
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

    const deposit = async () => {
        try {
            const p2pContract = new Contract(p2pAddress, new Interface(P2pSwapLv1NoblestackABI), getProviderOrSigner(library, account));
            await p2pContract.deposit(ethers.utils.parseEther(claimAmount)).then((tx: any) => {
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

    const sell = async () => {
        try {
            const p2pContract = new Contract(p2pAddress, new Interface(P2pSwapLv1NoblestackABI), getProviderOrSigner(library, account));
            await p2pContract.sellTokenForUSDC(ethers.utils.parseEther(claimAmount)).then((tx: any) => {
                tx.wait().then((responce: any ) => {
                    toast.success('Sell successful', {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        hideProgressBar: true,
                    })
                })
            })
        } catch (error) {
            showError(error);
        }
    }


    const swap = async () => {
        try {
            // swapAddress
            const p2pContract = new Contract(p2pAddress, new Interface(P2pSwapLv1NoblestackABI), getProviderOrSigner(library, account));
           
            if (swapAddress == UsdcAdress) {
                await p2pContract.buyTokensWithUSDC(parseFloat(claimAmount) * 1000000).then((tx: any) => {
                    tx.wait().then((responce: any ) => {
                        toast.success('Buy successful', {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            hideProgressBar: true,
                        })
                    })
                })
            }
        else {
            await p2pContract.buyTokensWithSocietyKey(ethers.utils.parseEther(claimAmount)).then((tx: any) => {
                tx.wait().then((responce: any ) => {
                    toast.success('Buy successful', {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        hideProgressBar: true,
                    })
                })
            })
        }

        } catch (error) {
            showError(error);
        }
    }

    const withdrawPos = async () => {
        try {
            const p2pContract = new Contract(p2pAddress, new Interface(P2pSwapLv1NoblestackABI), getProviderOrSigner(library, account));
            await p2pContract.withdraw().then((tx:any) => {
                tx.wait().then((response: any) => {
                    toast.success('Noble Stack Withdrawed', {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        hideProgressBar: true,
                    })
                })
            })
        } catch (error) {
            showError(error)
        }
    }

    const claimPos = async () => {
        try {
            const p2pContract = new Contract(p2pAddress, new Interface(P2pSwapLv1NoblestackABI), getProviderOrSigner(library, account));
            await p2pContract.claimReward().then((tx:any) => {
                tx.wait().then((response: any) => {
                    toast.success('Reward Claimed', {
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
            const posContract = new Contract(posAddress, new Interface(LV1NobleStackABI.abi), getProviderOrSigner(library, account));
            if(!claimAddress) throw "No claim address defined"
            if(!claimAmount) throw "No amount entered to trnasfer"
            await posContract.depost(ethers.utils.parseEther(claimAmount)).then((tx: any) => {
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
            const posContract = new Contract(posAddress, new Interface(LV1NobleStackABI.abi), getProviderOrSigner(library, account));
            let allowance = await posContract.allowance(account, p2pAddress);
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

    const checkApprovedUsdc = async () => {
        try {
            const swapContract = new Contract(swapAddress, new Interface(SocietyCoinABI.abi), getProviderOrSigner(library, account));
            let allowance = await swapContract.allowance(account, p2pAddress);
            let amount = ethers.utils.parseEther(claimAmount);
            if(Number(allowance) >= Number(amount)){
                setApprovedUsdc(true)
            } else {
                setApprovedUsdc(false);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const checkBalance = async () => {
        try {
            const posContract = new Contract(posAddress, new Interface(LV1NobleStackABI.abi), getProviderOrSigner(library, account));
            if(account) {
                const blnc = await posContract.balanceOf(account);
                const blncContract = await posContract.balanceOf(p2pAddress);
                setBalance(Number(blnc)/1e18);
                setContractBalance(Number(blncContract)/1e18)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getAmountReceived = async () => {
        try {
            const p2pContract = new Contract(p2pAddress, new Interface(P2pSwapLv1NoblestackABI), getProviderOrSigner(library, account));
            let _amount = await p2pContract.getAmountReceive(ethers.utils.parseEther(claimAmount));
            setPosAmount(Number(_amount)/1e18)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        // getAmountReceived();
        checkApproved();
        checkApprovedUsdc();
    },[claimAmount, level, account])
    
    useEffect(()=> {
        checkBalance();
    },[account, level])

    return (
        <Box style={{borderRadius:"10px", backgroundColor:"#0b1324", padding:"10px 20px"}}>

            <Box sx={{flexGrow: 1}}>
                <Grid container spacing={2} style={{borderBottom:'solid 1px rgb(80 80 80)', paddingBottom:'5px'}}>
                    <Grid item xs={2}>
                        <p style={{color:'#ffffff', textAlign:'left'}}>Nobility:</p>
                    </Grid>
                    <Grid item xs={2}>
                        <p className='level-text-align' style={{color:'#ffffff'}}>
                            <span style={{width:'100%', cursor:'pointer', display:'inline-block'}} onClick={() => setLevelDetail(1)} className={level == 1 ? "level-active":""}>LV1</span>
                        </p>
                    </Grid>
                    <Grid item xs={2}>
                        <p className='level-text-align' style={{color:'#ffffff'}}>
                        <span style={{width:'100%', cursor:'pointer', display:'inline-block'}} onClick={() => setLevelDetail(2)} className={level == 2 ? "level-active":""}>LV2</span>
                        </p>
                    </Grid>
                    <Grid item xs={2}>
                        <p className='level-text-align' style={{color:'#ffffff'}}>
                        <span style={{width:'100%', cursor:'pointer', display:'inline-block'}} onClick={() => setLevelDetail(3)} className={level == 3 ? "level-active":""}>LV3</span>
                        </p>
                    </Grid>
                    <Grid item xs={2}>
                        <p className='level-text-align' style={{color:'#ffffff'}}>
                        <span style={{width:'100%', cursor:'pointer', display:'inline-block'}} onClick={() => setLevelDetail(4)} className={level == 4 ? "level-active":""}>LV4</span>
                        </p>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{flexGrow: 1}}>
                <Grid container spacing={2}>
                    <Grid item sm={2} xs={3} sx={{marginTop:'5px'}}>
                        <img className='coin-img' src={`./img/lv${level}.png`} alt='imgs' style={{width:'100%'}} />
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
                                    className='card-title1'
                                    >
                                        {`${level} Noble Stack POS Swap`}{' '}
                                        {copycontract && (
                                            <img
                                                className='coin-number-contract'
                                                src={copycontract}
                                                onClick={() => {
                                                    copyAddress()
                                                }}
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
                                            {(Number(contractBalance)).toFixed(4)}
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
                                <Grid item xs={8}>
                                    <p style={{
                                        fontSize:'1.3em',
                                        letterSpacing:'0.1em',
                                        color:'#7f95be',
                                    }}
                                    className='card-sub-title'
                                    >
                                        <span>{`SWAP YOUR USDC TO POS${level}`}</span>
                                    </p>
                                    {/* <p style={{
                                        color:'#7f95be',
                                        fontSize:'1.3em', 
                                        letterSpacing:'0.1em', 
                                        paddingTop:'1em'
                                    }}
                                    className='card-sub-title'
                                    >
                                        {`DEPOSIT POS & GET REWARD IN SOCIETYKEY`}
                                    </p> */}
                                </Grid>
                                <Grid item xs={4}>
                                    <p style={{
                                        fontSize:'1.3em',
                                        letterSpacing:'0.1em',
                                        color:'#7f95be',
                                        textAlign:'right'
                                    }}
                                    className='card-sub-title'
                                    >
                                        <span>
                                            {(Number(balance)).toFixed(4)}
                                        </span>{' '}
                                        <img
                                            className='coin-number-symbol'
                                            src='./img/symbol.png'
                                        />{' '}
                                    </p>
                                    
                                </Grid>
                            </Grid>
                            {/* <Grid container spacing={1} style={{marginTop:'5px'}}>
                                <Grid item xs={12}>
                                    <p style={{
                                        color:'#7f95be',
                                        fontSize:'1.3em', 
                                        letterSpacing:'0.1em', 
                                    }}
                                    className='card-sub-title'
                                    >
                                        {`DEPOSIT POS & GET REWARD IN SOCIETYKEY`}
                                    </p>
                                </Grid>
                            </Grid> */}
                            <Grid container spacing={1} className='margin-top-device'>
                                <Grid item xs={4}>
                                    <button
                                        className='coin-button-receive coin-button-receive2'
                                        onClick={handleOpena}
                                    >
                                        {'DEPOSIT'}
                                    </button>
                                </Grid>
                                <Grid item xs={4}>
                                    <button
                                        className='coin-button-receive coin-button-receive2'
                                        onClick={claimPos}
                                    >
                                        {'CLAIM'}
                                    </button>
                                </Grid>
                                <Grid item xs={4}>
                                    <button
                                        className='coin-button-receive coin-button-receive2'
                                        onClick={withdrawPos}
                                    >
                                        {'WITHDRAW'}
                                    </button>
                                </Grid>
                                <Grid item xs={4}>
                                    <button
                                        onClick={handleOpenc}
                                        className='coin-button-gift'
                                    >
                                        BUY
                                        {/* <img
                                            className='coin-number-symbol'
                                            src='./img/symbol_blue.png'
                                        /> */}
                                    </button>
                                </Grid>
                                <Grid item xs={4}>
                                    <button
                                        onClick={handleOpene}
                                        className='coin-button-gift'
                                    >
                                        SELL
                                        {/* <img
                                            className='coin-number-symbol'
                                            src='./img/symbol_blue.png'
                                        /> */}
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
                            DEPOSIT
                        </p>

                        <Box
                            sx={{
                                width: 500,
                                maxWidth: '100%',
                            }}
                        >
                            <TextField
                                fullWidth
                                label='DEPOSIT AMOUNT'
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
                            {
                                approved
                                ?
                                <Button
                                    className='card-modal-button'
                                    sx={{ mr: 3, padding:"3px 2px", backgroundColor:'#243954 !important', color:'#72aee8', fontWeight:'bold' }}
                                    variant='contained'
                                    onClick={deposit}
                                >
                                    {'DEPOSIT'}
                                </Button>
                                :""
                            }
                            {
                                !approved
                                ?
                                <Button
                                    className='card-modal-button'
                                    sx={{ mr: 3, padding:"3px 2px", backgroundColor:'#243954 !important', color:'#72aee8', fontWeight:'bold' }}
                                    variant='contained'
                                    onClick={approve}
                                >
                                    {`APPROVE POS${level}`}
                                </Button>
                                :""
                            }
                            <Button
                                variant='contained'
                                className='card-modal-button-a'
                                sx={{ mr: 3, padding:"3px 2px", backgroundColor:'#243954 !important', color:'#72aee8', fontWeight:'bold' }}
                                onClick={handleClosea}
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
                            CLAIM
                        </p>

                        <Box>
                            <Button
                                className='card-modal-button'
                                sx={{ mr: 3, backgroundColor:'#243954 !important', color:'#72aee8', fontWeight:'bold' }}
                                variant='contained'
                                onClick={claimPos}
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
                                borderBottom:'solid 1px #535353'
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
                                SWAP
                                <img
                                    style={{
                                        width: '11px',
                                        height: '20px',
                                        margin: '0px 6px',
                                    }}
                                    src='./img/symbol.png'
                                />
                            </p>
                            
                        </Box>

                        <Box 
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                border:'solid 1px #585858',
                                padding:'3px 0',
                                marginTop:'10px'
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <span
                                        style={{
                                            display:'inline-block',
                                            width:'100%',
                                            color:'#ffffff',
                                            padding:'10px 2px',
                                        }}
                                    >Swap Using</span>
                                </Grid>
                                <Grid item xs={9}>
                                    <select 
                                        onChange={(e) => changeSwapIn(e.target.value)}
                                        style={{
                                            width:'100%',
                                            height:'100%',
                                        }}    
                                    >
                                        <option value={SwapType.usdc}>{SwapType.usdc}</option>
                                        <option value={SwapType.key}>{SwapType.key}</option>
                                    </select>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box
                            sx={{
                                width: 500,
                                maxWidth: '100%',
                            }}
                        >
                            <TextField
                                fullWidth
                                label={`AMOUNT ${swapIn}`}
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
                        {/* <Box
                            sx={{
                                width: 500,
                                maxWidth: '100%',
                            }}
                        >
                            <TextField
                                fullWidth
                                disabled={true}
                                label={`AMOUNT POS${level}`}
                                id='claim'
                                sx={{ mb: 5, mt: 2 }}
                                style={{
                                    backgroundColor: '#eee',
                                    borderRadius: '5px',
                                }}
                                value={posAmount}
                            />
                        </Box> */}
                        <Box>

                            {
                                approvedUsdc
                                ?
                                    <Button
                                        className='card-modal-button'
                                        sx={{ mr: 3, backgroundColor:'#243954 !important', color:'#72aee8', fontWeight:'bold' }}
                                        variant='contained'
                                        onClick={swap}
                                    >
                                        Confirm
                                    </Button>
                                :
                                <Button
                                    className='card-modal-button'
                                    sx={{ mr: 3, backgroundColor:'#243954 !important', color:'#72aee8', fontWeight:'bold' }}
                                    variant='contained'
                                    onClick={approveUsdc}
                                    >
                                    APPROVE {swapIn}
                                </Button>

                            }

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

            <Modal
                aria-labelledby='transition-modal-title'
                aria-describedby='transition-modal-description'
                open={opend}
                onClose={handleClosed}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                >
                <Fade in={opend}>
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
                            WITHDRAW
                        </p>

                        <Box
                            sx={{
                                width: 500,
                                maxWidth: '100%',
                            }}
                        >
                            <TextField
                                fullWidth
                                label='WIDTHDRAW AMOUNT'
                                id='withdraw'
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
                                onClick={withdrawPos}
                            >
                                {'CONFIRM'}
                            </Button>
                            <Button
                                variant='contained'
                                className='card-modal-button-a'
                                onClick={handleClosed}
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
                open={opene}
                onClose={handleClosee}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={opene}>
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
                            {
                                approved
                                ?
                                <Button
                                    className='card-modal-button'
                                    sx={{ mr: 3, padding:"3px 2px", backgroundColor:'#243954 !important', color:'#72aee8', fontWeight:'bold' }}
                                    variant='contained'
                                    onClick={sell}
                                >
                                    {'CONFIRM'}
                                </Button>
                                :""
                            }
                            {
                                !approved
                                ?
                                <Button
                                    className='card-modal-button'
                                    sx={{ mr: 3, padding:"3px 2px", backgroundColor:'#243954 !important', color:'#72aee8', fontWeight:'bold' }}
                                    variant='contained'
                                    onClick={approve}
                                >
                                    {`APPROVE POS${level}`}
                                </Button>
                                :""
                            }
                            <Button
                                variant='contained'
                                className='card-modal-button-a'
                                sx={{ mr: 3, padding:"3px 2px", backgroundColor:'#243954 !important', color:'#72aee8', fontWeight:'bold' }}
                                onClick={handleClosee}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>    

        </Box>
    )
}

export default memo(P2pSwapCard)

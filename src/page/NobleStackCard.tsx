import { memo, useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SocietyCoinABI from "../abis/NeonTigerSociety.json";
import StackLv1NoblestackABI from "../abis/StackLv1NobleStacks.json";
import LV1NobleStackABI from "../abis/Lv1NobleStack.json";
import { Interface } from "@ethersproject/abi";
import { Contract } from "@ethersproject/contracts";

import {
  SocietyCoinContract,
  SocietyNobleContract,
  StackLv1Noblestack,
  StackLv2Noblestack,
  StackLv3Noblestack,
  StackLv4Noblestack,
  LV1NobleStack,
  LV2NobleStack,
  LV3NobleStack,
  LV4NobleStack,
} from "../global/constants";

import { BIG_ZERO } from "../global/constants";

import "./card.scss";
import { getProviderOrSigner, useNoWalletContract } from "../hooks/useContract";
import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import { toast } from "react-toastify";

import { QrReader } from "react-qr-reader";
import QrCodeIcon from "@mui/icons-material/QrCode";
import CloseIcon from "@mui/icons-material/Close";
import CameraIcon from "@mui/icons-material/Camera";
import { Grid } from "@mui/material";

const NobleStackCard = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#0b1324",
    border: "1px solid #0b1324",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
  };

  const styleb = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#0b1324",
    border: "1px solid #0b1324",
    borderRadius: "10px",
    boxShadow: 24,
    pl: 4,
    pr: 4,
    pt: 10,
    pb: 10,
  };

  const { account, library } = useEthers();
  const societyContract: any = useNoWalletContract(
    SocietyCoinABI.abi,
    SocietyCoinContract
  );
  const nobleContract: any = useNoWalletContract(
    SocietyCoinABI.abi,
    SocietyNobleContract
  );
  const [stackAddress, setStackAddress] = useState(StackLv1Noblestack);
  const [posAddress, setPosAddress] = useState(LV1NobleStack);
  const [ratio, setRatio] = useState("19:1");
  const [level, setLevel] = useState(1);
  const [balance, setBalance] = useState<any>(BIG_ZERO);
  const [approved, setApproved] = useState(false);
  const [approvedNoble, setApprovedNoble] = useState(false);
  const [approvedPos, setApprovedPos] = useState(false);

  const copycontract = "./img/copycontract.png";

  const [opena, setOpena] = useState(false);
  const [claimAddress, setClaimAddress] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const handleOpena = () => setOpena(true);
  const handleClosea = () => setOpena(false);
  const [showQrScan, setShowQrScan] = useState(false);
  const openQrScanner = () => {
    setClaimAddress("");
    setShowQrScan(true);
  };
  const closeQrScanner = () => setShowQrScan(false);
  const [camera, setCamera] = useState("environment");
  const switchCamera = () => {
    if (camera == "environment") {
      setCamera("user");
    } else {
      setCamera("environment");
    }
    setShowQrScan(false);
  };

  const [openb, setOpenb] = useState(false);
  const handleOpenb = () => setOpenb(true);
  const handleCloseb = () => setOpenb(false);

  const [openc, setOpenc] = useState(false);
  const handleOpenc = () => setOpenc(true);
  const handleClosec = () => setOpenc(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(posAddress);
    toast.success("Copied", {
      position: toast.POSITION.BOTTOM_RIGHT,
      hideProgressBar: true,
    });
  };

  const setLevelDetail = (lvl: any) => {
    if (lvl == 1) {
      setLevel(1);
      setRatio("19:1");
      setStackAddress(StackLv1Noblestack);
      setPosAddress(LV1NobleStack);
    } else if (lvl == 2) {
      setLevel(2);
      setRatio("19:2");
      setStackAddress(StackLv2Noblestack);
      setPosAddress(LV2NobleStack);
    } else if (lvl == 3) {
      setLevel(3);
      setRatio("19:3");
      setStackAddress(StackLv3Noblestack);
      setPosAddress(LV3NobleStack);
    } else if (lvl == 4) {
      setLevel(4);
      setRatio("19:4");
      setStackAddress(StackLv4Noblestack);
      setPosAddress(LV4NobleStack);
    }
  };

  const showError = (error: any) => {
    if (error.error) {
      toast.error(
        error.error.data.message.split("execution reverted: ").join(""),
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          hideProgressBar: true,
        }
      );
    } else {
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
      });
    }
  };

  const approve = async () => {
    try {
      await societyContract
        .approve(stackAddress, ethers.constants.MaxUint256)
        .then((tx: any) => {
          tx.wait().then((res: any) => {
            setApproved(true);
            setClaimAmount("");
            toast.success("Approve successful", {
              position: toast.POSITION.BOTTOM_RIGHT,
              hideProgressBar: true,
            });
          });
        });
    } catch (error) {
      showError(error);
    }
  };

  const approveNoble = async () => {
    try {
      console.log("approve noble");
      await nobleContract
        .approve(stackAddress, ethers.constants.MaxUint256)
        .then((tx: any) => {
          tx.wait().then((res: any) => {
            setApprovedNoble(true);
            setClaimAmount("");
            toast.success("Approve successful", {
              position: toast.POSITION.BOTTOM_RIGHT,
              hideProgressBar: true,
            });
          });
        });
    } catch (error) {
      showError(error);
    }
  };

  const approvePos = async () => {
    try {
      console.log("approve pos");
      const posContract = new Contract(
        posAddress,
        new Interface(LV1NobleStackABI.abi),
        getProviderOrSigner(library, account)
      );
      await posContract
        .approve(stackAddress, ethers.constants.MaxUint256)
        .then((tx: any) => {
          tx.wait().then((res: any) => {
            setApprovedPos(true);
            setClaimAmount("");
            toast.success("Approve successful", {
              position: toast.POSITION.BOTTOM_RIGHT,
              hideProgressBar: true,
            });
          });
        });
    } catch (error) {
      showError(error);
    }
  };

  const stake = async () => {
    try {
      const stackContract = new Contract(
        stackAddress,
        new Interface(StackLv1NoblestackABI.abi),
        getProviderOrSigner(library, account)
      );
      await stackContract
        .stake(ethers.utils.parseEther(claimAmount))
        .then((tx: any) => {
          tx.wait().then((responce: any) => {
            setClaimAmount("");
            handleClosea();
            toast.success("Stake successful", {
              position: toast.POSITION.BOTTOM_RIGHT,
              hideProgressBar: true,
            });
          });
        });
    } catch (error) {
      showError(error);
    }
  };

  const claimStake = async () => {
    try {
      const stackContract = new Contract(
        stackAddress,
        new Interface(StackLv1NoblestackABI.abi),
        getProviderOrSigner(library, account)
      );
      await stackContract
        .withdraw(ethers.utils.parseEther(claimAmount))
        .then((tx: any) => {
          tx.wait().then((response: any) => {
            setClaimAmount("");
            handleCloseb();
            toast.success("Stake Claimed", {
              position: toast.POSITION.BOTTOM_RIGHT,
              hideProgressBar: true,
            });
          });
        });
    } catch (error) {
      showError(error);
    }
  };

  const transfer = async () => {
    try {
      const posContract = new Contract(
        posAddress,
        new Interface(LV1NobleStackABI.abi),
        getProviderOrSigner(library, account)
      );
      if (!claimAddress) throw "No claim address defined";
      if (!claimAmount) throw "No amount entered to trnasfer";
      await posContract
        .transfer(claimAddress, ethers.utils.parseEther(claimAmount))
        .then((tx: any) => {
          tx.wait().then((response: any) => {
            toast.success("Transfer successful", {
              position: toast.POSITION.BOTTOM_RIGHT,
              hideProgressBar: true,
            });
          });
        });
    } catch (error) {
      showError(error);
    }
  };

  const checkApproved = async () => {
    try {
      let allowance = await societyContract.allowance(account, stackAddress);
      let amount = ethers.utils.parseEther(claimAmount);
      if (Number(allowance) >= Number(amount)) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkApprovedNoble = async () => {
    try {
      let allowance = await nobleContract.allowance(account, stackAddress);
      let amount = ethers.utils.parseEther(claimAmount);
      if (Number(allowance) >= Number(amount)) {
        setApprovedNoble(true);
      } else {
        setApprovedNoble(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkApprovedLV1NobleStack = async () => {
    try {
      const posContract = new Contract(
        posAddress,
        new Interface(LV1NobleStackABI.abi),
        getProviderOrSigner(library, account)
      );
      let allowance = await posContract.allowance(account, stackAddress);
      let amount = ethers.utils.parseEther(claimAmount);
      if (Number(allowance) >= Number(amount)) {
        setApprovedPos(true);
      } else {
        setApprovedPos(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkBalance = async () => {
    try {
      const posContract = new Contract(
        posAddress,
        new Interface(LV1NobleStackABI.abi),
        getProviderOrSigner(library, account)
      );
      if (account) {
        const blnc = await posContract.balanceOf(account);
        setBalance(Number(blnc) / 1e18);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkApproved();
    checkApprovedNoble();
    checkApprovedLV1NobleStack();
  }, [claimAmount, account]);

  useEffect(() => {
    checkBalance();
  }, [account, level]);

  return (
    <Box
      style={{
        borderRadius: "10px",
        backgroundColor: "#0b1324",
        padding: "10px 20px",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={2}
          style={{
            borderBottom: "solid 1px rgb(80 80 80)",
            paddingBottom: "5px",
          }}
        >
          <Grid item xs={2}>
            <p style={{ color: "#ffffff", textAlign: "left" }}>Nobility:</p>
          </Grid>
          <Grid item xs={2}>
            <p className="level-text-align" style={{ color: "#ffffff" }}>
              <span
                style={{
                  width: "100%",
                  cursor: "pointer",
                  display: "inline-block",
                }}
                onClick={() => setLevelDetail(1)}
                className={level == 1 ? "level-active" : ""}
              >
                LV1
              </span>
            </p>
          </Grid>
          <Grid item xs={2}>
            <p className="level-text-align" style={{ color: "#ffffff" }}>
              <span
                style={{
                  width: "100%",
                  cursor: "pointer",
                  display: "inline-block",
                }}
                onClick={() => setLevelDetail(2)}
                className={level == 2 ? "level-active" : ""}
              >
                LV2
              </span>
            </p>
          </Grid>
          <Grid item xs={2}>
            <p className="level-text-align" style={{ color: "#ffffff" }}>
              <span
                style={{
                  width: "100%",
                  cursor: "pointer",
                  display: "inline-block",
                }}
                onClick={() => setLevelDetail(3)}
                className={level == 3 ? "level-active" : ""}
              >
                LV3
              </span>
            </p>
          </Grid>
          <Grid item xs={2}>
            <p className="level-text-align" style={{ color: "#ffffff" }}>
              <span
                style={{
                  width: "100%",
                  cursor: "pointer",
                  display: "inline-block",
                }}
                onClick={() => setLevelDetail(4)}
                className={level == 4 ? "level-active" : ""}
              >
                LV4
              </span>
            </p>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item sm={2} xs={3} sx={{ marginTop: "5px" }}>
            <img
              className="coin-img"
              src={`./img/lv${level}.png`}
              alt="imgs"
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item sm={10} xs={9}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={1} className="margin-top-device">
                <Grid item xs={8}>
                  <p
                    style={{
                      color: "#ffffff",
                      fontSize: "1.5em",
                      letterSpacing: "0.1em",
                    }}
                    className="card-title"
                  >
                    {`${level} Noble Stack`}{" "}
                    {copycontract && (
                      <img
                        className="coin-number-contract"
                        src={copycontract}
                        onClick={() => {
                          copyAddress();
                        }}
                      />
                    )}
                  </p>
                </Grid>
                <Grid item xs={4}>
                  <p
                    style={{
                      color: "#ffffff",
                      fontSize: "1.5em",
                      letterSpacing: "0.1em",
                      textAlign: "right",
                    }}
                    className="card-title"
                  >
                    <span>{Number(balance).toFixed(4)}</span>{" "}
                    <img
                      className="coin-number-symbol"
                      src="./img/symbol.png"
                    />{" "}
                  </p>
                </Grid>
              </Grid>
              <Grid container spacing={1} className="margin-top-device">
                <Grid item xs={12}>
                  <p
                    style={{
                      fontSize: "1.3em",
                      letterSpacing: "0.1em",
                      color: "#7f95be",
                    }}
                    className="card-sub-title"
                  >
                    {`STACK SOCIETY COIN & SOCIETY NOBLES ${ratio}`}
                  </p>
                </Grid>
              </Grid>
              <Grid container spacing={1} className="margin-top-device">
                <Grid item xs={4}>
                  <button
                    className="coin-button-receive"
                    onClick={handleOpena}
                    style={{ backgroundColor: "#2f8af5", color: "#ffffff" }}
                  >
                    {"STACK"}
                  </button>
                </Grid>
                <Grid item xs={4}>
                  <button
                    className="coin-button-receive"
                    onClick={handleOpenb}
                    style={{ backgroundColor: "#2f8af5", color: "#ffffff" }}
                  >
                    {"UNSTACK"}
                  </button>
                </Grid>
                <Grid item xs={4}>
                  <button onClick={handleOpenc} className="coin-button-gift">
                    SEND
                    <img
                      className="coin-number-symbol"
                      src="./img/symbol_blue.png"
                    />
                    {/* &nbsp;STACK */}
                  </button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={opena}
        onClose={handleClosea}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={opena}>
          <Box sx={style} className="give-modal">
            <p className ="stake-title"
            >
              STACK LV{level} NOBLE STACK
            </p>

            {!approved ? (
              <Button
                className="card-modal-button-approve"
                sx={{
                  mr: 2,
                  padding: "6px 13px 4px 10px",
                  backgroundColor: "#243954 !important",
                  color: "#72aee8",
                  fontWeight: "bold",
                }}
                variant="contained"
                onClick={approve}
              >
                <p className="circle"> 1 </p>
                <p className="card-modal-button-approve-text">APPROVE SCTY</p>
              </Button>
            ) : (
              ""
            )}
            {!approvedNoble ? (
              <Button
                className="card-modal-button-approve-noble"
                sx={{
                  mr: 2,
                  padding: "6px 13px 4px 10px",
                  backgroundColor: "#243954 !important",
                  color: "#72aee8",
                  fontWeight: "bold",
                }}
                variant="contained"
                onClick={approveNoble}
              >
                <p className="circle"> 2 </p>
                <p className="card-modal-button-approve-text">APPROVE NOBLE</p>
              </Button>
            ) : (
              ""
            )}

            <Box
              sx={{
                width: 500,
                maxWidth: "100%",
              }}
            >
              <TextField
                fullWidth
                label="STACK AMOUNT"
                id="claim"
                sx={{ mb: 5, mt: 2 }}
                style={{
                  backgroundColor: "#eee",
                  borderRadius: "5px",
                }}
                value={claimAmount}
                InputLabelProps={{
                  style: { paddingTop: '10px' },
                }}
                onChange={(e) => setClaimAmount(e.target.value)}
              />
            </Box>
            <Box>
              {approved && approvedNoble ? (
                <Button
                  className="card-modal-button"
                  sx={{
                    mr: 3,
                    padding: "6px 13px 4px 10px",
                    backgroundColor: "#2f8af5 !important",
                    color: "#ffffff",
                    fontWeight: "bold",
                  }}
                  variant="contained"
                  onClick={stake}
                >
              Stack
                </Button>
              ) : (
                ""
              )}

              <Button
                variant="contained"
                className="card-modal-button-a"
                sx={{
                  mr: 2,
                  padding: "6px 13px 4px 10px",
                  backgroundColor: "#243954 !important",
                  color: "#72aee8",
                  fontWeight: "bold",
                }}
                onClick={handleClosea}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openb}
        onClose={handleCloseb}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openb}>
          <Box sx={style} className="give-modal">
            <p
              style={{
                fontSize: "20px",
                color: "#d0d1d5",
                letterSpacing: "0.2em",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
              }}
            >
              UNSTACK
            </p>

            <Box
              sx={{
                width: 500,
                maxWidth: "100%",
              }}
            >
              <TextField
                fullWidth
                label="UNSTACK AMOUNT"
                id="claim"
                sx={{ mb: 5, mt: 2 }}
                style={{
                  backgroundColor: "#eee",
                  borderRadius: "5px",
                }}
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
              />
            </Box>
            <Box>
              {approvedPos && (
                <Button
                  className="card-modal-button"
                  sx={{
                    mr: 3,
                    backgroundColor: "#2f8af5 !important",
                    color: "#ffffff",
                    fontWeight: "bold",
                  }}
                  variant="contained"
                  onClick={claimStake}
                >
                  {`Unstack Lv${level}NSt`}
                </Button>
              )}

              {!approvedPos && (
                <Button
                  className="card-modal-button"
                  sx={{
                    mr: 3,
                    backgroundColor: "#243954 !important",
                    color: "#72aee8",
                    fontWeight: "bold",
                  }}
                  variant="contained"
                  onClick={approvePos}
                >
                  {`APPROVE Lv${level}NSt`}
                </Button>
              )}

              <Button
                variant="contained"
                className="card-modal-button-a"
                onClick={handleCloseb}
                sx={{
                  backgroundColor: "#243954 !important",
                  color: "#72aee8",
                  fontWeight: "bold",
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openc}
        onClose={handleClosec}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openc}>
          <Box sx={style} className="give-modal">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  fontSize: "20px",
                  color: "#d0d1d5",
                  letterSpacing: "0.2em",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                SEND
                <img
                  style={{
                    width: "11px",
                    height: "20px",
                    margin: "0px 6px",
                  }}
                  src="./img/symbol.png"
                />
              </p>
              <TextField
                className="give-modal-amount"
                fullWidth
                label="ADD AMOUNT FIELD"
                id="amount"
                sx={{ ml: 5 }}
                style={{
                  backgroundColor: "#eee",
                  borderRadius: "3px",
                }}
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
              />
            </Box>

            <Box
              sx={{
                width: 500,
                maxWidth: "100%",
              }}
            >
              <TextField
                fullWidth
                label="RECIPIENT ADDRESS"
                id="claim"
                sx={{ mb: 5, mt: 2, width: "100%" }}
                style={{
                  backgroundColor: "#eee",
                  borderRadius: "5px",
                }}
                value={claimAddress}
                onChange={(e) => setClaimAddress(e.target.value)}
              />
              <QrCodeIcon
                onClick={openQrScanner}
                style={{
                  position: "absolute",
                  right: "32px",
                  top: "110px",
                  cursor: "pointer",
                }}
              />
            </Box>
            <Box>
              <Button
                className="card-modal-button"
                sx={{ mr: 3 }}
                variant="contained"
                onClick={transfer}
              >
                Confirm
              </Button>
              <Button
                variant="contained"
                className="card-modal-button-a"
                onClick={handleClosec}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      {showQrScan ? (
        <Box
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // backgroundColor:'#fff',
            zIndex: 999999,
            width: "50%",
          }}
        >
          <CloseIcon
            onClick={closeQrScanner}
            style={{
              color: "#fff",
              cursor: "pointer",
              position: "absolute",
              zIndex: 1,
              right: 0,
              width: "27px",
            }}
          />
          <CameraIcon
            onClick={switchCamera}
            style={{
              color: "#fff",
              cursor: "pointer",
              position: "absolute",
              zIndex: 1,
              left: 0,
              width: "27px",
            }}
          />
          <QrReader
            constraints={{ facingMode: camera }}
            onResult={(result, error) => {
              if (!!result) {
                setClaimAddress(
                  result.getText().replace("ethereum:", "").slice(0, 42)
                );
                closeQrScanner();
              }

              if (!!error) {
                console.info(error);
              }
            }}
          />
        </Box>
      ) : (
        ""
      )}
    </Box>
  );
};

export default memo(NobleStackCard);

import { Interface } from '@ethersproject/abi'
import { Contract } from '@ethersproject/contracts'
import {
    SocietyNobleContract,
    SocietyCoinContract,
    SocietyKeyContract,
} from '../global/constants'
import { useCall, useContractFunction } from '@usedapp/core'
import { BigNumber } from '@ethersproject/bignumber'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import { getAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";

import SocietyNoble from '../global/SocietyNoble.json'
import SocietyCoin from '../global/SocietyCoin.json'
import SocietyKey from '../global/SocietyKey.json'
import { useMemo } from "react";
// import { getContract } from "utils";

const SocietyNobleABI = new Interface(SocietyNoble)
const SocietyCoinABI = new Interface(SocietyCoin)
const SocietyKeyABI = new Interface(SocietyKey)
const contractSN = new Contract(SocietyNobleContract, SocietyNobleABI)
const contractSC = new Contract(SocietyCoinContract, SocietyCoinABI)
const contractSK = new Contract(SocietyKeyContract, SocietyKeyABI)


export function getSigner(library: any, account: any) {
    return library.getSigner(account).connectUnchecked();
}

  // account is optional
export function getProviderOrSigner(library: any, account: any | undefined) {
    return account ? getSigner(library, account) : library;
}

function getContract(address: any, ABI: any, library: any, account = "") {
    if (!isAddress(address) || address === AddressZero) {
        throw Error(`Invalid 'address' parameter '${address}'.`);
    }

    return new Contract(address, ABI, getProviderOrSigner(library, account));
}


function isAddress(value: any ) {
    try {
        return getAddress(value);
    } catch {
        return false;
    }
}

function useRcpProviderContract(abi: any, address: any){
    const { account, library } = useEthers();

    return useMemo(() => {
        if(!abi || !address ) return null;

        try {
            const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_NODE_1);
            return getContract(address, abi, library?library:provider, account?account:undefined);
        } catch (error) {
            console.log('contract init', error);
        }
    },[abi, address, account]);
}

export function useNoWalletContract(abi: any, address: any){
    return useRcpProviderContract(abi, address);
}

export function useClaimSocietyNoble() {
    const { send, state } = useContractFunction(contractSN, 'claim')
    return {
        claimSocietyNobleState: state,
        claimSocietyNoble: send,
    }
}

export function useSendSocietyNoble() {
    const { send, state } = useContractFunction(contractSN, 'transfer')
    return {
        sendSocietyNobleState: state,
        sendSocietyNoble: send,
    }
}

export function useClaimSocietyCoin() {
    const { send, state } = useContractFunction(contractSC, 'claim')
    return {
        claimSocietyCoinState: state,
        claimSocietyCoin: send,
    }
}

export function useSendSocietyCoin() {
    const { send, state } = useContractFunction(contractSC, 'transfer')
    return {
        sendSocietyCoinState: state,
        sendSocietyCoin: send,
    }
}

export function useClaimSocietyKey() {
    const { send, state } = useContractFunction(contractSK, 'claim')
    return {
        claimSocietyKeyState: state,
        claimSocietyKey: send,
    }
}

export function useSendSocietyKey() {
    const { send, state } = useContractFunction(contractSK, 'transfer')
    return {
        sendSocietyKeyState: state,
        sendSocietyKey: send,
    }
}

export function useSocietyNobleBalance(address: string | undefined):BigNumber {
    const { value } =
        useCall(
            address && {
                contract: contractSN,
                method: 'balanceOf',
                args: [address],
            },
        ) ?? {}
    return value?.[0]
}

export function useSocietyCoinBalance(address: string | undefined):BigNumber {
    const { value } =
        useCall(
            address && {
                contract: contractSC,
                method: 'balanceOf',
                args: [address],
            },
        ) ?? {}
    return value?.[0]
}

export function useSocietyKeyBalance(address: string | undefined):BigNumber {
    const { value } =
        useCall(
            address && {
                contract: contractSK,
                method: 'balanceOf',
                args: [address],
            },
        ) ?? {}
    return value?.[0]
}

export function useSocietyNobleGift(address: string | undefined):BigNumber {
    const { value } =
        useCall(
            address && {
                contract: contractSN,
                method: 'calculate',
                args: [address],
            },
        ) ?? {}
    return value?.[0]
}

export function useSocietyCoinGift(address: string | undefined):BigNumber {
    const { value } =
        useCall(
            address && {
                contract: contractSC,
                method: 'calculate',
                args: [address],
            },
        ) ?? {}
    return value?.[0]
}

export function useSocietyKeyGift(address: string | undefined):BigNumber {
    const { value } =
        useCall(
            address && {
                contract: contractSK,
                method: 'calculate',
                args: [address],
            },
        ) ?? {}
    return value?.[0]
}

import { Interface } from '@ethersproject/abi'
import { Contract } from '@ethersproject/contracts'
import { useEthers } from '@usedapp/core'
import { BigNumber } from '@ethersproject/bignumber'

import SocietyNoble from '../global/SocietyNoble.json'
import SocietyCoin from '../global/SocietyCoin.json'
import SocietyKey from '../global/SocietyKey.json'
import {
    SocietyNobleContract,
    SocietyCoinContract,
    SocietyKeyContract,
} from '../global/constants'

export default function useEstimateGas() {
    const SocietyNobleABI = new Interface(SocietyNoble)
    const SocietyCoinABI = new Interface(SocietyCoin)
    const SocietyKeyABI = new Interface(SocietyKey)
    const { library } = useEthers()

    const claimSocietyNobleGas = async (address: string | undefined) => {
        const contract = new Contract(
            SocietyNobleContract,
            SocietyNobleABI,
            library?.getSigner(),
        )
        const estimatedGas = await contract.estimateGas.claim(address)

        return estimatedGas
    }

    const claimSocietyCoinGas = async (address: string | undefined) => {
        const contract = new Contract(
            SocietyCoinContract,
            SocietyCoinABI,
            library?.getSigner(),
        )
        const estimatedGas = await contract.estimateGas.claim(address)

        return estimatedGas
    }

    const claimSocietyKeyGas = async (address: string | undefined) => {
        const contract = new Contract(
            SocietyKeyContract,
            SocietyKeyABI,
            library?.getSigner(),
        )
        const estimatedGas = await contract.estimateGas.claim(address)

        return estimatedGas
    }

    const sendSocietyKeyGas = async (
        address: string | undefined,
        amount: BigNumber | undefined,
    ) => {
        const contract = new Contract(
            SocietyKeyContract,
            SocietyKeyABI,
            library?.getSigner(),
        )
        const estimatedGas = await contract.estimateGas.transfer(
            address,
            amount,
        )
        const gasPrice = await library?.getGasPrice()

        return { estimatedGas, gasPrice }
    }

    const sendSocietyCoinGas = async (
        address: string | undefined,
        amount: BigNumber | undefined,
    ) => {
        const contract = new Contract(
            SocietyCoinContract,
            SocietyCoinABI,
            library?.getSigner(),
        )
        const estimatedGas = await contract.estimateGas.transfer(
            address,
            amount,
        )
        const gasPrice = await library?.getGasPrice()

        return { estimatedGas, gasPrice }
    }

    const sendSocietyNobleGas = async (
        address: string | undefined,
        amount: BigNumber | undefined,
    ) => {
        const contract = new Contract(
            SocietyNobleContract,
            SocietyNobleABI,
            library?.getSigner(),
        )
        const estimatedGas = await contract.estimateGas.transfer(
            address,
            amount,
        )
        const gasPrice = await library?.getGasPrice()

        return { estimatedGas, gasPrice }
    }

    return {
        claimSocietyNobleGas,
        claimSocietyCoinGas,
        claimSocietyKeyGas,
        sendSocietyKeyGas,
        sendSocietyCoinGas,
        sendSocietyNobleGas
    }
}

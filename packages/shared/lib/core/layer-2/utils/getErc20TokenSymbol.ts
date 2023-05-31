/* eslint-disable no-console */

import { get } from 'svelte/store'

import { network } from '@core/network/stores'

import { ContractType } from '../enums'

export async function getErc20TokenSymbol(tokenAddress: string, chainId: number): Promise<string | undefined> {
    const chain = get(network)?.getChain(chainId)
    const contract = chain?.getContract(ContractType.Erc20, tokenAddress)
    if (contract) {
        const symbol = await contract.methods.symbol().call()
        return symbol
    }
}

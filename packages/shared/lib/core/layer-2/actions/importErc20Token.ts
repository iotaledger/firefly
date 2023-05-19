/* eslint-disable no-console */

import { get } from 'svelte/store'

import { selectedAccount } from '@core/account/stores'
import { network } from '@core/network/stores'

import { ERC20_ABI } from '../abis'

export async function importErc20Token(tokenAddress: string, chainId: number): Promise<void> {
    const chain = get(network)?.getChain(chainId)
    const provider = chain?.getProvider()
    if (provider) {
        const contract = new provider.eth.Contract(ERC20_ABI, tokenAddress)

        // TODO: Extract into separate function later
        const name = await contract.methods.name().call()
        const symbol = await contract.methods.symbol().call()
        const decimals = await contract.methods.decimals().call()
        console.log('METADATA: ', name, symbol, decimals)

        // TODO: Extract into separate function later
        // TODO: Get for all accounts
        const coinType = chain?.getConfiguration().coinType
        const selectedAccountAddress =
            get(selectedAccount)?.evmAddresses[coinType] ?? '0xA88107749C850Df5A4BbbD2197889dF90103dd06'
        const rawBalance = await contract.methods.balanceOf(selectedAccountAddress).call()
        console.log('RAW BALANCE: ', rawBalance)
        const adjustedBalance = rawBalance / Math.pow(10, decimals)
        const formattedBalance = `${adjustedBalance} ${symbol}`
        console.log('FORMATTED BALANCE: ', formattedBalance)
    }
}

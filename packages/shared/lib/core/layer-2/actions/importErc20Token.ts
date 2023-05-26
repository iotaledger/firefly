/* eslint-disable no-console */

import { get } from 'svelte/store'

import { selectedAccount } from '@core/account/stores'
import { network } from '@core/network/stores'

import { ContractType } from '../enums'
import { IAsset, TokenStandard, NotVerifiedStatus } from '@core/wallet'

export async function importErc20Token(tokenAddress: string, chainId: number): Promise<IAsset | undefined> {
    const chain = get(network)?.getChain(chainId)
    const contract = chain?.getContract(ContractType.Erc20, tokenAddress)
    if (contract) {
        // TODO: Extract into separate function later
        const name = await contract.methods.name().call()
        const symbol = await contract.methods.symbol().call()
        const decimals = await contract.methods.decimals().call()
        // TODO: Extract into separate function later
        // TODO: Get for all accounts
        const coinType = chain?.getConfiguration().coinType
        if (coinType) {
            const selectedAccountAddress = get(selectedAccount)?.evmAddresses[coinType]
            const rawBalance = await contract.methods.balanceOf(selectedAccountAddress).call()

            const token: IAsset = {
                id: tokenAddress,
                standard: TokenStandard.Erc20,
                metadata: {
                    standard: TokenStandard.Erc20,
                    name,
                    symbol,
                    decimals,
                },
                balance: {
                    total: rawBalance,
                },
                verification: {
                    verified: false,
                    status: NotVerifiedStatus.New,
                },
                hidden: false,
            }

            return token
        }
    }
}

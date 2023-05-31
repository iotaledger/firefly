/* eslint-disable no-console */

import { get } from 'svelte/store'

import { selectedAccount } from '@core/account/stores'
import { network } from '@core/network/stores'

import { ContractType } from '../enums'
import { IAsset, TokenStandard, NotVerifiedStatus } from '@core/wallet'
import { getContractTokenMetadata } from '../utils'

export async function importErc20Token(tokenAddress: string, chainId: number): Promise<IAsset | undefined> {
    const chain = get(network)?.getChain(chainId)
    const contract = chain?.getContract(ContractType.Erc20, tokenAddress)
    if (contract) {
        // TODO: Extract into separate function later
        const contractTokenMetadata = await getContractTokenMetadata(contract)
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
                    ...contractTokenMetadata,
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

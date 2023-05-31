import { importErc20Token } from './importErc20Token'

import { get } from 'svelte/store'

import { selectedAccount, selectedAccountIndex } from '@core/account'
import { network } from '@core/network'
import { AccountAssets, IAccountAssetsPerNetwork, accountsLayer2Assets } from '@core/wallet'

const DEFAULT_ACCOUNT_ASSETS: IAccountAssetsPerNetwork = {
    baseCoin: undefined,
    nativeTokens: [],
}

export async function getAndUpdateSelectedAccountLayer2Tokens(): Promise<void> {
    const chains = get(network)?.getChains() ?? []
    const selectedAccountErc20Tokens: AccountAssets = {}

    for (const chain of chains) {
        const chainId = chain.getConfiguration().chainId
        const trackedTokens = get(selectedAccount)?.trackedTokens?.[chainId] ?? []

        const tokensPerChain = await getTokensPerChain(trackedTokens, chainId)

        selectedAccountErc20Tokens[chainId] = tokensPerChain
    }

    const accountId = get(selectedAccountIndex)
    updateAccountLayer2Tokens(accountId, selectedAccountErc20Tokens)
}

async function getTokensPerChain(trackedTokens: string[], chainId: number): Promise<IAccountAssetsPerNetwork> {
    const tokensPerChain: IAccountAssetsPerNetwork = { ...DEFAULT_ACCOUNT_ASSETS }

    for (const tokenAddress of trackedTokens) {
        const erc20token = await importErc20Token(tokenAddress, chainId)
        if (erc20token) {
            tokensPerChain.nativeTokens.push(erc20token)
        }
    }

    return tokensPerChain
}

function updateAccountLayer2Tokens(accountId: number, accountAssets: AccountAssets): void {
    if (accountId === undefined || accountId === null) {
        return
    }

    accountsLayer2Assets.update(($accountsLayer2Assets) => {
        const updatedAssets = { ...$accountsLayer2Assets }

        for (const chainId of Object.keys(accountAssets)) {
            updatedAssets[accountId] = updateAssetsPerChain(updatedAssets[accountId], accountAssets[chainId], chainId)
        }

        return updatedAssets
    })
}

function updateAssetsPerChain(
    selectedAccountLayer2Assets: AccountAssets,
    incomingAssets: IAccountAssetsPerNetwork,
    chainId: string
): AccountAssets {
    const selectedAccountLayer2AssetsPerChain = selectedAccountLayer2Assets?.[chainId] ?? { ...DEFAULT_ACCOUNT_ASSETS }
    const selectedAccountLayer2NativeTokensPerChain = selectedAccountLayer2AssetsPerChain.nativeTokens ?? []

    const incomingIds = new Set(incomingAssets.nativeTokens.map((token) => token.id))
    const updatedNativeTokens = [
        ...selectedAccountLayer2NativeTokensPerChain.filter((asset) => !incomingIds.has(asset.id)),
        ...incomingAssets.nativeTokens,
    ]

    return {
        ...selectedAccountLayer2Assets,
        [chainId]: {
            baseCoin: undefined,
            nativeTokens: updatedNativeTokens,
        },
    }
}

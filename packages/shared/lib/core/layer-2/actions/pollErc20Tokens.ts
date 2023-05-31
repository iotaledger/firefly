import { network } from '@core/network/stores'
import { get } from 'svelte/store'
import { LAYER2_NATIVE_ASSETS_POLL_INTERVAL } from '../constants'
import { IAccountAssetsPerNetwork } from '@core/wallet/interfaces'
import { selectedAccountIndex, selectedAccount } from '@core/account/stores'
import { importErc20Token } from '../actions'
import { AccountAssets } from '@core/wallet/interfaces'
import { accountsLayer2Assets } from '@core/wallet/stores'

let pollInterval: number

export function pollErc20Tokens(): void {
    clearErc20TokensPoll()
    void getAndUpdateSelectedAccountLayer2Tokens()
    pollInterval = window.setInterval(() => {
        void getAndUpdateSelectedAccountLayer2Tokens()
    }, LAYER2_NATIVE_ASSETS_POLL_INTERVAL)
}

export function clearErc20TokensPoll(): void {
    clearInterval(pollInterval)
}

async function getAndUpdateSelectedAccountLayer2Tokens(): Promise<void> {
    const chains = get(network)?.getChains() ?? []
    const selectedAccountErc20Tokens: AccountAssets = {}

    for (const chain of chains) {
        const chainId = chain.getConfiguration().chainId
        const selectedAccountErc20TokensPerChain: IAccountAssetsPerNetwork = {
            baseCoin: undefined,
            nativeTokens: [],
        }
        const trackedTokens = get(selectedAccount)?.trackedTokens?.[chainId] ?? []
        for (const tokenAddress of trackedTokens) {
            const erc20token = await importErc20Token(tokenAddress, chainId)
            if (erc20token) {
                selectedAccountErc20TokensPerChain.nativeTokens.push(erc20token)
            }
        }
        selectedAccountErc20Tokens[chainId] = selectedAccountErc20TokensPerChain
    }
    updateAccountLayer2Tokens(get(selectedAccountIndex), selectedAccountErc20Tokens)
}

function updateAccountLayer2Tokens(accountId: number, accountAssets: AccountAssets): void {
    if (accountId === undefined || accountId === null) {
        return
    }
    accountsLayer2Assets.update(($accountsLayer2Assets) => {
        const selectedAccountLayer2Assets = $accountsLayer2Assets[accountId] ?? {}
        for (const chainId of Object.keys(accountAssets)) {
            const selectedAccountLayer2AssetsPerChain = selectedAccountLayer2Assets[chainId] ?? {
                baseCoin: undefined,
                nativeTokens: [],
            }
            let selectedAccountLayer2NativeTokensPerChain = selectedAccountLayer2AssetsPerChain.nativeTokens ?? []
            const incomingIds = new Set(accountAssets[chainId]?.nativeTokens.map((d) => d.id))
            selectedAccountLayer2NativeTokensPerChain = [
                ...selectedAccountLayer2NativeTokensPerChain.filter((asset) => !incomingIds.has(asset.id)),
                ...accountAssets[chainId].nativeTokens,
            ]
            selectedAccountLayer2Assets[chainId] = {
                baseCoin: undefined,
                nativeTokens: selectedAccountLayer2NativeTokensPerChain,
            }
        }
        return { ...$accountsLayer2Assets, [accountId]: selectedAccountLayer2Assets }
    })
}

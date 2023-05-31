import { get, writable } from 'svelte/store'

// TODO: extract
interface IL2Balances {
    [accountIndex: number]: IL2AccountBalance | undefined
}

interface IL2AccountBalance {
    [chainId: number]: {
        [tokenId: string]: number
    }
}

export const layer2Balances = writable<IL2Balances | undefined>(undefined)

export function getL2BalancesForAccount(accountIndex: number): IL2AccountBalance | undefined {
    return get(layer2Balances)?.[accountIndex]
}

export function setL2BalancesForAccountForChain(
    accountIndex: number,
    chainId: number,
    chainBalance: { [tokenId: string]: number }
): void {
    layer2Balances.update((balance) => {
        if (!balance) {
            balance = {}
        }
        if (!balance[accountIndex]) {
            balance[accountIndex] = {}
        }
        balance[accountIndex] = { ...balance[accountIndex], [chainId]: chainBalance }
        return balance
    })
}

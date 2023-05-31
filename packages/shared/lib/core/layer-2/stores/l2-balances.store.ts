import { get, writable } from 'svelte/store'

interface IL2Balances {
    [accountIndex: number]: IL2AccountBalance | undefined
}

interface IL2AccountBalance {
    [chainId: number]: {
        [tokenId: string]: number
    }
}

export const l2Balances = writable<IL2Balances | undefined>(undefined)

export function getL2BalancesForAccount(accountIndex: number): IL2AccountBalance | undefined {
    return get(l2Balances)?.[accountIndex]
}

export function setL2BalancesForAccountForChain(
    accountIndex: number,
    chainId: number,
    chainBalance: { [tokenId: string]: number }
): void {
    l2Balances.update((balance) => {
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

import { IAccount, IAccountState } from '@core/account'
import { activeAccounts, activeProfile, IBalanceOverview } from '@core/profile'
import { generateMnemonic } from '@core/profile-manager'
import { formatUnitBestMatch } from 'shared/lib/units'
import { get, writable } from 'svelte/store'
import { onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
import { convertToFiat, currencies, exchangeRates, formatCurrency } from './currency'
import { CurrencyTypes } from './typings/currency'
import { RecoveryPhrase } from './typings/mnemonic'
import { AccountBalance } from '@iota/wallet'

/**
 * A number representing the threshold for what is considered dust, which is 1Mi or 1,000,000i.
 */
export const DUST_THRESHOLD: number = 1_000_000

export const isTransferring = writable<boolean>(false)

export const hasGeneratedALedgerReceiveAddress = writable<boolean | null>(false)

export const isSyncing = writable<boolean>(false)
export const isFirstSessionSync = writable<boolean>(true)
export const isFirstManualSync = writable<boolean>(true)
export const isBackgroundSyncing = writable<boolean>(false)

export async function generateAndStoreMnemonic(): Promise<RecoveryPhrase> {
    const mnemonicString = await generateMnemonic()
    const mnemnonicList = mnemonicString?.split(' ')
    updateOnboardingProfile({ mnemonic: mnemnonicList })
    return mnemnonicList
}

/**
 * Get legacy seed checksum
 *
 * @method asyncGetLegacySeedChecksum
 *
 * @param {string} seed
 *
 * @returns {Promise<Event<string>>}
 */
// export const asyncGetLegacySeedChecksum = (seed: string): Promise<string> =>
//     new Promise<string>((resolve, reject) => {
//         api.getLegacySeedChecksum(seed, {
//             onSuccess(response) {
//                 resolve(response.payload)
//             },
//             onError(err) {
//                 reject(err)
//             },
//         })
//     })

/**
 * Updates balance overview
 *
 * @method updateBalanceOverview
 *
 * @param {number} balance
 * @param {number} incoming
 * @param {number} outgoing
 *
 * @returns {void}
 */
export const updateBalanceOverview = (balance: number, incoming: number, outgoing: number): void => {
    const { balanceOverview } = get(activeProfile)

    const activeCurrency = get(activeProfile)?.settings?.currency ?? CurrencyTypes.USD

    balanceOverview.update((overview) =>
        Object.assign<IBalanceOverview, IBalanceOverview, Partial<IBalanceOverview>>({} as IBalanceOverview, overview, {
            incoming: formatUnitBestMatch(incoming, true, 3),
            incomingRaw: incoming,
            outgoing: formatUnitBestMatch(outgoing, true, 3),
            outgoingRaw: outgoing,
            balance: formatUnitBestMatch(balance, true, 3),
            balanceRaw: balance,
            balanceFiat: formatCurrency(
                convertToFiat(balance, get(currencies)[CurrencyTypes.USD], get(exchangeRates)[activeCurrency])
            ),
        })
    )
}

/**
 * Updates balance overview fiat value
 *
 * @method refreshBalanceOverview
 *
 * @returns {void}
 */
export const refreshBalanceOverview = (): void => {
    const { balanceOverview } = get(activeProfile)
    const bo = get(balanceOverview)
    updateBalanceOverview(bo.balanceRaw, bo.incomingRaw, bo.outgoingRaw)
}

/**
 * Gets balance history for each account in market data timestamps
 *
 * @method getAccountBalanceHistory
 *
 * @param {Account} accounts
 * @param {number} balanceRaw
 * @param {PriceData} [priceData]
 *
 */
// export const getAccountBalanceHistory = (account: IAccountState, priceData: PriceData): BalanceHistory =>
// const balanceHistory: BalanceHistory = {
//     [HistoryDataProps.ONE_HOUR]: [],
//     [HistoryDataProps.TWENTY_FOUR_HOURS]: [],
//     [HistoryDataProps.SEVEN_DAYS]: [],
//     [HistoryDataProps.ONE_MONTH]: [],
// }
// if (priceData) {
//     const messages: Message[] =
//         account?.messages
//             ?.slice()
//             ?.filter((message) => message.payload && !isSelfTransaction(message.payload, account)) // Remove self transactions and messages with no payload
//             ?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) ?? [] // Sort messages from last to newest
//     // Calculate the variations for each account
//     let trackedBalance = Number(account.balances.total)
//     const accountBalanceVariations = [{ balance: trackedBalance, timestamp: new Date().toString() }]
//     messages.forEach((message) => {
//         const essence = message.payload.type === 'Transaction' && message.payload.data.essence.data

//         if (essence && essence.incoming) {
//             trackedBalance -= essence.value || 0
//         } else {
//             trackedBalance += essence.value || 0
//         }
//         accountBalanceVariations.push({ balance: trackedBalance, timestamp: message.timestamp })
//     })
//     // Calculate the balance in each market data timestamp
//     let balanceHistoryInTimeframe = []
//     Object.entries(priceData[CurrencyTypes.USD]).forEach(([timeframe, data]) => {
//         // sort market data from newest to last
//         const sortedData = data.slice().sort((a, b) => b[0] - a[0])
//         balanceHistoryInTimeframe = []
//         // if there are no balance variations
//         if (accountBalanceVariations.length === 1) {
//             balanceHistoryInTimeframe = sortedData.map((_data) => ({
//                 timestamp: _data[0],
//                 balance: trackedBalance,
//             }))
//         } else {
//             let i = 0
//             sortedData.forEach((data) => {
//                 const marketTimestamp = new Date(data[0] * 1000).getTime()
//                 // find balance for each market data timepstamp
//                 for (i; i < accountBalanceVariations.length - 1; i++) {
//                     const currentBalanceTimestamp = new Date(accountBalanceVariations[i].timestamp).getTime()
//                     const nextBalanceTimestamp = new Date(accountBalanceVariations[i + 1].timestamp).getTime()
//                     if (marketTimestamp > nextBalanceTimestamp && marketTimestamp <= currentBalanceTimestamp) {
//                         balanceHistoryInTimeframe.push({
//                             timestamp: data[0],
//                             balance: accountBalanceVariations[i].balance,
//                         })
//                         return
//                     } else if (
//                         marketTimestamp <= nextBalanceTimestamp &&
//                         i === accountBalanceVariations.length - 2
//                     ) {
//                         balanceHistoryInTimeframe.push({ timestamp: data[0], balance: 0 })
//                         return
//                     }
//                 }
//             })
//         }
//         balanceHistory[timeframe] = balanceHistoryInTimeframe.reverse()
//     })
// }
// return balanceHistory

export const prepareAccountInfo = (
    account: IAccount,
    meta: {
        balance: number
        incoming: number
        outgoing: number
        depositAddress: string
    }
): IAccountState => {
    const { index } = account.meta
    const { depositAddress } = meta

    // TODO: Hardcoded signer type
    return Object.assign<IAccountState, IAccount, Partial<IAccountState>>({} as IAccountState, account, {
        id: index.toString(),
        depositAddress,
        balances: <AccountBalance>{},
    })
}

/**
 * Check if a message was emitted and received by the provided account
 *
 * @method getWalletBalanceHistory
 *
 * @param {Payload} payload
 * @param {IAccountState} account
 *
 */
// export const isSelfTransaction = (payload: Payload, account: IAccountState): boolean => {
//     const accountAddresses = account?.depositAddress
//     if (payload && accountAddresses.length) {
//         const getReceiverAddresses = () => {
//             if (payload.type === 'Transaction') {
//                 return receiverAddressesFromTransactionPayload(payload)
//             } else if (payload.type === 'Milestone') {
//                 return receiverAddressesFromMilestonePayload(payload)
//             }

//             return null
//         }

//         const senderAddress: string = sendAddressFromTransactionPayload(payload)

//         const receiverAddresses: string[] = getReceiverAddresses()

//         const transactionAddresses = [senderAddress, ...receiverAddresses]
//         return (
//             senderAddress &&
//             receiverAddresses.length &&
//             transactionAddresses.every((txAddress) => accountAddresses.indexOf(txAddress) !== -1)
//         )
//     }
//     return false

/**
 * Find an address in one of our accounts
 * @param address The address to find
 * @returns The wallet account matching the address or undefined if not found
 */
export const findAccountWithAddress = (address: string): IAccountState | undefined => {
    if (!address) {
        return
    }
    const accounts = get(activeAccounts)
    return accounts.find((account) => account.depositAddress === address)
}

/**
 * Find an address in one of our accounts
 * @param addresses The addresses to find
 * @param excludeFirst A wallet to exclude on first pass
 * @returns The wallet account matching the address or undefined if not found
 */
export const findAccountWithAnyAddress = (
    addresses: string[],
    excludeFirst?: IAccountState
): IAccountState | undefined => {
    if (!addresses || addresses.length === 0) {
        return
    }
    const accounts = get(activeAccounts)

    let res = accounts.filter((acc) => addresses.includes(acc.depositAddress))

    if (res.length > 0) {
        if (excludeFirst) {
            const initialLen = res.length
            res = res.filter((a) => a.id !== excludeFirst.id)
            // If the length changed we removed it, so put it back
            // at the end
            if (res.length !== initialLen) {
                res.push(excludeFirst)
            }
        }

        if (res.length > 0) {
            return res[0]
        }
    }
}

/**
 * Determines if the API call for syncing accounts is the initial one
 * @returns {boolean} The boolean value determining if this sync API call is the first ever one
 */
export const isInitialAccountSync = (): boolean =>
    get(onboardingProfile)?.recoveryType !== null && get(isFirstSessionSync)

/**
 * Determines whether an account has any pending transactions.
 *
 * @method hasPendingTransactions
 *
 * @param {IAccountState} account
 *
 * @returns {boolean}
 */
export const hasPendingTransactions = (account: IAccountState): boolean => {
    if (!account) return false

    return account?.messages.some((m) => !m.confirmed)
}

/**
 * Determines whether an account has any valid pending transactions i.e. transactions that can confirm.
 *
 * @method hasValidPendingTransactions
 *
 * @param {IAccountState} account
 *
 * @returns {boolean}
 */
export const hasValidPendingTransactions = (account: IAccountState): boolean => {
    if (!account) return false
    const pendingMessages = account?.messages.filter((m) => !m.confirmed)
    const pendingInputs = pendingMessages.flatMap((msg) => {
        if (msg.payload?.type === 'Transaction') {
            return msg.payload?.data?.essence?.data?.inputs
        }
        return []
    })
    const unspentOutputs = account?.addresses.filter((a) => a.balance > 0).flatMap((a) => Object.values(a.outputs))

    return pendingInputs.some((i) => unspentOutputs.some((o) => o.transactionId === i.data?.metadata?.transactionId))
}

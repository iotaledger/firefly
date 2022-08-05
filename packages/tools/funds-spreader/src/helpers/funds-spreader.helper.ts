/* eslint-disable no-console */

import { Account, AccountManager, Address, CoinType } from '@iota/wallet'

import { ACCOUNT_FUNDS_SPREADER_SLEEP_INTERVAL } from '../constants'
import { IAccountFundsSpreaderParameters, IFundsSpreaderParameters } from '../interfaces'
import { sleep } from '../utils'

import { initialiseAccountManager } from './account-manager.helper'
import { getFaucetApiEndpoint, makeFaucetRequests } from './faucet.helper'

/**
 * Spreads funds to addresses of accounts of a particular seed.
 */
export async function spreadFunds(parameters: IFundsSpreaderParameters, round: number = 1): Promise<void> {
    const manager = await initialiseAccountManager(parameters, round)
    await Promise.all(
        parameters?.accountFundsSpreaderParameters.map(async (accountFundsSpreaderParameters) => {
            await spreadFundsForAccount(
                accountFundsSpreaderParameters,
                manager,
                parameters?.addressEncodingCoinType,
                round
            )
            await sleep(ACCOUNT_FUNDS_SPREADER_SLEEP_INTERVAL)
        })
    )
}

async function spreadFundsForAccount(
    parameters: IAccountFundsSpreaderParameters,
    manager: AccountManager,
    coinType: CoinType,
    round: number
): Promise<void> {
    const account = await manager?.createAccount({ alias: parameters?.accountIndex.toString() })
    const addresses = await getAddressesForAccount(parameters, account)
    await makeFaucetRequests(getFaucetApiEndpoint(coinType), addresses)

    console.log('Fund Spreader: ', round)
    console.log('Account: ', account?.meta?.index)
    console.log('Addresses: ', addresses, '\n')
}

async function getAddressesForAccount(
    parameters: IAccountFundsSpreaderParameters,
    account: Account
): Promise<Address[]> {
    const highestAddressIndex = Math.max(...parameters?.addressIndicesWithFunds)
    if (highestAddressIndex < 0) return []

    const addressesBeyondIndexZero = await account?.generateAddresses(highestAddressIndex)
    const addressAtIndexZero = account?.meta?.publicAddresses[0]
    const addresses = [addressAtIndexZero, ...addressesBeyondIndexZero]
    return addresses.filter((address) => parameters?.addressIndicesWithFunds.includes(address?.keyIndex))
}

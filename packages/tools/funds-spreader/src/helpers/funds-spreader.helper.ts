/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-ignore
import { Promise } from 'bluebird'

import { Account, AccountManager, Address, CoinType } from '@iota/wallet'

import { ACCOUNT_FUNDS_SPREADER_SLEEP_INTERVAL } from '../constants'
import { IAccountFundsSpreaderParameters, IFundsSpreaderParameters } from '../interfaces'
import { sleep } from '../utils'

import { createStrongholdBackup, initialiseAccountManager } from './account-manager.helper'
import { getFaucetApiEndpoint, makeFaucetRequests } from './faucet.helper'

/**
 * Spreads funds to addresses of accounts of a particular seed.
 */
export async function spreadFunds(parameters: IFundsSpreaderParameters, round: number = 1): Promise<void> {
    const manager = await initialiseAccountManager(parameters, round)

    const highestAccountIndex = Math.max(
        ...parameters?.accountsFundsSpreaderParameters.map(
            (accountFundsSpreaderParameters) => accountFundsSpreaderParameters?.accountIndex
        )
    )
    await createAccounts(highestAccountIndex + 1, manager)

    for (const accountFundsSpreaderParameters of parameters?.accountsFundsSpreaderParameters) {
        await spreadFundsForAccount(
            parameters?.mnemonic,
            parameters?.requestFundsFromFaucet,
            accountFundsSpreaderParameters,
            manager,
            parameters?.addressEncodingCoinType,
            round
        )
        await sleep(ACCOUNT_FUNDS_SPREADER_SLEEP_INTERVAL)
    }
    if (parameters?.backupToStrongholdFile) {
        await createStrongholdBackup(parameters, round, manager)
    }

    clearAccounts()
}

async function spreadFundsForAccount(
    mnemonic: string,
    requestFundsFromFaucet: boolean,
    parameters: IAccountFundsSpreaderParameters,
    manager: AccountManager,
    coinType: CoinType,
    round: number
): Promise<void> {
    const account = getAccountAtIndex(parameters?.accountIndex)
    const addresses = await getAddressesForAccount(parameters, account)

    if (requestFundsFromFaucet) {
        await makeFaucetRequests(getFaucetApiEndpoint(coinType), addresses)
    }

    logInformationToConsole(mnemonic, round, account?.meta?.index, addresses)
}

let accounts: Account[] = []

async function createAccounts(numberOfAccounts: number, manager: AccountManager): Promise<void> {
    const emptyArrayOfIndices = Array.from({ length: numberOfAccounts })
    await Promise.all(
        emptyArrayOfIndices.map(async () => {
            const account = await manager?.createAccount({})
            accounts.push(account)
        })
    )
}

function clearAccounts(): void {
    accounts = []
}

function getAccountAtIndex(index: number): Account | undefined {
    return accounts.find((account) => account?.meta?.index === index)
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

/**
 * Array to keep track of what funds spreader runds have already been logged.
 */
const loggedFundsSpreaderRounds: number[] = []

function logInformationToConsole(mnemonic: string, round: number, accountIndex: number, addresses: Address[]): void {
    if (!loggedFundsSpreaderRounds.includes(round)) {
        console.log(`Fund Spreader No. ${round}`)
        console.log(mnemonic, '\n')
        loggedFundsSpreaderRounds.push(round)
    }
    console.log(`\tAccount ${accountIndex}:`)
    addresses.forEach((address) => {
        console.log(`\t\tAddress ${address?.keyIndex}: ${address?.address}`)
    })
    console.log()
}

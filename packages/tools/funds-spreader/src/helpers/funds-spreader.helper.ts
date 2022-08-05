/* eslint-disable no-console */

import * as path from 'path'

import { Account, AccountManager, Address } from '@iota/wallet'

import { BASE_FILE_PATH, STRONGHOLD_PASSWORD } from '../constants'
import { IAccountFundsSpreaderParameters, IFundsSpreaderParameters } from '../interfaces'

import { getNodeUrlFromCoinType } from './node.helper'

/**
 * Spreads funds to addresses of accounts of a particular seed.
 */
export async function spreadFunds(parameters: IFundsSpreaderParameters, round: number = 1): Promise<void> {
    // build account manager
    const manager = buildAccountManager(parameters, round)

    // initialise secret manager
    await initialiseSecretManager(parameters, manager)

    // spread funds for each account
    await Promise.all(
        parameters?.accountFundsSpreaderParameters.map(async (accountFundsSpreaderParameters) => {
            await spreadFundsForAccount(accountFundsSpreaderParameters, manager)
        })
    )
}

function buildAccountManager(parameters: IFundsSpreaderParameters, round: number): AccountManager {
    const FUNDS_SPREADER_FILE_PATH = `${BASE_FILE_PATH}/${round}`
    const accountManagerOptions = {
        storagePath: path.resolve(FUNDS_SPREADER_FILE_PATH, 'database'),
        clientOptions: {
            nodes: [getNodeUrlFromCoinType(parameters?.addressEncodingCoinType)],
            localPow: true,
        },
        coinType: parameters?.addressGenerationCoinType,
        secretManager: {
            Stronghold: {
                snapshotPath: path.resolve(FUNDS_SPREADER_FILE_PATH, 'wallet.stronghold'),
                password: STRONGHOLD_PASSWORD,
            },
        },
    }
    return new AccountManager(accountManagerOptions)
}

async function initialiseSecretManager(parameters: IFundsSpreaderParameters, manager: AccountManager): Promise<void> {
    await manager.verifyMnemonic(parameters?.mnemonic)
    await manager.storeMnemonic(parameters?.mnemonic)
}

async function spreadFundsForAccount(
    parameters: IAccountFundsSpreaderParameters,
    manager: AccountManager
): Promise<void> {
    const account = await manager?.createAccount({ alias: parameters?.accountIndex.toString() })
    const addresses = await getAddressesForAccount(parameters, account)
    // request funds from faucet

    console.log('Account: ', account?.meta?.index)
    console.log('Addresses: ', addresses)
    console.log()
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

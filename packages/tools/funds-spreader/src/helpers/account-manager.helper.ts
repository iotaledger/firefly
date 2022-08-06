import * as fs from 'fs'
import * as path from 'path'

import { AccountManager } from '@iota/wallet'

import { BASE_FILE_PATH, STRONGHOLD_PASSWORD } from '../constants'
import { IFundsSpreaderParameters } from '../interfaces'

import { getNodeUrlFromCoinType } from './node.helper'

/**
 * Deletes the files leftover from the previous funds spreader usage.
 */
export function cleanupOldAccountManagerData(): void {
    fs.rmSync(path.resolve(BASE_FILE_PATH), { recursive: true, force: true })
}

/**
 * Initialises the account manager (along with its secret manager) for the funds spreading.
 */
export async function initialiseAccountManager(
    parameters: IFundsSpreaderParameters,
    round: number
): Promise<AccountManager> {
    const manager = buildAccountManager(parameters, round)

    await manager.verifyMnemonic(parameters?.mnemonic)
    await manager.storeMnemonic(parameters?.mnemonic)

    return manager
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

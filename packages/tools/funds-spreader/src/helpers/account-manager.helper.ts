import * as fs from 'fs'
import * as path from 'path'

import { AccountManager, CoinType } from '@iota/wallet'

import { BACKUP_FILE_PATH, BASE_FILE_PATH, STRONGHOLD_PASSWORD } from '../constants'
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

export async function createStrongholdBackup(
    parameters: IFundsSpreaderParameters,
    round: number,
    manager: AccountManager
): Promise<void> {
    const prefix = String(round).padStart(3, '0')
    const gen = deriveCoinNameFromType(parameters?.addressGenerationCoinType)
    const enc = deriveCoinNameFromType(parameters?.addressEncodingCoinType)
    const destination = `${BACKUP_FILE_PATH}/fs-${prefix}_gen-${gen}_enc-${enc}.stronghold`
    await manager?.backup(destination, STRONGHOLD_PASSWORD)
}

function deriveCoinNameFromType(coinType: CoinType): 'iota' | 'shimmer' {
    return coinType === CoinType.IOTA ? 'iota' : 'shimmer'
}

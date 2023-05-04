import { get, writable } from 'svelte/store'

import { openPopup } from './popup'
import { api, asyncRestoreBackup, destroyActor, getProfileDataPath, initialise } from './wallet'
import { Event } from './typings/events'
import { StrongholdStatus } from './typings/wallet'
import { showAppNotification } from './notifications'
import { localize } from '@core/i18n'
import { isLedgerProfile, newProfile } from './profile'
import { Platform } from '@lib/platform'
import { strongholdPassword } from '@lib/app'
import { WALLET } from '@lib/shell/walletApi'
import { initAppSettings } from '@lib/appSettings'

export const STRONGHOLD_VERSION = 3

export const STRONGHOLD_VERSION_ERROR = 'snapshot::ReadError: UnsupportedVersion { expected: [3, 0], found: [2, 0] }'

export const STRONGHOLD_DECRYPTION_ERROR = 'Failed to decrypt snapshot: incorrect password or corrupt data'

export const importFilePath = writable<string>(null)

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const checkStronghold = (callback: any): void => {
    if (get(isLedgerProfile)) {
        showAppNotification({
            type: 'error',
            message: localize('error.ledger.noStronghold'),
        })

        return
    }

    api.getStrongholdStatus({
        onSuccess(response: Event<StrongholdStatus>) {
            const isLocked = response.payload.snapshot.status === 'Locked'
            if (isLocked) {
                openPopup(
                    {
                        type: 'password',
                        props: {
                            onSuccess: callback,
                        },
                    },
                    true
                )
            } else {
                callback()
            }
        },
        onError(err) {
            showAppNotification({
                type: 'error',
                message: localize(err?.error),
            })
        },
    })
}

export async function migrateStrongholdForRecovery(): Promise<void> {
    const newProfileId = get(newProfile)?.id
    destroyActor(newProfileId)

    const migrationFilePath = await getStrongholdMigrationFilePath(newProfileId)
    await Platform.copyFile(get(importFilePath), migrationFilePath)

    const _strongholdPassword = get(strongholdPassword)
    WALLET.migrateStrongholdSnapshotV2ToV3(
        migrationFilePath,
        _strongholdPassword,
        migrationFilePath,
        _strongholdPassword
    )
    get(newProfile).strongholdVersion = STRONGHOLD_VERSION

    const profileStoragePath = await getProfileDataPath(newProfileId)
    const { sendCrashReports } = get(initAppSettings) ?? { sendCrashReports: false }
    const machineId = await Platform.getMachineId()
    initialise(newProfileId, profileStoragePath, sendCrashReports, machineId)

    await asyncRestoreBackup(migrationFilePath, _strongholdPassword)
    await Platform.deleteFile(migrationFilePath)
}

export async function getStrongholdMigrationFilePath(profileId: string): Promise<string> {
    const profileStoragePath = await getProfileDataPath(profileId)
    return `${profileStoragePath}/db/wallet.stronghold`
}

import { createNewAccount, setSelectedAccount } from '@core/account'
import { addError, IError } from '@core/error'
import { localize } from '@core/i18n'
import { getAndUpdateNodeInfo } from '@core/network'
import {
    buildProfileManagerOptionsFromProfileData,
    initialiseProfileManager,
    isStrongholdUnlocked,
    profileManager,
    recoverAccounts,
} from '@core/profile-manager'
import {
    setStrongholdPasswordClearInterval,
    startBackgroundSync,
    subscribe as subscribeToWalletEvents,
} from '@core/profile-manager/api'
import { ProfileType } from '@core/profile/enums'
import { loginRouter } from '@core/router'
import { generateAndStoreActivitiesForAllAccounts, refreshAccountAssetsForActiveProfile } from '@core/wallet'
import { showAppNotification } from '@lib/notifications'
import { get } from 'svelte/store'
import {
    INITIAL_ACCOUNT_GAP_LIMIT,
    INITIAL_ADDRESS_GAP_LIMIT,
    STRONGHOLD_PASSWORD_CLEAR_INTERVAL,
} from '../../constants'
import {
    activeAccounts,
    activeProfile,
    incrementLoginProgress,
    resetLoginProgress,
    setTimeStrongholdLastUnlocked,
} from '../../stores'
import { loadAccounts } from './loadAccounts'
import { logout } from './logout'

export async function login(isOnboardingFlow?: boolean, shouldRecoverAccounts?: boolean): Promise<void> {
    const _loginRouter = get(loginRouter)
    try {
        const _activeProfile = get(activeProfile)
        const { loggedIn, lastActiveAt, id, isStrongholdLocked, type, lastUsedAccountId } = _activeProfile
        if (id) {
            // Step 1: create profile manager if its doesn't exist
            incrementLoginProgress()
            if (!get(profileManager)) {
                const profileManagerOptions = await buildProfileManagerOptionsFromProfileData(_activeProfile)
                const { storagePath, coinType, clientOptions, secretManager } = profileManagerOptions
                const manager = initialiseProfileManager(storagePath, coinType, clientOptions, secretManager, id)
                profileManager.set(manager)
            }

            // Step 2: get node info to check we have a synced node
            incrementLoginProgress()
            await getAndUpdateNodeInfo(true)

            // Step 3: load and build all the profile data
            incrementLoginProgress()
            if (isOnboardingFlow && shouldRecoverAccounts) {
                const accountMetadatas = await recoverAccounts(
                    INITIAL_ACCOUNT_GAP_LIMIT[type],
                    INITIAL_ADDRESS_GAP_LIMIT[type]
                )

                /**
                 * NOTE: In the case no accounts with funds were recovered, we must
                 * create one for the new profile.
                 */
                if (accountMetadatas?.length === 0) {
                    await createNewAccount()
                }
            } else if (isOnboardingFlow) {
                await createNewAccount()
            }

            // Step 4: load accounts
            incrementLoginProgress()
            await loadAccounts()

            // Step 5: load assets
            incrementLoginProgress()
            await refreshAccountAssetsForActiveProfile()

            // Step 6: generate and store activities for all accounts
            incrementLoginProgress()
            await generateAndStoreActivitiesForAllAccounts()

            if (type === ProfileType.Software) {
                // Step 7: set initial stronghold status
                incrementLoginProgress()
                const strongholdUnlocked = await isStrongholdUnlocked()
                isStrongholdLocked.set(!strongholdUnlocked)
                setStrongholdPasswordClearInterval(STRONGHOLD_PASSWORD_CLEAR_INTERVAL)
                if (strongholdUnlocked) {
                    setTimeStrongholdLastUnlocked()
                }
            } else {
                incrementLoginProgress(2)
            }

            // Step 8: start background sync
            incrementLoginProgress()
            subscribeToWalletEvents()
            await startBackgroundSync({ syncIncomingTransactions: true })

            // Step 9: finish login
            incrementLoginProgress()
            setSelectedAccount(lastUsedAccountId ?? get(activeAccounts)?.[0]?.id ?? null)
            lastActiveAt.set(new Date())
            loggedIn.set(true)
            setTimeout(() => {
                _loginRouter.next()
                resetLoginProgress()
            }, 500)
        }
    } catch (err) {
        handleErrorFromApi({ ...err, message: err?.message ?? err?.error })
        await logout()
        _loginRouter.previous()
        resetLoginProgress()
    }
}

function handleErrorFromApi(error: IError): void {
    if (error?.type) {
        switch (error?.type) {
            case 'ClientError':
                handleClientError(error)
                break
            default:
                handleGenericError(error)
        }
    } else {
        handleGenericError(error)
    }
}

function handleGenericError(error: IError) {
    handleError({
        message: error?.message,
        logToConsole: true,
        saveToErrorLog: true,
        showNotification: true,
    })
}

function handleClientError(error: IError) {
    let errorKey
    if (error?.message) {
        switch (true) {
            case CLIENT_ERROR_REGEXES[ClientErrorKey.NoSyncedNode].test(error?.message):
                errorKey = ClientErrorKey.NoSyncedNode
                break
            case CLIENT_ERROR_REGEXES[ClientErrorKey.TimeNotSynced].test(error?.message):
                errorKey = ClientErrorKey.TimeNotSynced
                break
        }
        if (errorKey) {
            const errorObject = API_ERROR?.[error?.type]?.[errorKey]
            if (errorObject) {
                handleError({ ...errorObject, message: error?.message })
            } else {
                handleGenericError(error)
            }
        } else {
            handleGenericError(error)
        }
    } else {
        handleGenericError(error)
    }
}

function handleError(errorParameters: IErrorParameters) {
    const localisedMessage = errorParameters?.localisationKey
        ? localize(errorParameters?.localisationKey)
        : localize('error.global.generic')

    if (errorParameters?.logToConsole) {
        console.error(errorParameters?.message)
    }

    if (errorParameters?.saveToErrorLog) {
        addError(errorParameters)
    }

    if (errorParameters?.showNotification) {
        showAppNotification({
            alert: true,
            type: 'error',
            message: localisedMessage,
        })
    }
}

enum ApiErrorGroupKey {
    ClientError = 'ClientError',
}

enum ClientErrorKey {
    NoSyncedNode = 'noSyncedNode',
    TimeNotSynced = 'timeNotSynced',
}

const CLIENT_ERROR_REGEXES = {
    [ClientErrorKey.NoSyncedNode]: /`No synced node available`/,
    [ClientErrorKey.TimeNotSynced]: /`Local time \d* doesn't match the time of the latest milestone timestamp: \d*`/,
}

const API_ERROR: Readonly<{ [key in ApiErrorGroupKey]?: { [key in ClientErrorKey]?: Partial<IErrorParameters> } }> = {
    [ApiErrorGroupKey.ClientError]: {
        [ClientErrorKey.NoSyncedNode]: {
            localisationKey: `error.node.${ClientErrorKey.NoSyncedNode}`,
            logToConsole: true,
            saveToErrorLog: true,
            showNotification: true,
        },
        [ClientErrorKey.TimeNotSynced]: {
            localisationKey: `error.node.${ClientErrorKey.TimeNotSynced}`,
            logToConsole: true,
            saveToErrorLog: true,
            showNotification: true,
        },
    },
}

export interface IErrorParameters {
    message: string
    localisationKey?: string
    logToConsole?: boolean
    saveToErrorLog?: boolean
    showNotification?: boolean
}

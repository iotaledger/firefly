import { Unit } from '@iota/unit-converter'
import { isSoftwareProfile } from 'shared/lib/profile'
import { get, writable } from 'svelte/store'
import { lastAcceptedPrivacyPolicy, lastAcceptedTos } from './appSettings'
import { localize } from '@core/i18n'
import { stopPollingLedgerStatus } from './ledger'
import { showAppNotification } from './notifications'
import { resetParticipation } from './participation'
import { closePopup } from './popup'
import { activeProfile, clearActiveProfile, isLedgerProfile, isStrongholdLocked } from './profile'
import { resetRouters } from '@core/router'
import { Stage } from './typings/stage'
import { api, destroyActor, resetWallet } from './wallet'
import { SendParams } from 'shared/lib/typings/sendParams'

/**
 * Beta mode
 */
export const stage = writable<Stage>(Stage.ALPHA)

/**
 * Mobile mode
 */
export const mobile = writable<boolean>(false)

/**
 * Mobile soft leyboard height
 */
export const keyboardHeight = writable<number>(0)

/**
 * Mobile soft leyboard open state
 */
export const isKeyboardOpened = writable<boolean>(false)

/**
 * Wallet access pin
 */
export const walletPin = writable<string>(null)

/**
 * Stronghold password
 */
export const strongholdPassword = writable<string>(null)

/**
 * Seed BIP39 mnemonic recovery phrase
 */
export const mnemonic = writable<string[]>(null)

/**
 * The last timestamp that the app user was active
 */
export const lastActiveAt = writable<Date>(new Date())

/**
 * Input parameters for sending transactions
 */
export const sendParams = writable<SendParams>({
    amount: undefined,
    unit: Unit.Mi,
    address: '',
    message: '',
    isInternal: false,
})
export const clearSendParams = (isInternal = false): void =>
    sendParams.set({
        amount: undefined,
        unit: Unit.Mi,
        address: '',
        message: '',
        isInternal,
        toWalletAccount: undefined,
    })

/**
 * Determines whether a user is logged in
 */
export const loggedIn = writable<boolean>(false)

/**
 * Cleanup the signup vars
 */
export const cleanupSignup = (): void => {
    mnemonic.set(null)
    strongholdPassword.set(null)
    walletPin.set(null)
}

/**
 * Log in to the current profile
 */
export const login = (): void => {
    loggedIn.set(true)
    lastActiveAt.set(new Date())
}

/**

 * Logout from current profile
 */
export const logout = (_clearActiveProfile: boolean = false, _lockStronghold: boolean = true): Promise<void> =>
    new Promise<void>((resolve) => {
        const _activeProfile = get(activeProfile)

        const _cleanup = () => {
            /**
             * CAUTION: Be sure to make any necessary API calls before
             * the event actor is destroyed!
             */
            if (_activeProfile) {
                destroyActor(_activeProfile.id)
            }

            if (get(isSoftwareProfile)) {
                isStrongholdLocked.set(true)
            }
            if (get(isLedgerProfile)) {
                stopPollingLedgerStatus()
            }

            lastActiveAt.set(new Date())

            clearSendParams()
            closePopup(true)
            loggedIn.set(false)
            if (_clearActiveProfile) clearActiveProfile()
            resetParticipation()
            resetWallet()
            resetRouters()

            resolve()
        }

        // no need to lock strong hold if we are logging out after deleting a profile
        // or we are not using a software profile
        if (_lockStronghold && get(isSoftwareProfile) && !get(isStrongholdLocked)) {
            api.lockStronghold({
                onSuccess() {
                    _cleanup()
                },
                onError(err) {
                    _cleanup()

                    showAppNotification({
                        type: 'error',
                        message: localize(err.error),
                    })
                },
            })
        } else {
            _cleanup()
        }
    })

/**
 * The privacy policy packaged with the current version of Firefly
 */
export const PRIVACY_POLICY_VERSION = 2

/**
 * The Terms of Service packaged with the current version of Firefly
 */
export const TOS_VERSION = 2

export const needsToAcceptLatestPrivacyPolicy = (): boolean => get(lastAcceptedPrivacyPolicy) < PRIVACY_POLICY_VERSION
export const needsToAcceptLatestTos = (): boolean => get(lastAcceptedTos) < TOS_VERSION

export const isAndroid = writable<boolean>(false)

export const getKeyboardTransitionSpeed = (isKeyboardOpened: boolean): string =>
    isKeyboardOpened ? (get(isAndroid) ? '0.2s' : '0.4s') : '0.25s'

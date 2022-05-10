import { Unit } from '@iota/unit-converter'
import { isLedgerProfile, isSoftwareProfile, resetActiveProfile } from '@core/profile'
import { get, writable } from 'svelte/store'
import { lastAcceptedPrivacyPolicy, lastAcceptedTos } from './appSettings'
import { localize } from '@core/i18n'
import { stopPollingLedgerStatus } from './ledger'
import { showAppNotification } from './notifications'
import { resetParticipation } from './participation'
import { closePopup } from './popup'
import { clearActiveProfile, isStrongholdLocked } from './profile'
import { resetRouters } from '@core/router'
import { Stage } from './typings/stage'
import { api, destroyManager } from './wallet'
import { SendParams } from 'shared/lib/typings/sendParams'
import { activeProfile } from '@core/profile'

/**
 * Beta mode
 */
export const stage = writable<Stage>(Stage.ALPHA)

/**
 * Mobile mode
 */
export const mobile = writable<boolean>(false)

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
 * The privacy policy packaged with the current version of Firefly
 */
export const PRIVACY_POLICY_VERSION = 2

/**
 * The Terms of Service packaged with the current version of Firefly
 */
export const TOS_VERSION = 2

export const needsToAcceptLatestPrivacyPolicy = (): boolean => get(lastAcceptedPrivacyPolicy) < PRIVACY_POLICY_VERSION
export const needsToAcceptLatestTos = (): boolean => get(lastAcceptedTos) < TOS_VERSION

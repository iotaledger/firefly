import { SendParams } from 'shared/lib/typings/sendParams'
import { get, writable } from 'svelte/store'
import { lastAcceptedPrivacyPolicy, lastAcceptedTos } from './appSettings'
import { Stage } from './typings/stage'
import { Unit } from './units'

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
 * Input parameters for sending transactions
 */
export const sendParams = writable<SendParams>({
    amount: undefined,
    unit: Unit.M,
    address: '',
    message: '',
    isInternal: false,
})
export const clearSendParams = (isInternal = false): void =>
    sendParams.set({
        amount: undefined,
        unit: Unit.M,
        address: '',
        message: '',
        isInternal,
        toWalletAccount: undefined,
    })

/**
 * Cleanup the signup vars
 */
export const cleanupSignup = (): void => {
    mnemonic.set(null)
    strongholdPassword.set(null)
    walletPin.set(null)
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

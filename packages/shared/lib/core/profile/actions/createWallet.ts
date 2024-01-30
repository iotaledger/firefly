import { api } from '@core/api'
import { IPersistedProfile, IWallet } from '../interfaces'
import {
    getSecretManagerFromProfileType,
    getStorageDirectoryOfSecretManager,
    getStorageDirectoryOfWallet,
} from '../utils'
import { WalletOptions } from '@iota/sdk'
import { selectedWalletId } from '../../wallet'
import { generateRandomId } from '../../utils'

export function getWalletOptions(
    profile: IPersistedProfile,
    storagePath: string,
    secretManagerPath: string,
    password?: string
): WalletOptions {
    return {
        clientOptions: profile.clientOptions,
        storagePath,
        secretManager: getSecretManagerFromProfileType(profile.type, secretManagerPath, password),
        bipPath: {
            coinType: profile.network.coinType,
            account: 0,
            addressIndex: 0,
        },
    }
}

export async function createWallet(profile: IPersistedProfile, password?: string): Promise<IWallet> {
    const walletId = generateRandomId()
    const walletDBPath = await getStorageDirectoryOfWallet(profile.id, walletId)
    const secretManagerPath = await getStorageDirectoryOfSecretManager(profile.id)
    const walletOptions = getWalletOptions(profile, walletDBPath, secretManagerPath, password)

    const wallet = await api.getWallet(walletId, walletOptions)

    selectedWalletId.set(walletId)

    return wallet
}

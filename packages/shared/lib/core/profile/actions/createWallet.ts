import { api } from '@core/api'
import { IPersistedProfile, IWallet } from '../interfaces'
import { getSecretManagerFromProfileType } from '../utils'
import { WalletOptions } from '@iota/sdk/out/types'
import { selectedWalletId } from '@core/wallet'
import { generateRandomId } from '@core/utils'
import { DirectoryManager } from '@core/profile/classes'

export function getWalletOptions(
    profile: IPersistedProfile,
    walletPath: string,
    secretManagerPath: string,
    password?: string
): WalletOptions {
    return {
        clientOptions: profile.clientOptions,
        storagePath: walletPath,
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
    const walletPath = await DirectoryManager.forWallet(profile.id, walletId)
    const secretManagerPath = await DirectoryManager.forSecretManager(profile.id)
    const walletOptions = getWalletOptions(profile, walletPath, secretManagerPath, password)

    const wallet = await api.getWallet(walletId, walletOptions)

    selectedWalletId.set(walletId)

    return wallet
}

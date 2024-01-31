import { Platform } from '@core/app/classes'
import { PROFILE_STORAGE_DIRECTORY, TEMPORARY_WALLET_DIRECTORY_NAME } from '../constants'

class DirectoryManagerBase {
    profilePathResolver: Promise<string>

    constructor() {
        this.profilePathResolver = Platform.getUserDataPath().then((profilesPath) => `${profilesPath}/${PROFILE_STORAGE_DIRECTORY}`)
    }

    forProfiles(): Promise<string> {
        return this.profilePathResolver
    }

    async forProfile(profileId: string): Promise<string> {
        return `${await this.profilePathResolver}/${profileId}`
    }

    async forWallet(profileId: string, walletId: string): Promise<string> {
        return `${await this.forProfile(profileId)}/${walletId}`
    }

    async forSecretManager(profileId: string): Promise<string> {
        return `${await this.forProfile(profileId)}/secret-manager`
    }

    async forStronghold(profileId: string): Promise<string> {
        return `${await this.forSecretManager(profileId)}/wallet.stronghold`
    }

    async forTemporaryWallet(): Promise<string> {
        return `${await this.profilePathResolver}/${TEMPORARY_WALLET_DIRECTORY_NAME}`
    }
}

export const DirectoryManager = new DirectoryManagerBase()

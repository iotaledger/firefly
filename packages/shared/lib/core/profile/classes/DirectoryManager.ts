import { Platform } from '@core/app/classes'
import { DEV_STORAGE_DIRECTORY, PROFILE_STORAGE_DIRECTORY, TEMPORARY_WALLET_DIRECTORY_NAME } from '../constants'

class DirectoryManagerBase {
    profilePathResolver: Promise<string>
    profilePath: string = ''

    constructor() {
        this.profilePathResolver = Platform.getUserDataPath().then((profilesPath) => {
            this.profilePath = `${profilesPath}/${PROFILE_STORAGE_DIRECTORY}`
            return this.profilePath
        })
    }

    storageBasePath(): string {
        if (process.env.NODE_ENV === 'development') {
            return DEV_STORAGE_DIRECTORY
        } else {
            return this.profilePath
        }
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

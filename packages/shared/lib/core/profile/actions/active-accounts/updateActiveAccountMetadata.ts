import { IAccountMetadata } from '@core/account'
import { updateAccountMetadataOnActiveProfile, updateActiveAccount } from '@core/profile'

export function updateActiveAccountMetadata(id: string, partialAccountMetadata: Partial<IAccountMetadata>): void {
    updateActiveAccount(id, partialAccountMetadata)
    updateAccountMetadataOnActiveProfile(id, partialAccountMetadata)
}

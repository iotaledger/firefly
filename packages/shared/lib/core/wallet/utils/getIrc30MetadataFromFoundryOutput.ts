import { IIrc30Metadata } from '../interfaces'
import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'
import { Converter } from '@lib/converter'
import { validateIrc30Metadata } from './validateIrc30Metadata'
import { getMetadataFromFoundryOutput } from './getMetadataFromFoundryOutput'

export async function getIrc30MetadataFromFoundryOutput(tokenId: string): Promise<IIrc30Metadata> {
    try {
        const foundry = await get(selectedAccount).getFoundryOutput(tokenId)
        const data = getMetadataFromFoundryOutput(foundry)
        if (data) {
            const metadata = JSON.parse(Converter.hexToUtf8(data))
            const isValid = validateIrc30Metadata(metadata)
            if (isValid) {
                return metadata
            } else {
                return undefined
            }
        } else {
            return undefined
        }
    } catch (error) {
        return Promise.resolve(undefined)
    }
}

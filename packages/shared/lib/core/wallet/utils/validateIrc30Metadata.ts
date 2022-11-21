import { IIrc30Metadata } from '../interfaces'

export function validateIrc30Metadata(metadata: IIrc30Metadata): boolean {
    if (!metadata?.standard || typeof metadata?.standard !== 'string') {
        return false
    }
    if (!metadata.name || typeof metadata.name !== 'string') {
        return false
    }
    if (!metadata.description || typeof metadata.description !== 'string') {
        return false
    }
    if (!metadata.symbol || typeof metadata.symbol !== 'string') {
        return false
    }
    if ((!metadata.decimals && metadata.decimals !== 0) || typeof metadata.decimals !== 'number') {
        return false
    }
    if (metadata.description && typeof metadata.description !== 'string') {
        return false
    }
    if (metadata.logo && typeof metadata.logo !== 'string') {
        return false
    }
    if (metadata.logoUrl && typeof metadata.logoUrl !== 'string') {
        return false
    }
    return true
}

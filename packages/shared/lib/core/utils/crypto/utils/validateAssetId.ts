import { InvalidAssetIdError } from '@auxiliary/deep-link'

export function validateAssetId(id: string): void {
    if (!/^(0x08)?[0-9a-f]{64}?(?:0[1-9]|[1-5][0-9]|6[0-4])?0{8}$/i.test(id)) {
        throw new InvalidAssetIdError()
    }
}

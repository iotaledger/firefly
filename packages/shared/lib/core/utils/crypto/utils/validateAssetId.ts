import { InvalidAssetIdError } from '@auxiliary/deep-link'
import { COIN_TYPE } from '@core/network'

export function validateAssetId(id: string): void {
    const isHex = id.startsWith('0x')
    if (isHex && !/^(0x08)?[0-9a-f]{64}?(?:0[1-9]|[1-5][0-9]|6[0-4])?0{8}$/i.test(id)) {
        throw new InvalidAssetIdError()
    } else if (!isHex && !Object.values(COIN_TYPE).includes(Number(id))) {
        throw new InvalidAssetIdError()
    }
}

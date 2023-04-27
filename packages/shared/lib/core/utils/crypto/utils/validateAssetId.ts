import { InvalidAssetIdError } from '@auxiliary/deep-link'
import { COIN_TYPE } from '@core/network'
import { isValidHexAddress } from './isValidHexAddress'

export function validateAssetId(id: string): void {
    if (isValidHexAddress(id)) {
        throw new InvalidAssetIdError()
    } else if (!Object.values(COIN_TYPE).includes(Number(id))) {
        throw new InvalidAssetIdError()
    }
}

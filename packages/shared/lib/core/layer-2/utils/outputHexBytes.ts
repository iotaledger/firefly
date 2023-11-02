import { api } from '@core/profile-manager'
import { HexEncodedString, Output } from '@iota/sdk/out/types'

export function outputHexBytes(output: Output): Promise<HexEncodedString> {
    return api.outputHexBytes(output)
}

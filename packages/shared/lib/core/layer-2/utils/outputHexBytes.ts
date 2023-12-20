import { HexEncodedString, Output } from '@iota/sdk/out/types'
import { api } from '@core/api'

export function outputHexBytes(output: Output): Promise<HexEncodedString> {
    return api.outputHexBytes(output)
}

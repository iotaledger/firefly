import { HexEncodedString, Output } from '@iota/sdk/out/types'
import { api } from '@core/api'

export function outputHexBytes(output: Output): HexEncodedString {
    return api.outputHexBytes(output)
}

import { EXPLORER_URLS } from '../constants'
import { NetworkProtocol, NetworkType } from '../enums'

export function getOfficialExplorer(protocol: NetworkProtocol, type: NetworkType): string {
    return EXPLORER_URLS[protocol][type] ?? ''
}

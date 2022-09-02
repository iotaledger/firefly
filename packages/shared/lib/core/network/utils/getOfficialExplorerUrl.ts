import { EXPLORER_URLS } from '../constants'
import { NetworkProtocol, NetworkType } from '../enums'

export function getOfficialExplorerUrl(protocol: NetworkProtocol, type: NetworkType): string {
    return EXPLORER_URLS?.[protocol]?.[type] ?? ''
}

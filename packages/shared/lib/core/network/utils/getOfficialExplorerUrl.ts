import { EXPLORER_URLS } from '../constants'
import { NetworkId } from '../enums'

export function getOfficialExplorerUrl(networkId: NetworkId): string {
    return EXPLORER_URLS?.[networkId] ?? ''
}

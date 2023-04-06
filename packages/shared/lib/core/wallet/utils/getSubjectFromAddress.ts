import { findActiveAccountWithAddress } from '@core/profile'
import { Subject } from '../types'
import { getLayer2NetworkFromAddress } from '@core/layer-2/utils'

export function getSubjectFromAddress(address: string): Subject {
    const account = findActiveAccountWithAddress(address)
    const network = getLayer2NetworkFromAddress(address)
    if (account) {
        return { type: 'account', account: account }
    } else if (network) {
        return { type: 'network', network }
    } else {
        return { type: 'address', address }
    }
}

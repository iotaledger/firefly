import { findActiveAccountWithAddress } from '@core/profile'
import { Subject } from '../types'

export function getSubjectFromAddress(address: string): Subject {
    const account = findActiveAccountWithAddress(address)
    if (account) {
        return { type: 'account', account: account }
    } else {
        return { type: 'address', address: address }
    }
}

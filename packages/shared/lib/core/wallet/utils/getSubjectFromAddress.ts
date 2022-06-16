import { findAccountWithAddress } from '@lib/wallet'
import { Subject } from '../types'

export function getSubjectFromAddress(address: string): Subject {
    const account = findAccountWithAddress(address)
    if (account) {
        return { type: 'account', account: account }
    } else {
        return { type: 'address', address: address }
    }
}

import { findAccountWithAddress } from '@lib/wallet'
import { Recipient, Sender } from '../types'

export function getAccoutByAddress(address: string): Recipient | Sender {
    const account = findAccountWithAddress(address)
    if (account) {
        return { type: 'account', account: account }
    } else {
        return { type: 'address', address: address }
    }
}

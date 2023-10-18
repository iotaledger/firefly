import { findActiveAccountWithAddress } from '@core/profile'
import { Subject } from '../types'
import { SubjectType } from '../enums'

export function getSubjectFromAddress(address: string): Subject {
    const account = findActiveAccountWithAddress(address)
    if (account) {
        return { type: SubjectType.Account, account: account }
    } else {
        return { type: SubjectType.Address, address }
    }
}

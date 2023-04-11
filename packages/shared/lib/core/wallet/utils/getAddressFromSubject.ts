import type { Subject } from '../types'

export function getAddressFromSubject(subject: Subject): string {
    if (subject.type === 'account') {
        return subject.account.depositAddress
    } else {
        return subject.address
    }
}

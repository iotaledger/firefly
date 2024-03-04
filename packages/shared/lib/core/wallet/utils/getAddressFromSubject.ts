import { SubjectType } from '../enums'
import type { Subject } from '../types'

export function getAddressFromSubject(subject: Subject): string {
    if (subject.type === SubjectType.Wallet) {
        return subject.wallet.depositAddress
    } else {
        return subject.address
    }
}

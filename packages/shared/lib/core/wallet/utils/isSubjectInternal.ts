import { Recipient, Sender } from '../types'

export function isSubjectInternal(subject: Recipient | Sender): boolean {
    return subject.type === 'account'
}

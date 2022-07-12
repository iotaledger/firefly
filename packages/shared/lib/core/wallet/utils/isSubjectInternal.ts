import { Subject } from '../types'

export function isSubjectInternal(subject: Subject): boolean {
    return subject?.type === 'account'
}

import { SubjectType } from '../enums'
import { Subject } from '../types'

export function isSubjectInternal(subject: Subject | undefined): boolean {
    return subject?.type === SubjectType.Account
}

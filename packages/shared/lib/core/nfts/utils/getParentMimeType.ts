import { ParentMimeType } from '../enums'
import { MimeType } from '../types'

export function getParentMimeType(mimeType: MimeType): ParentMimeType | undefined {
    return mimeType?.split('/', 1)?.[0] as ParentMimeType | undefined
}

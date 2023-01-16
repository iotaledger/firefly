import { RESERVED_TAG_KEYWORDS } from '../constants'

export function isReservedTagKeyword(tag: string): boolean {
    return RESERVED_TAG_KEYWORDS.includes(tag)
}

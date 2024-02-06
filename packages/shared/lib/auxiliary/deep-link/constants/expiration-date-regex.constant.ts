import { TimeUnit } from '../enums'

export const EXPIRATION_DATE_REGEX = new RegExp(`^(\\d+)(${Object.values(TimeUnit).join('|')})$`)

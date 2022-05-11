import { persistent } from '@lib/helpers'

export const activeProfileId = persistent<string | null>('activeProfileId', null)

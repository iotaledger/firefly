import { persistent } from '@lib/helpers'

export const activeProfileId = persistent<string>('activeProfileId', null)

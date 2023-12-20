import { persistent } from '@core/utils/store'

export const activeProfileId = persistent<string | null>('activeProfileId', null)

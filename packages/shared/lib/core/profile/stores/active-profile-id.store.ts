import { persistent } from '@core/utils/store'

export const activeProfileId = persistent<string>('activeProfileId', null)

import { persistent } from '@core/utils'

export const currentProfileVersion = persistent<number>('currentProfileVersion', -1)

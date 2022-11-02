import { persistent } from '@core/utils/store'

export const currentProfileVersion = persistent<number>('currentProfileVersion', -1)

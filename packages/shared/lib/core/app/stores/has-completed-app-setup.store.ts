import { persistent } from '@lib/helpers'

export const hasCompletedAppSetup = persistent<boolean>('hasCompletedAppSetup', false)

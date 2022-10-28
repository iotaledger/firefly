import { persistent } from '@core/utils/store'

export const hasCompletedAppSetup = persistent<boolean>('hasCompletedAppSetup', false)

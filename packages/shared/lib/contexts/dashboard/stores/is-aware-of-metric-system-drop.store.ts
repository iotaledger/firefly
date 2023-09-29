import { persistent } from '@core/utils/store'

export const isAwareOfMetricSystemDrop = persistent<boolean>('isAwareOfMetricSystemDrop', false)

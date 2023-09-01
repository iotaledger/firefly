import { DAYS_PER_WEEK, DAYS_PER_YEAR } from '@core/utils'

export const PAYOUT_SCHEDULE = 2 * DAYS_PER_WEEK
export const PAYOUTS_IN_1_YEAR = Math.round(DAYS_PER_YEAR / PAYOUT_SCHEDULE)

import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from '@core/utils'

const INTERVAL_IN_MINUTES = 1
/**
 * Default interval for polling the chains' statuses
 * */
export const CHAIN_STATUSES_POLL_INTERVAL = INTERVAL_IN_MINUTES * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND

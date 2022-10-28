import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from '@core/utils'

/**
 * The amount of time between checking if an updated version of the application has been
 * released.
 */
export const DEFAULT_APP_UPDATER_POLL_INTERVAL = 15 * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND

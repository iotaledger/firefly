import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from '@lib/time'

/**
 * The amount of time between checking if a new Firefly version has been released.
 */
export const DEFAULT_APP_UPDATER_POLL_INTERVAL = 15 * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND

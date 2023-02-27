import { checkForAppUpdate } from './checkForAppUpdate'

/**
 * Polls checking for an application update.
 */
export function pollCheckForAppUpdate(): void {
    void checkForAppUpdate()
    // setInterval(() => checkForAppUpdate(), DEFAULT_APP_UPDATER_POLL_INTERVAL)
}

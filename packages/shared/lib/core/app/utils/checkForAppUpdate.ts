import { Platform } from '../classes'

/**
 * Performs a check for an application update.
 */
export function checkForAppUpdate(): void {
    void Platform.checkForAppUpdate()
}

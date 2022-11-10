import { Platform } from '../classes'

/**
 * Initializes the installation of an application update.
 */
export function installAppUpdate(): void {
    void Platform.installAppUpdate()
}

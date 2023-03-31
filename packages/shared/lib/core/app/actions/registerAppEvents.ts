import { registerAppUpdateEvents } from './registerAppUpdateEvents'
import { registerNftMediaDownloadEvents } from './registerNftMediaDownloadEvents'

/**
 * Registers all event handlers for the application.
 */
export function registerAppEvents(): void {
    registerAppUpdateEvents()
    registerNftMediaDownloadEvents()
}

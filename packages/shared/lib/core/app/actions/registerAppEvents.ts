import { registerAppUpdateEvents } from './registerAppUpdateEvents'
import { registerDownloadEvents } from './registerDownloadEvents'

/**
 * Registers all event handlers for the application.
 */
export function registerAppEvents(): void {
    registerAppUpdateEvents()
    registerDownloadEvents()
}

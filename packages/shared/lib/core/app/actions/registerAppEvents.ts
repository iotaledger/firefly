import { registerAppUpdateEvents } from './registerAppUpdateEvents'
import { registerNftDeleteEvents } from './registerNftDeleteEvents'
import { registerNftDownloadEvents } from './registerNftDownloadEvents'

/**
 * Registers all event handlers for the application.
 */
export function registerAppEvents(): void {
    registerAppUpdateEvents()
    registerNftDownloadEvents()
    registerNftDeleteEvents()
}

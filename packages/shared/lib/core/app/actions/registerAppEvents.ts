import { registerAppUpdateEvents } from './registerAppUpdateEvents'

/**
 * Registers all event handlers for the application.
 */
export function registerAppEvents(): void {
    registerAppUpdateEvents()
}

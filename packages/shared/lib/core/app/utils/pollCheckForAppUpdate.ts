import { DEFAULT_APP_UPDATER_POLL_INTERVAL } from '../constants'
import { checkForAppUpdate } from './checkForAppUpdate'

export function pollCheckForAppUpdate(): void {
    setInterval(() => checkForAppUpdate(), DEFAULT_APP_UPDATER_POLL_INTERVAL)
}

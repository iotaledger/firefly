import { Platform } from '@lib/platform'

export function checkForAppUpdate(): void {
    void Platform.checkForAppUpdate()
}

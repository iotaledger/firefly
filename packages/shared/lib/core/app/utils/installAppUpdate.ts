import { Platform } from '@lib/platform'

export function installAppUpdate(): void {
    void Platform.installAppUpdate()
}

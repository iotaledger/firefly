import { Platform } from '../classes/platform.class'

export function openUrlInBrowser(url: string): void {
    Platform.openUrl(url)
}

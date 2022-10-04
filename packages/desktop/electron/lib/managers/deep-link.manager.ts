import { ipcRenderer } from 'electron'
import { DeepLinkEvent } from '../enums'

export const DeepLinkManager = {
    checkDeepLinkRequestExists(): void {
        ipcRenderer.send(DeepLinkEvent.CheckRequestExists)
    },
    clearDeepLinkRequest(): void {
        ipcRenderer.send(DeepLinkEvent.ClearRequest)
    },
}

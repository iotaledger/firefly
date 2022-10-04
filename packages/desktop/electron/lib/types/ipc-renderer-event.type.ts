import { AutoUpdaterEvent, DeepLinkEvent, KeychainEvent, UpdateEvent, VersionEvent, WindowEvent } from '../enums'

export type IpcRendererEvent =
    | AutoUpdaterEvent
    | DeepLinkEvent
    | KeychainEvent
    | UpdateEvent
    | VersionEvent
    | WindowEvent

// https://electron.build/auto-update.html#events
export enum AutoUpdaterEvent {
    Error = 'error',
    CheckingForUpdate = 'checking-for-update',
    Available = 'update-available',
    NotAvailable = 'update-not-available',
    DownloadProgress = 'download-progress',
    Downloaded = 'update-downloaded',
}

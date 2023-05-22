export type PickerOptions = {
    type: 'file' | 'folder'
    defaultPath: string
}

export interface SecureFilesystemAccessTypes {
    showPicker(options: PickerOptions): Promise<{ selected: string }>
    allowAccess(): Promise<void>
    revokeAccess(): Promise<void>
    finishBackup(): Promise<void>
    removeProfileFolder(options: { folder: string }): Promise<void>
    renameProfileFolder(options: { oldName: string; newName: string }): Promise<void>
    listProfileFolders(options: { folder: string }): Promise<{ files: [string] }>
    saveTextFile(options: { textContent: string; fileName: string }): Promise<void>
    copyFile(options: { source: string; destination: string }): Promise<void>
    deleteFile(options: { source: string }): Promise<void>
}

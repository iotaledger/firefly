export type PickerOptions = {
    type: 'file' | 'folder'
}

export interface SecureFilesystemAccessTypes {
    showPicker(options: { type: 'file' | 'folder' }): Promise<{ selected: string }>
    allowAccess(): Promise<void>
    revokeAccess(): Promise<void>
    finishBackup(): Promise<void>
    removeProfileFolder(options: { folder: string }): Promise<void>
    renameProfileFolder(options: { oldName: string; newName: string }): Promise<void>
    listProfileFolders(options: { folder: string }): Promise<{ files: [string] }>
    saveRecoveryKit(options: { selectedPath: string; fromRelativePath: string }): Promise<void>
}

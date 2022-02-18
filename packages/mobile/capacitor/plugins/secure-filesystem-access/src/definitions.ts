export type PickerOptions = {
  type: 'file' | 'folder';
}

export interface SecureFilesystemAccessTypes {
  showPicker(options: PickerOptions): Promise<{ selected: Array<string> }>;
}

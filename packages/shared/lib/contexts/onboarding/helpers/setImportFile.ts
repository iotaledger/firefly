import { importFile, importFilePath } from '../stores'

export function setImportFile(file: ArrayBuffer, filePath: string): void {
    importFile.set(<Buffer>file)
    importFilePath.set(filePath)
}

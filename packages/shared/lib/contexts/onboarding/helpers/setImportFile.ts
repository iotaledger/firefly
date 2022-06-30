import { importFile, importFilePath } from '../stores'

export function setImportFile(file: unknown, filePath: string): void {
    importFile.set(<Buffer>file)
    importFilePath.set(filePath)
}

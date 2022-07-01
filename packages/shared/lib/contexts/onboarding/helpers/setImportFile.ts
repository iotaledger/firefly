import { importFile, importFilePath } from '../stores'
import { ImportFile } from '../types'

export function setImportFile(file: ImportFile, filePath: string): void {
    importFile.set(file)
    importFilePath.set(filePath)
}

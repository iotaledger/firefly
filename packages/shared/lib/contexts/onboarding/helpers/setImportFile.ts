import { updateOnboardingProfile } from '../stores'
import { ImportFile } from '../types'

export function setImportFile(importFile: ImportFile, importFilePath: string): void {
    updateOnboardingProfile({ importFile, importFilePath })
}

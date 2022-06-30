import { seedvaultRegex, strongholdRegex } from '../constants'
import { UnsupportedBackupFileError } from '../errors'

export function validateBackupFile(filename: string): void {
    if (!strongholdRegex.test(filename) && !seedvaultRegex.test(filename)) {
        throw new UnsupportedBackupFileError()
    }
}

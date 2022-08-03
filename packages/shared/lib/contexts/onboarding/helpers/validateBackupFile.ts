import { SEEDVAULT_REGEX, STRONGHOLD_REGEX } from '../constants'
import { UnsupportedBackupFileError } from '../errors'

export function validateBackupFile(filename: string): void {
    if (!STRONGHOLD_REGEX.test(filename) && !SEEDVAULT_REGEX.test(filename)) {
        throw new UnsupportedBackupFileError()
    }
}

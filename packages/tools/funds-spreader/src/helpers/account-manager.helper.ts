import * as fs from 'fs'
import * as path from 'path'

import { BASE_FILE_PATH } from '../constants'

/**
 * Deletes the files leftover from the previous funds spreader usage.
 */
export function cleanupOldAccountManagerData(): void {
    fs.rmSync(path.resolve(__dirname, '../../', BASE_FILE_PATH), { recursive: true, force: true })
}

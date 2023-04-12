import { registerPlugin } from '@capacitor/core'

import type { SecureFilesystemAccessTypes } from './definitions'

const SecureFilesystemAccess = registerPlugin<SecureFilesystemAccessTypes>('SecureFilesystemAccess')

export * from './definitions'
export { SecureFilesystemAccess }

import { persistent } from '@lib/helpers'
import { IPersistedProfile } from '../interfaces'

export const profiles = persistent<IPersistedProfile[]>('profiles', [])

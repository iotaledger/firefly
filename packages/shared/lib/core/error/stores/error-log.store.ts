import { persistent } from '@core/utils/storage'

import { Error } from '../types'

export const errorLog = persistent<Error[]>('errorLog', [])

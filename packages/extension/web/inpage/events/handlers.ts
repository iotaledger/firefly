import type { FullResponse } from '../../shared/types'
import * as EventTypes from './eventTypes'
import { events } from './ee'

export function AddedOrigin(res: FullResponse) {
  if (res.payload && res.payload.origin) {
    const origin = window.location.origin
    if (res.payload.origin === origin) {
      events.emit(EventTypes.ADDED_ORIGIN, res.payload)
    }
  }
}

export function RemovedOrigin(res: FullResponse) {
  if (res.payload && res.payload.origin) {
    const origin = window.location.origin
    if (res.payload.origin === origin) {
      events.emit(EventTypes.REMOVED_ORIGIN, res.payload)
    }
  }
}
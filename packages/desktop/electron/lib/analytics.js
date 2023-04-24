import { init, track } from '@amplitude/analytics-node'
import { getMachineId } from './machineId'
import { ipcMain } from 'electron'

export function initialiseAnalytics() {
    init('API_KEY')
    ipcMain.handle('track-event', (_e, event, properties) => handleTrackEvent(event, properties))
}

function handleTrackEvent(event, properties) {
    track(event, properties, { device_id: getMachineId() })
}

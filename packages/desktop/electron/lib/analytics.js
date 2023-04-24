import { Identify, identify, init, track } from '@amplitude/analytics-node'
import { app, ipcMain } from 'electron'
import { getMachineId } from './machineId'
import { getPlatformVersion } from './diagnostics'
import os from 'os'

export function initialiseAnalytics() {
    // Initialise Amplitude with API key
    init('process.env.AMPLITUDE_API_KEY')

    // Set initial identify
    setInitialIdentify()

    // Register event handlers
    ipcMain.handle('track-event', (_e, event, properties) => handleTrackEvent(event, properties))
}

function handleTrackEvent(event, properties) {
    track(event, properties, { device_id: getMachineId() })
}

function setInitialIdentify() {
    const identifyObj = new Identify()

    // Application Information
    identifyObj.set('app_version', app.getVersion())

    // Platform Information
    identifyObj.setOnce('platform', os.platform())
    identifyObj.setOnce('platformArchitecture', os.arch())
    identifyObj.set('platformVersion', getPlatformVersion())

    identify(identifyObj, { device_id: getMachineId() })
}

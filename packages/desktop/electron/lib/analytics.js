import { Identify, identify, init, track } from '@amplitude/analytics-node'
import { app, ipcMain } from 'electron'
import { getMachineId } from './machineId'
import { getPlatformArchitecture, getPlatform, getPlatformVersion } from './diagnostics'

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

    // Platform Information
    identifyObj.setOnce('platform', getPlatform())
    identifyObj.setOnce('platformArchitecture', getPlatformArchitecture())
    identifyObj.set('platformVersion', getPlatformVersion())

    // Application Information
    identifyObj.set('applicationName', app.getName())
    identifyObj.set('applicationVersion', app.getVersion())

    identify(identifyObj, { device_id: getMachineId() })
}

import { Identify, identify, init, track, LogLevel } from '@amplitude/analytics-node'
import { app, ipcMain } from 'electron'
import { getMachineId } from './machineId'
import { getPlatformVersion } from './diagnostics'
import os from 'os'

export async function initialiseAnalytics() {
    if (process.env.AMPLITUDE_API_KEY) {
        // Initialise Amplitude with API key
        init(process.env.AMPLITUDE_API_KEY, { logLevel: LogLevel.None })
        // Set initial identify
        setInitialIdentify()
        // Register event handlers
        ipcMain.handle('track-event', (_e, event, properties) => handleTrackEvent(event, properties))
    }
}

function handleTrackEvent(event, properties) {
    track(event, properties, { device_id: getMachineId() })
}

function setInitialIdentify() {
    const identifyObj = new Identify()

    // Application Information
    identifyObj.set('app_name', app.getName())
    identifyObj.set('app_version', app.getVersion())

    // Platform Information
    identifyObj.setOnce('platform', os.platform())
    identifyObj.setOnce('platform_architecture', os.arch())
    identifyObj.set('platform_version', getPlatformVersion())

    identify(identifyObj, { device_id: getMachineId() })
}

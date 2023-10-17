import features from '@features/features'
import { Identify, identify, init, track } from '@amplitude/analytics-node'
import { app, ipcMain } from 'electron'
import { getMachineId } from './machineId'
import { getPlatformVersion } from './diagnostics'
import os from 'os'
import { NETWORK } from '../../product'

export async function initialiseAnalytics() {
    if (features.analytics.enabled && process.env.AMPLITUDE_API_KEY) {
        // Initialise Amplitude with API key
        init(process.env.AMPLITUDE_API_KEY, { logLevel: 0 })
        // Set initial identify
        setInitialIdentify()
        // Register event handlers
        ipcMain.handle('track-event', (_e, event, properties) => handleTrackEvent(event, properties))
    } else {
        if (features.analytics.enabled && !process.env.AMPLITUDE_API_KEY) {
            console.warn('Analytics is enabled but no API key is set')
        }
        ipcMain.handle('track-event', () => {})
    }
}

function handleTrackEvent(event, properties) {
    track(event, properties, { device_id: getMachineId() })
}

function setInitialIdentify() {
    const identifyObj = new Identify()

    // Application Information
    identifyObj.set('app_name', app.getName())
    identifyObj.set('app_version', `${NETWORK}-${app.getVersion()}`)

    // Platform Information
    identifyObj.setOnce('platform', os.platform())
    identifyObj.setOnce('platform_architecture', os.arch())
    identifyObj.set('platform_version', getPlatformVersion())

    identify(identifyObj, { device_id: getMachineId() })
}

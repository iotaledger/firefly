import os from 'os'
import { execSync } from 'child_process'

const MAC_OS_NAME_MAP = new Map([
    // Source: https://en.wikipedia.org/wiki/Darwin_(operating_system)#Release_history
    [22, ['Ventura', '13']],
    [21, ['Monterey', '12']],
    [20, ['Big Sur', '11']],
    [19, ['Catalina', '10.15']],
    [18, ['Mojave', '10.14']],
    [17, ['High Sierra', '10.13']],
    [16, ['Sierra', '10.12']],
    [15, ['El Capitan', '10.11']],
    [14, ['Yosemite', '10.10']],
    [13, ['Mavericks', '10.9']],
    [12, ['Mountain Lion', '10.8']],
    [11, ['Lion', '10.7']],
    [10, ['Snow Leopard', '10.6']],
    [9, ['Leopard', '10.5']],
    [8, ['Tiger', '10.4']],
    [7, ['Panther', '10.3']],
    [6, ['Jaguar', '10.2']],
    [5, ['Puma', '10.1']],
])

// Diagnostics
export function getDiagnostics() {
    return [
        { label: 'popups.diagnostics.platform', value: os.platform() === 'darwin' ? 'macOS' : os.platform() },
        { label: 'popups.diagnostics.platformVersion', value: getPlatformVersion() },
        { label: 'popups.diagnostics.platformArchitecture', value: os.arch() },
        { label: 'popups.diagnostics.cpuCount', value: os.cpus().length },
        { label: 'popups.diagnostics.totalMem', value: `${(os.totalmem() / 1048576).toFixed(1)} MB` },
        { label: 'popups.diagnostics.freeMem', value: `${(os.freemem() / 1048576).toFixed(1)} MB` },
    ]
}

export function getPlatformVersion() {
    if (os.platform() === 'darwin') {
        try {
            return execSync('sw_vers -productVersion').toString().trim()
        } catch (_err) {
            // Fall back to Darwin version map
            const verSplit = os.release().split('.')
            const num = Number.parseInt(verSplit[0], 10)
            if (!Number.isNaN(num)) {
                const [_, version] = MAC_OS_NAME_MAP.get(num)
                if (version) {
                    return version
                }
            }
        }
    } else {
        return os.release()
    }
}

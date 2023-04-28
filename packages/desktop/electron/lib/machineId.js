import { machineIdSync } from 'node-machine-id'

let machineId = null
export function getMachineId() {
    // Will only be null the first time
    // If this fails, it will probably fail again, so set it to an empty string
    if (machineId === null) {
        try {
            machineId = machineIdSync()
        } catch (err) {
            machineId = ''
            console.error(err)
        }
    }
    return machineId
}

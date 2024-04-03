import { ProtocolParameters } from '@iota/sdk/out/types'
import BigInteger from 'big-integer'
import { convertDateToUnixTimestamp, isValidDate } from '@core/utils'

export function getSlotIndexFromNodeInfo(protocolParameters: ProtocolParameters): number {
    const elapsedTime = getElapsedTimeFromNodeInfo(protocolParameters)
    if (!elapsedTime) return 0
    // The + 1 is required because slots are counted starting from 1. 0 is reserved for genesis slot
    const slotIndex =
        elapsedTime < 0
            ? protocolParameters.genesisSlot
            : protocolParameters.genesisSlot + elapsedTime / protocolParameters.slotDurationInSeconds + 1
    return slotIndex
}

function getElapsedTimeFromNodeInfo(protocolParameters: ProtocolParameters, date: Date = new Date()): number {
    const unixTimestamp = convertDateToUnixTimestamp(date)
    return BigInteger(unixTimestamp).minus(protocolParameters.genesisUnixTimestamp).toJSNumber()
}

export function getUnixTimestampFromNodeInfoAndSlotIndex(
    protocolParameters: ProtocolParameters,
    slotIndex: number
): number {
    const elapsedTime = (slotIndex - protocolParameters.genesisSlot - 1) * protocolParameters.slotDurationInSeconds
    return BigInteger(elapsedTime).add(protocolParameters.genesisUnixTimestamp).toJSNumber()
}

export function convertDateToSlotIndex(date: Date, protocolParameters: ProtocolParameters): number | undefined {
    if (isValidDate(date)) {
        const elapsedTime = getElapsedTimeFromNodeInfo(protocolParameters, date)
        return Math.round((protocolParameters.genesisSlot + elapsedTime) / protocolParameters.slotDurationInSeconds + 1)
    } else {
        return undefined
    }
}

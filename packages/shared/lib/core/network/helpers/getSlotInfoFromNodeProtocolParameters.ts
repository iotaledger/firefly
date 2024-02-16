import { ProtocolParameters } from '@iota/sdk/out/types'
import BigInteger from 'big-integer'
import { convertDateToUnixTimestamp } from '@core/utils'

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

function getElapsedTimeFromNodeInfo(protocolParameters: ProtocolParameters): number {
    const unixTimestamp = convertDateToUnixTimestamp(new Date())
    return BigInteger(unixTimestamp).minus(protocolParameters.genesisUnixTimestamp).toJSNumber()
}

export function getUnixTimestampFromNodeInfoAndSlotIndex(
    protocolParameters: ProtocolParameters,
    slotIndex: number
): number {
    const elapsedTime = (slotIndex - protocolParameters.genesisSlot - 1) * protocolParameters.slotDurationInSeconds
    return BigInteger(elapsedTime).add(protocolParameters.genesisUnixTimestamp).toJSNumber()
}

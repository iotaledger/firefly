import { Layer2Metadata, parseLayer2Metadata, getDestinationNetworkFromAddress } from '@core/layer-2'
import { SenderInfo } from '../../../types'

export function getLayer2ActivityInformation(
    metadata: string,
    sendingInfo: SenderInfo
): {
    parsedLayer2Metadata: Layer2Metadata | null
    destinationNetwork: string
} {
    let parsedLayer2Metadata: Layer2Metadata | null
    let destinationNetwork: string
    try {
        parsedLayer2Metadata = parseLayer2Metadata(metadata)
        destinationNetwork = getDestinationNetworkFromAddress(
            sendingInfo.subject.type === 'address' ? sendingInfo.subject.address : undefined
        )
    } catch (_err) {
        parsedLayer2Metadata = null
        destinationNetwork = getDestinationNetworkFromAddress(undefined)
    }
    return {
        parsedLayer2Metadata,
        destinationNetwork,
    }
}

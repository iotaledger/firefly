import { ILayer2TransferAllowanceMetadata } from '../interfaces'
import { parseLayer2MetadataForTransferV1 } from './parseLayer2MetadataForTransferV1'
import { parseLayer2MetadataForTransferV2 } from './parseLayer2MetadataForTransferV2'

export function parseLayer2MetadataForTransfer(metadata: Uint8Array): ILayer2TransferAllowanceMetadata {
    try {
        return parseLayer2MetadataForTransferV2(metadata)
    } catch (err) {
        return parseLayer2MetadataForTransferV1(metadata)
    }
}

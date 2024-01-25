import { HexEncodedString } from '@iota/sdk/out/types'

// TODO(2.0): remove this temporary interface when the sdk has the updated interface
export interface IOutputMetadataResponseTemp {
    blockId: HexEncodedString
    outputId: HexEncodedString
    latestCommitmentId: HexEncodedString
    included: IOutputMetadataResponseData
    spent: IOutputMetadataResponseData
}

interface IOutputMetadataResponseData {
    commitmentId?: HexEncodedString
    slot: number
    transactionId: HexEncodedString
}

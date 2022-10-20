export interface IMintNftDetails {
    type: unknown // set to NftType once defined
    uri: string
    name: string
    collectionId: string
    collectionName: string
    issuerName: string
    description: string
    attribute: unknown // set to INftAttribute once defined
}

export interface IAccountMetadata {
    id: string
    name: string
    color: string
    hidden: boolean
    // TODO: remove this once minting UX is done
    hasAlias?: boolean
}

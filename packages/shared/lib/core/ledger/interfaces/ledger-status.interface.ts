export interface LedgerStatus {
    connected: boolean
    locked: boolean
    blindSigningEnabled: boolean
    app?: {
        name: string
        version: string
    }
}

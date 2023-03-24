export interface ISetting {
    component: unknown
    childRoute: string
    requiresLogin?: boolean
    requiresLedgerProfile?: boolean
    requiresSoftwareProfile?: boolean
    props?: Record<string, unknown>
}

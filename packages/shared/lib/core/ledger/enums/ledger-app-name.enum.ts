export enum LedgerAppName {
    /**
     * CAUTION: These enum values MUST be
     * capitalized to match the app names
     * as they're directly returned by wallet-rs.
     *
     * If we apply our coding conventions here,
     * the connection state derivation logic will NOT
     * work.
     */
    Bolos = 'BOLOS',
    Shimmer = 'Shimmer',
}

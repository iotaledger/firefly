export interface ISimplePricesQueryParameters {
    ids: string
    vs_currencies: string
    include_market_cap?: boolean
    include_24hr_vol?: boolean
    include_24hr_change?: boolean
    include_last_updated_at?: boolean
    precision?: 'full' | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18
}

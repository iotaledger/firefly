export interface ActivityFilter {
    showHidden: BooleanFilter
}

export type Filter = BooleanFilter

export interface AssetFilter {
    showHidden: BooleanFilter
}

export type BooleanFilter = {
    type: 'boolean'
    active: boolean
    label: string
}

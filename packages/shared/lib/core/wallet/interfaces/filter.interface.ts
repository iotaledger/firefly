export type Filter = ActivityFilter | AssetFilter

export interface ActivityFilter {
    showHidden: BooleanFilter
}

export interface AssetFilter {
    showHidden: BooleanFilter
}

export type BooleanFilter = {
    type: 'boolean'
    active: boolean
    value: boolean
}

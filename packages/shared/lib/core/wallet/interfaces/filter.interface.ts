export type Filter = ActivityFilter | AssetFilter

export interface ActivityFilter {
    showHidden: BooleanFilter
}

export interface AssetFilter {
    showHidden: BooleanFilter
}

export type ValueFilter = BooleanFilter

export type BooleanFilter = {
    type: 'boolean'
    active: boolean
    label: string
}

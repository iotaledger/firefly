export type Filter = ActivityFilter | AssetFilter

export interface ActivityFilter {
    showHidden: BooleanFilterUnit
}

export interface AssetFilter {
    showHidden: BooleanFilterUnit
}

export type FilterUnit = BooleanFilterUnit

export type BooleanFilterUnit = {
    type: 'boolean'
    active: boolean
    label: string
}

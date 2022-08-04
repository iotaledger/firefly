export type Filter = ActivityFilter | AssetFilter

export interface ActivityFilter {
    showHidden: BooleanFilterUnit
}

export interface AssetFilter {
    showHidden: BooleanFilterUnit
    verificationStatus: SelectionFilterUnit
}

export type FilterUnit = BooleanFilterUnit | SelectionFilterUnit

export type BooleanFilterUnit = {
    type: 'boolean'
    active: boolean
    localeKey: string
}

export type SelectionFilterUnit = {
    type: 'selection'
    active: boolean
    choices: string[]
    selected: string
    localeKey: string
}

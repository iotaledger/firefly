export type Filter = ActivityFilter | AssetFilter

export interface ActivityFilter {
    showHidden: BooleanFilterUnit
}

export interface AssetFilter {
    showHidden: BooleanFilterUnit
}

export type FilterUnit = BooleanFilterUnit | SelectionFilterUnit

export type BooleanFilterUnit = {
    type: 'boolean'
    active: boolean
    label: string
}

export type SelectionFilterUnit = {
    type: 'selection'
    active: boolean
    label: string
    choices: string[]
    selected: string
    translationPrefix: string
}

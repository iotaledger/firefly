export type Filter = ActivityFilter | AssetFilter

export interface ActivityFilter {
    amount: NumberFilterUnit
    showHidden: BooleanFilterUnit
}

export interface AssetFilter {
    verificationStatus: SelectionFilterUnit
    showHidden: BooleanFilterUnit
}

export type FilterUnit = BooleanFilterUnit | SelectionFilterUnit | NumberFilterUnit

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

export type NumberFilterUnit = {
    type: 'number'
    active: boolean
    localeKey: string
    selected: NumberFilterType
    choices: NumberFilterType[]
    subunit: NumberFilterInput
}

export type NumberFilterInput = SingleNumberFilterInput | RangeNumberFilterInput

export type SingleNumberFilterInput = {
    type: 'single'
    amount: string
}

export type RangeNumberFilterInput = {
    type: 'range'
    start: string
    end: string
}

export enum NumberFilterType {
    Equal = 'equal',
    Range = 'range',
    Less = 'less',
    Greater = 'greater',
}

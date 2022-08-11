export type Filter = ActivityFilter | AssetFilter

export interface ActivityFilter {
    amount: NumberFilterUnit
    status: SelectionFilterUnit
    type: SelectionFilterUnit
    asset: AssetFilterUnit
    showRejected: SelectionFilterUnit
    showHidden: SelectionFilterUnit
}

export interface AssetFilter {
    verificationStatus: SelectionFilterUnit
    showHidden: SelectionFilterUnit
}

export type FilterUnit = SelectionFilterUnit | NumberFilterUnit | AssetFilterUnit

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

export enum BooleanFilterOptions {
    Yes = 'yes',
    No = 'no',
}

export type AssetFilterUnit = {
    type: 'asset'
    active: boolean
    localeKey: string
    selected: string
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

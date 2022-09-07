import { NumberFilterOption, DateFilterOption } from '../enums'

export type Filter = ActivityFilter | AssetFilter

export interface ActivityFilter {
    amount: NumberFilterUnit
    status: SelectionFilterUnit
    type: SelectionFilterUnit
    asset: AssetFilterUnit
    date: DateFilterUnit
    showRejected: SelectionFilterUnit
    showHidden: SelectionFilterUnit
}

export interface AssetFilter {
    verificationStatus: SelectionFilterUnit
    showHidden: SelectionFilterUnit
}

export type FilterUnit = SelectionFilterUnit | NumberFilterUnit | AssetFilterUnit | DateFilterUnit

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

export type DateFilterUnit = {
    type: 'date'
    active: boolean
    choices: DateFilterOption[]
    selected: DateFilterOption
    localeKey: string
    subunit: DateFilterInput
}

export type NumberFilterUnit = {
    type: 'number'
    active: boolean
    localeKey: string
    selected: NumberFilterOption
    choices: NumberFilterOption[]
    subunit: NumberFilterInput
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

export type DateFilterInput = SingleDateFilterInput | RangeDateFilterInput | UnitDateFilterInput

export type SingleDateFilterInput = {
    type: 'single'
    value: string
}

export type UnitDateFilterInput = {
    type: 'unit'
    amount: string
    unit: 'hours' | 'days' | 'months' | 'years'
}

export type RangeDateFilterInput = {
    type: 'range'
    start: string
    end: string
}

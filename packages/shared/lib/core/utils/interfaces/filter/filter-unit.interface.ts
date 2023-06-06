import { DateFilterOption, NumberFilterOption, OrderOption } from '@core/utils/enums/filters'
import { DateFilterInput } from './date-filter-input.interface'
import { NumberFilterInput } from './number-filter-input.interface'

export type FilterUnit =
    | SelectionFilterUnit
    | NumberFilterUnit
    | AssetFilterUnit
    | DateFilterUnit
    | OrderFilterUnit
    | NetworkFilterUnit

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
    labelKey?: string
    localeKey: string
}

export type OrderFilterUnit = {
    type: 'order'
    active: boolean
    choices: string[]
    ascDesc: OrderOption
    selected: string
    labelKey?: string
    localeKey: string
}

export type DateFilterUnit = {
    type: 'date'
    active: boolean
    choices: DateFilterOption[]
    selected: DateFilterOption
    labelKey?: string
    localeKey: string
    subunit: DateFilterInput
}

export type NumberFilterUnit = {
    type: 'number'
    active: boolean
    labelKey?: string
    localeKey: string
    selected: NumberFilterOption
    choices: NumberFilterOption[]
    subunit: NumberFilterInput
}

export type AssetFilterUnit = {
    type: 'asset'
    active: boolean
    labelKey?: string
    localeKey: string
    selected: string
}

export type NetworkFilterUnit = {
    type: 'network'
    active: boolean
    labelKey?: string
    localeKey: string
    selected: number
}

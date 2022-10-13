import { NumberFilterOption, DateFilterOption, OrderOption } from '../../enums'
import { DateFilterInput } from './date-filter-input.interface'
import { NumberFilterInput } from './number-filter-input.interface'

export type FilterUnit = SelectionFilterUnit | NumberFilterUnit | AssetFilterUnit | DateFilterUnit | OrderFilterUnit

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

export type OrderFilterUnit = {
    type: 'order'
    active: boolean
    choices: string[]
    ascDesc: OrderOption.Asc
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

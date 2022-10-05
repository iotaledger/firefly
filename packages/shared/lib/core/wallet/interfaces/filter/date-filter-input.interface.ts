import { DateUnit } from '@core/wallet/enums'

export type DateFilterInput = SingleDateFilterInput | RangeDateFilterInput | UnitDateFilterInput

export type SingleDateFilterInput = {
    type: 'single'
    value: string
}

export type UnitDateFilterInput = {
    type: 'unit'
    amount: string
    unit: DateUnit
}

export type RangeDateFilterInput = {
    type: 'range'
    start: string
    end: string
}

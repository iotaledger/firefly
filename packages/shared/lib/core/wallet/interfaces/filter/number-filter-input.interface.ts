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

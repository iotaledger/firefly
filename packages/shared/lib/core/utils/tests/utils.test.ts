import '@mocks/i18n.mock'

import { range } from '@core/utils'

type Simple = {
    prop1?: string
    prop2?: string
    flag1?: boolean
    flag2?: boolean
}

type Data =
    | {
          path: string
          simple1?: Simple
          simple2?: Simple
      }
    | Simple[]

type Complex = {
    id: string
    data?: Data
}

describe('File: utils.ts', () => {
    describe('Function: range', () => {
        it('should create ranges from valid arguments', () => {
            expect(range(0)).toEqual([])
            expect(range(1)).toEqual([0])
            expect(range(1, 1)).toEqual([1])
            expect(range(10, 10)).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
            expect(range(10, -10)).toEqual([-10, -9, -8, -7, -6, -5, -4, -3, -2, -1])
        })
        it('should create empty ranges from invalid arguments', () => {
            // @ts-ignore
            expect(range(2, 'string')).toEqual([0, 1])
            expect(range(undefined)).toEqual([])
            expect(range(undefined, undefined)).toEqual([])
            expect(range(1, null)).toEqual([0])
            expect(range(-1)).toEqual([])
            expect(range(-1, 1)).toEqual([])
            expect(range(undefined, 1)).toEqual([])
        })
    })
})

import '@mocks/i18n.mock'
import type { AnswerStatus } from '@iota/sdk/out/types'

import { getPercentagesFromAnswerStatuses } from '../getPercentagesFromAnswerStatuses'

describe('File: getPercentagesFromAnswerStatuses.ts', () => {
    describe('Function: getPercentagesFromAnswerStatuses', () => {
        const ANSWER_STATUSES: AnswerStatus[] = [
            {
                value: 0,
                current: 0,
                accumulated: 1000,
            },
            {
                value: 1,
                current: 0,
                accumulated: 2000,
            },
            {
                value: 2,
                current: 0,
                accumulated: 3000,
            },
        ]

        it('should return percentages from valid arguments', () => {
            expect(getPercentagesFromAnswerStatuses(ANSWER_STATUSES)).toEqual({ 0: '16.7%', 1: '33.3%', 2: '50%' })
        })
        it('should return empty object from invalid arguments', () => {
            expect(getPercentagesFromAnswerStatuses([{} as AnswerStatus])).toEqual({})
        })
        it('should return empty object from empty arguments', () => {
            expect(getPercentagesFromAnswerStatuses([])).toEqual({})
        })
    })
})

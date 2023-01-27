import '@mocks/i18n.mock'
import type { AnswerStatus } from '@iota/wallet'

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
            expect(getPercentagesFromAnswerStatuses(ANSWER_STATUSES)).toEqual({ 0: '17%', 1: '33%', 2: '50%' })
        })
        it('should return undefined from invalid arguments', () => {
            expect(getPercentagesFromAnswerStatuses([{} as AnswerStatus])).toBeUndefined()
        })
        it('should return undefined from empty arguments', () => {
            expect(getPercentagesFromAnswerStatuses([])).toBeUndefined()
        })
    })
})

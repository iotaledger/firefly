import { round } from '@core/utils/number'
import type { AnswerStatus } from '@iota/sdk/out/types'
import { IProposalAnswerPercentages } from '../interfaces'

export function getPercentagesFromAnswerStatuses(answerStatuses: AnswerStatus[]): IProposalAnswerPercentages {
    const totalVotes = answerStatuses?.reduce((acc, answerStatus) => acc + answerStatus.accumulated, 0) ?? 0
    if (totalVotes === 0 || Number.isNaN(totalVotes)) {
        return {}
    }

    let percentages: IProposalAnswerPercentages = {}
    answerStatuses.forEach((answerStatus) => {
        if (answerStatus.value !== undefined) {
            const divisionResult = (answerStatus.accumulated ?? 0) / totalVotes
            percentages = {
                ...percentages,
                [answerStatus.value]: Number.isNaN(divisionResult) ? '0%' : `${round(divisionResult * 100, 1)}%`,
            }
        }
    })

    return percentages
}

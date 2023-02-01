import type { AnswerStatus } from '@iota/wallet/out/types'
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
                [answerStatus.value]: Number.isNaN(divisionResult) ? '0%' : `${Math.round(divisionResult * 100)}%`,
            }
        }
    })

    return percentages
}

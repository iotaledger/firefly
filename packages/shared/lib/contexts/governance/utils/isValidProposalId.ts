import { PROPOSAL_ID_REGEX } from '../constants'

export function isValidProposalId(id: string): boolean {
    return PROPOSAL_ID_REGEX.test(id)
}

import { openPopup } from '@auxiliary/popup/actions'
import { isValidUrl } from '@core/utils/validation'

import { isValidProposalId } from '@contexts/governance/utils'

import { RegisterProposalOperationParameter } from '../../../enums'

export function handleDeepLinkRegisterProposalOperation(searchParams: URLSearchParams): void {
    const eventId = searchParams.get(RegisterProposalOperationParameter.EventId)
    if (!isValidProposalId(eventId)) {
        throw new Error('Invalid proposal ID')
    }

    const nodeUrl = searchParams.get(RegisterProposalOperationParameter.NodeUrl)
    if (!isValidUrl(nodeUrl)) {
        throw new Error('Invalid node URL')
    }

    openPopup({
        type: 'registerProposal',
        props: { eventId, nodeUrl },
    })
}

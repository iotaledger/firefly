import { showAppNotification } from '@auxiliary/notification/actions'
import { closePopup, openPopup } from '@auxiliary/popup/actions'
import { isValidUrl } from '@core/utils/validation'
import { isProposalAlreadyRegistered, isValidProposalId } from '@contexts/governance/utils'

import { RegisterProposalOperationParameter } from '../../../enums'

export function handleDeepLinkRegisterProposalOperation(searchParams: URLSearchParams): void {
    const eventId = searchParams.get(RegisterProposalOperationParameter.EventId)
    if (!isValidProposalId(eventId)) {
        throw new Error('Invalid proposal ID')
    } else if (isProposalAlreadyRegistered(eventId)) {
        /**
         * NOTE: If we throw an error as normal, it will be handled and displayed in the "failed link"
         * popup.
         */
        showAppNotification({
            type: 'warning',
            alert: true,
            message: 'This proposal has already been registered',
        })
        closePopup()
        return
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

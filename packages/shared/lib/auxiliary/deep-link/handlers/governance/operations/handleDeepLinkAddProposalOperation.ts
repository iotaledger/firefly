import { showAppNotification } from '@auxiliary/notification/actions'
import { closePopup, openPopup } from '@auxiliary/popup/actions'
import { isValidUrl } from '@core/utils/validation'
import { isProposalAlreadyAdded, isValidProposalId } from '@contexts/governance/utils'

import { AddProposalOperationParameter } from '../../../enums'

export function handleDeepLinkAddProposalOperation(searchParams: URLSearchParams): void {
    const eventId = searchParams.get(AddProposalOperationParameter.EventId)
    if (!isValidProposalId(eventId)) {
        throw new Error('Invalid proposal ID')
    } else if (isProposalAlreadyAdded(eventId)) {
        /**
         * NOTE: If we throw an error as normal, it will be handled and displayed in the "failed link"
         * popup.
         */
        showAppNotification({
            type: 'warning',
            alert: true,
            message: 'This proposal has already been added',
        })
        closePopup()
        return
    }

    const nodeUrl = searchParams.get(AddProposalOperationParameter.NodeUrl)
    if (!isValidUrl(nodeUrl)) {
        throw new Error('Invalid node URL')
    }

    openPopup({
        type: 'addProposal',
        props: { eventId, nodeUrl },
    })
}

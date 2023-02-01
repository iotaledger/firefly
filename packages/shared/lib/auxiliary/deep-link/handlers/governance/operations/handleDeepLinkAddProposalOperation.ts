import { showAppNotification } from '@auxiliary/notification/actions'
import { closePopup, openPopup } from '@auxiliary/popup/actions'
import { isValidUrl } from '@core/utils/validation'
import { getProposalFromEventId, isProposalAlreadyAdded, isValidProposalId } from '@contexts/governance/utils'

import { AddProposalOperationParameter } from '../../../enums'
import { selectedProposal } from '@contexts/governance/stores'
import { governanceRoute, GovernanceRoute, governanceRouter } from '@core/router'
import { get } from 'svelte/store'
import { selectedAccount } from '@core/account'

export function handleDeepLinkAddProposalOperation(searchParams: URLSearchParams): void {
    const eventId = searchParams.get(AddProposalOperationParameter.EventId)
    if (!isValidProposalId(eventId)) {
        throw new Error('Invalid proposal ID')
    } else if (isProposalAlreadyAdded(eventId)) {
        /**
         * NOTE: If we throw an error as normal, it will be handled and displayed in the "failed link"
         * popup.
         */
        getProposalFromEventId(eventId, get(selectedAccount)).then((proposal) => {
            if (get(selectedProposal)?.id !== eventId) {
                selectedProposal.set(proposal)
            }
            if (get(governanceRoute) !== GovernanceRoute.Details) {
                get(governanceRouter).goTo(GovernanceRoute.Details)
            }
        })
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

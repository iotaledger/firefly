import { showAppNotification } from '@auxiliary/notification/actions'
import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
import { isValidUrl } from '@core/utils/validation'
import { isProposalAlreadyAddedForSelectedWallet, isValidProposalId } from '@contexts/governance/utils'
import { AddProposalOperationParameter } from '../../../enums'
import { registeredProposalsForSelectedWallet, selectedProposalId } from '@contexts/governance/stores'
import { GovernanceRoute, governanceRouter } from '@core/router'
import { get } from 'svelte/store'

/**
 * NOTE: If we throw an error as normal, it will be handled and displayed in the "failed link"
 * popup.
 */
export function handleDeepLinkAddProposalOperation(searchParams: URLSearchParams): void {
    const eventId = searchParams.get(AddProposalOperationParameter.EventId)
    if (!isValidProposalId(eventId)) {
        throw new Error('Invalid proposal ID')
    } else if (isProposalAlreadyAddedForSelectedWallet(eventId)) {
        const proposal = get(registeredProposalsForSelectedWallet)[eventId]
        if (proposal === undefined) {
            throw new Error(`Event with id ${eventId} not found`)
        } else {
            selectedProposalId.set(eventId)
            get(governanceRouter).goTo(GovernanceRoute.Details)

            showAppNotification({
                type: 'warning',
                alert: true,
                message: 'This proposal has already been added',
            })
            closePopup()
            return
        }
    }

    const nodeUrl = searchParams.get(AddProposalOperationParameter.NodeUrl)
    if (!isValidUrl(nodeUrl)) {
        throw new Error('Invalid node URL')
    }

    openPopup({
        id: PopupId.AddProposal,
        props: { eventId, nodeUrl },
    })
}

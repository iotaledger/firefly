import { openPopup } from '@auxiliary/popup/actions'
import { addError } from '@core/error/stores'
import { localize } from '@core/i18n'

import { URL_CLEANUP_REGEX } from '../../constants'
import { GovernanceOperation } from '../../enums'
import { handleDeepLinkRegisterProposalOperation } from './operations'

export function handleDeepLinkGovernanceContext(url: URL): void {
    const pathnameParts = url.pathname.replace(URL_CLEANUP_REGEX, '').split('/')
    try {
        if (pathnameParts.length === 0 || !pathnameParts[0]) {
            throw new Error('No operation specified in the URL')
        }
        switch (pathnameParts[0]) {
            case GovernanceOperation.RegisterProposal:
                handleDeepLinkRegisterProposalOperation(url.searchParams)
                break
            default: {
                throw new Error(
                    localize('notifications.deepLinkingRequest.governance.unrecognizedOperation', {
                        values: { operation: pathnameParts[0] },
                    })
                )
            }
        }
    } catch (err) {
        openPopup({
            type: 'deepLinkError',
            props: { error: err, url },
        })
        addError({ time: Date.now(), type: 'deepLink', message: `Error handling deep link. ${err.message}` })
    }
}

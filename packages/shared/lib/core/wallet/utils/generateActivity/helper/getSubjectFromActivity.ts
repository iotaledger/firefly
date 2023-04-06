import { localize } from '@core/i18n'
import { truncateString } from '@core/utils'
import { ActivityType } from '@core/wallet/enums'
import type { Activity, Subject } from '@core/wallet/types'

export function getSubjectFromActivity(activity: Activity): Subject {
    if (activity.parsedLayer2Metadata) {
        return {
            ...activity.subject,
            ...(activity.subject?.type === 'address' && {
                address: activity.parsedLayer2Metadata?.ethereumAddress,
            }),
        }
    } else {
        return activity.subject
    }
}

export function getSubjectLocaleFromActivity(activity: Activity): string {
    const { subject } = activity

    if (activity.type === ActivityType.Basic && activity?.isShimmerClaiming) {
        return localize('general.shimmerGenesis')
    } else if (subject?.type === 'account') {
        return truncateString(subject?.account?.name, 13, 0)
    } else if (subject?.type === 'address') {
        const address = activity?.parsedLayer2Metadata?.ethereumAddress ?? subject?.address
        return truncateString(address, 6, 6)
    } else if (subject?.type === 'network') {
        return subject?.network
    } else {
        return localize('general.unknownAddress')
    }
}

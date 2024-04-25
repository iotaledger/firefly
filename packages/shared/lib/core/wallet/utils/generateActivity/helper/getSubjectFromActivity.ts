import { localize } from '@core/i18n'
import { getLayer2NetworkFromAddress } from '@core/layer-2/utils'
import { truncateString } from '@core/utils'
import { ActivityType, SubjectType } from '@core/wallet/enums'
import type { Activity, Subject } from '@core/wallet/types'

export function getSubjectFromActivity(activity: Activity): Subject {
    if (activity.parsedLayer2Metadata) {
        return {
            ...activity.subject,
            ...(activity.subject?.type === SubjectType.Address && {
                address: activity.parsedLayer2Metadata?.ethereumAddress,
            }),
        }
    } else if (activity.subject?.type === SubjectType.Address) {
        const network = getLayer2NetworkFromAddress(activity.subject.address)
        return { ...activity.subject, address: network ?? activity.subject.address }
    } else {
        return activity.subject
    }
}

export function getSubjectLocaleFromActivity(activity: Activity): string {
    const { subject } = activity
    if (activity.type === ActivityType.Basic && activity?.isShimmerClaiming) {
        return localize('general.shimmerGenesis')
    } else if (activity.type === ActivityType.Vesting) {
        return localize('general.stardustGenesis')
    } else if (subject?.type === SubjectType.Wallet) {
        return truncateString(activity?.address, 8, 6)
    } else if (subject?.type === SubjectType.Address) {
        const address = activity?.parsedLayer2Metadata?.ethereumAddress ?? subject?.address
        const network = getLayer2NetworkFromAddress(address)

        return network ?? truncateString(address, 6, 6)
    } else {
        return localize('general.unknownAddress')
    }
}

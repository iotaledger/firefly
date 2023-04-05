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

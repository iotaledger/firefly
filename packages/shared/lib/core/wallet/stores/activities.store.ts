import { selectedAccount } from '@core/account'
import { derived, Readable, writable, Writable } from 'svelte/store'
import { getAccountMessages } from '@lib/wallet'
import { parseTransactionsToActivities } from '../utils'
import { getMonthYear } from '@lib/utils'
import { Transaction } from '@lib/typings/message'
import { AccountMessage } from '@lib/typings/wallet'
import { localize } from '@core/i18n'
import { IActivity } from '../interfaces/activity.interface'

export const activities: Readable<IActivity[]> = derived(
    [selectedAccount],
    // ([$selectedAccount]) => parseTransactionsToActivities(getAccountMessages($selectedAccount))
    ([$selectedAccount]) => {
        const transactions = [
            {
                id: '1',
                version: 1,
                confirmed: true,
                parents: [''],
                payloadLength: 123,
                timestamp: '1653323657103',
                nonce: 123123,
                account: 1,
                payload: {
                    type: 'Transaction',
                    data: {
                        essence: {
                            type: 'Regular',
                            data: {
                                inputs: undefined,
                                outputs: [
                                    {
                                        type: 'SignatureLockedSingle',
                                        data: {
                                            address: 'atoi897asd98asd897as87d97687asd876asd876',
                                            amount: 123123,
                                            remainder: true,
                                        },
                                    },
                                ],
                                incoming: true,
                                internal: false,
                                value: 123123,
                                remainderValue: 123123,
                            },
                        },
                        unlock_blocks: [
                            {
                                type: 'Signature',
                                data: {
                                    type: 'Ed25519',
                                    data: {
                                        public_key: [1, 2],
                                        signature: [2, 2],
                                    },
                                },
                            },
                        ],
                    },
                } as Transaction,
                broadcasted: true,
            } as AccountMessage,
            {
                id: '2',
                version: 1,
                confirmed: true,
                parents: [''],
                payloadLength: 123,
                timestamp: '1553323657103',
                nonce: 123123,
                account: 1,
                payload: {
                    type: 'Transaction',
                    data: {
                        essence: {
                            type: 'Regular',
                            data: {
                                inputs: undefined,
                                outputs: [
                                    {
                                        type: 'SignatureLockedSingle',
                                        data: {
                                            address: 'atoi897asd98asd897as87d97687asd876asd876',
                                            amount: 123123,
                                            remainder: true,
                                        },
                                    },
                                ],
                                incoming: false,
                                internal: false,
                                value: 123123,
                                remainderValue: 123123,
                            },
                        },
                        unlock_blocks: [
                            {
                                type: 'Signature',
                                data: {
                                    type: 'Ed25519',
                                    data: {
                                        public_key: [1, 2],
                                        signature: [2, 2],
                                    },
                                },
                            },
                        ],
                    },
                } as Transaction,
                broadcasted: true,
            } as AccountMessage,
            {
                id: '3',
                version: 1,
                confirmed: true,
                parents: [''],
                payloadLength: 123,
                timestamp: '1653123657103',
                nonce: 123123,
                account: 1,
                payload: {
                    type: 'Transaction',
                    data: {
                        essence: {
                            type: 'Regular',
                            data: {
                                inputs: undefined,
                                outputs: [
                                    {
                                        type: 'SignatureLockedSingle',
                                        data: {
                                            address: 'atoi897asd98asd897as87d97687asd876asd876',
                                            amount: 123123,
                                            remainder: true,
                                        },
                                    },
                                ],
                                incoming: false,
                                internal: true,
                                value: 123123,
                                remainderValue: 123123,
                            },
                        },
                        unlock_blocks: [
                            {
                                type: 'Signature',
                                data: {
                                    type: 'Ed25519',
                                    data: {
                                        public_key: [1, 2],
                                        signature: [2, 2],
                                    },
                                },
                            },
                        ],
                    },
                } as Transaction,
                broadcasted: true,
            } as AccountMessage,
        ]
        return parseTransactionsToActivities(transactions)
    }
)

export const queriedActivities: Writable<IActivity[]> = writable([])

interface GroupedActivity {
    date: string
    activities: IActivity[]
}

export const groupedActivities: Readable<GroupedActivity[]> = derived([queriedActivities], ([$queriedActivities]) => {
    const groupedActivities: GroupedActivity[] = []
    for (const activity of $queriedActivities) {
        const activityDate = getActivityGroupTitleForTimestamp(activity.timestamp)
        if (!groupedActivities.some((group) => group.date === activityDate)) {
            groupedActivities.push({ date: activityDate, activities: [] })
        }
        const index = groupedActivities.findIndex((group) => group.date === activityDate)
        groupedActivities[index].activities.push(activity)
    }
    return groupedActivities
})

function getActivityGroupTitleForTimestamp(timestamp): string {
    const dateString = getMonthYear(new Date(Number(timestamp)))
    return dateString === getMonthYear(new Date()) ? localize('general.thisMonth') : dateString
}

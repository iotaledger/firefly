import { selectedAccount } from '@core/account'
import { derived, Readable, writable, Writable } from 'svelte/store'
import { getMonthYear } from '@lib/utils'
import { Transaction } from '@lib/typings/message'
import { AccountMessage } from '@lib/typings/wallet'
import { localize } from '@core/i18n'
import { Activity } from '../'

export const activities: Readable<Activity[]> = derived(
    [selectedAccount],
    // ([$selectedAccount]) => getAccountMessages($selectedAccount).map((transaction) => new Activity(transaction))
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
        return transactions.map((transaction) => new Activity(transaction))
    }
)

export const queriedActivities: Writable<Activity[]> = writable([])

interface GroupedActivity {
    date: string
    activities: Activity[]
}

export const groupedActivities: Readable<GroupedActivity[]> = derived([queriedActivities], ([$queriedActivities]) => {
    const groupedActivities: GroupedActivity[] = []
    for (const activity of $queriedActivities) {
        const activityDate = getActivityGroupTitleForTimestamp(activity.time)
        if (!groupedActivities.some((group) => group.date === activityDate)) {
            groupedActivities.push({ date: activityDate, activities: [] })
        }
        const index = groupedActivities.findIndex((group) => group.date === activityDate)
        groupedActivities[index].activities.push(activity)
    }
    return groupedActivities
})

function getActivityGroupTitleForTimestamp(time: Date): string {
    const dateString = getMonthYear(time)
    return dateString === getMonthYear(new Date()) ? localize('general.thisMonth') : dateString
}

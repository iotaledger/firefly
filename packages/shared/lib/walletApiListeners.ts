import { localize } from '@core/i18n'
import { formatUnitBestMatch } from 'shared/lib/units'
import {
    aggregateAccountActivity,
    api,
    formatAccountWithMetadata,
    getAccountMetadataWithCallback,
    processMigratedTransactions,
    replaceMessage,
    saveNewMessage,
    transferState,
    updateBalanceOverview,
    wallet,
} from 'shared/lib/wallet'
import { get } from 'svelte/store'
import { showAppNotification, showSystemNotification } from './notifications'
import { ASSEMBLY_EVENT_ID } from './participation'
import { getParticipationOverview } from './participation/api'
import {
    getPendingParticipation,
    hasPendingParticipation,
    isChangingParticipation,
    removePendingParticipations,
} from './participation/stores'
// PARTICIPATION
import { ParticipationAction, PendingParticipation } from './participation/types'
import { closePopup, openPopup, popupState } from './popup'
import { isStrongholdLocked, updateProfile } from './profile'
import type { Message } from './typings/message'
import type { WalletAccount } from './typings/wallet'

/**
 * Initialises event listeners from wallet library
 *
 * @method initialiseListeners
 *
 * @returns {void}
 */
export const initialiseListeners = (): void => {
    /**
     * Event listener for stronghold status change
     */
    api.onStrongholdStatusChange({
        onSuccess(response) {
            isStrongholdLocked.set(response.payload.snapshot.status === 'Locked')
        },
        onError(error) {
            console.error(error)
        },
    })

    /**
     * Event listener for new message event
     */
    api.onNewTransaction({
        onSuccess(response) {
            const { balanceOverview, accounts } = get(wallet)
            const { accountId, message } = response.payload
            const account = get(accounts).find((account) => account.id === accountId)
            if (!account || !message) return

            if (message.payload.type === 'Transaction') {
                const { essence } = message.payload.data

                if (!essence.data.internal) {
                    const overview = get(balanceOverview)

                    const incoming = essence.data.incoming
                        ? overview.incomingRaw + essence.data.value
                        : overview.incomingRaw
                    const outgoing = essence.data.incoming
                        ? overview.outgoingRaw
                        : overview.outgoingRaw + essence.data.value

                    updateBalanceOverview(overview.balanceRaw, incoming, outgoing)
                }

                // Update account with new message
                saveNewMessage(accountId, message)

                const notificationMessage = localize('notifications.valueTx')
                    .replace('{{value}}', formatUnitBestMatch(message?.payload.data.essence.data.value, true, 3))
                    .replace('{{account}}', account?.alias)

                showSystemNotification({
                    type: 'info',
                    message: notificationMessage,
                    contextData: { type: 'valueTx', accountId },
                })
            } else if (message.payload.type === 'Milestone') {
                // Update account with new message
                saveNewMessage(accountId, message)
                processMigratedTransactions(
                    accountId,
                    [message],

                    // New transaction will only emit an event for fluid migrations
                    []
                )
            }
        },
        onError(error) {
            console.error(error)
        },
    })

    /**
     * Event listener for transfer confirmation state change
     */
    api.onConfirmationStateChange({
        async onSuccess(response) {
            const { accounts } = get(wallet)
            const { message } = response.payload

            // Checks if this was a message sent for participating in an event
            if (hasPendingParticipation(message.id)) {
                // Instantly pull in latest participation overview.
                await getParticipationOverview(ASSEMBLY_EVENT_ID)

                // If it is a message related to any participation event, display a notification and close any open participation popup
                // except for unvote for when the user is changing the vote (automatic unvote & vote)
                if (
                    !get(isChangingParticipation) ||
                    (get(isChangingParticipation) &&
                        getPendingParticipation(message.id)?.action !== ParticipationAction.Unvote)
                ) {
                    isChangingParticipation.set(false)
                    displayParticipationNotification(getPendingParticipation(message.id))
                }
                if (get(popupState).type === 'stakingManager') {
                    closePopup()
                }

                // Remove the pending participation from local store
                removePendingParticipations([message.id])
            }

            if (message.payload.type === 'Transaction') {
                const { confirmed } = response.payload
                const { essence } = message.payload.data

                let account1
                let account2

                const { internalTransfersInProgress } = get(wallet)
                const transfers = get(internalTransfersInProgress)

                // Are we tracking an internal transfer for this message id
                if (transfers[message.id]) {
                    account1 = get(accounts).find((account) => account.id === transfers[message.id].from)
                    account2 = get(accounts).find((account) => account.id === transfers[message.id].to)
                    internalTransfersInProgress.update((transfers) => {
                        delete transfers[message.id]
                        return transfers
                    })
                } else {
                    account1 = get(accounts).find((account) => account.id === response.payload.accountId)
                }

                // If this is a confirmation of a regular transfer update the balance overview
                if (confirmed && !essence.data.internal) {
                    const { balanceOverview } = get(wallet)
                    const overview = get(balanceOverview)

                    const incoming = essence.data.incoming
                        ? overview.incomingRaw + essence.data.value
                        : overview.incomingRaw
                    const outgoing = essence.data.incoming
                        ? overview.outgoingRaw
                        : overview.outgoingRaw + essence.data.value

                    updateBalanceOverview(overview.balanceRaw, incoming, outgoing)
                }

                // Update the confirmation state of all messages with this id
                const confirmationChanged = updateAllMessagesState(accounts, message.id, response.payload.confirmed)

                // If the state has changed then display a notification
                // but only for transactions not migrations
                if (confirmationChanged && message.payload.type === 'Transaction') {
                    const tx = message.payload
                    const messageKey = confirmed ? 'confirmed' : 'failed'

                    const _notify = (accountTo: string | null = null) => {
                        let notificationMessage

                        if (accountTo) {
                            notificationMessage = localize(`notifications.${messageKey}Internal`)
                                .replace('{{value}}', formatUnitBestMatch(tx.data.essence.data.value, true, 3))
                                .replace('{{senderAccount}}', account1.alias)
                                .replace('{{receiverAccount}}', accountTo)
                        } else {
                            if (essence.data.internal && confirmed) {
                                // If this is a confirmed internal message but we don't
                                // have the account info it is most likely that someone logged
                                // out before an internal transfer completed so the internalTransfersInProgress
                                // was wiped, display the anonymous account message instead
                                notificationMessage = localize('notifications.confirmedInternalNoAccounts').replace(
                                    '{{value}}',
                                    formatUnitBestMatch(tx.data.essence.data.value, true, 3)
                                )
                            } else {
                                notificationMessage = localize(`notifications.${messageKey}`)
                                    .replace('{{value}}', formatUnitBestMatch(tx.data.essence.data.value, true, 3))
                                    .replace('{{account}}', account1.alias)
                            }
                        }

                        showSystemNotification({
                            type: 'info',
                            message: notificationMessage,
                            contextData: { type: messageKey, accountId: account1.id },
                        })
                    }

                    // If this event is emitted because a message failed, then this message will only exist on the sender account
                    // Therefore, show the notification (no need to group).
                    if (!confirmed) {
                        _notify()
                    } else {
                        // If we have 2 accounts this was an internal transfer
                        if (account1 && account2) {
                            _notify(account2.alias)
                        } else {
                            _notify()
                        }
                    }
                }
            }
        },
        onError(error) {
            console.error(error)
        },
    })

    /**
     * Event listener for balance change event
     */
    api.onBalanceChange({
        onSuccess(response) {
            const {
                payload: { messageId },
            } = response

            // TODO(laumair): Some parts of this logic are duplicated from when we initially fetch all accounts;
            // Make sure this is refactored

            // On balance change event, get the updated account objects from wallet-rs db
            api.getAccounts({
                onSuccess(response) {
                    const { accounts } = get(wallet)

                    const totalBalance = {
                        balance: 0,
                        incoming: 0,
                        outgoing: 0,
                    }

                    const updatedAccounts = []

                    get(accounts).forEach((account, idx) => {
                        getAccountMetadataWithCallback(account?.id, (metaErr, meta) => {
                            if (metaErr) {
                                return
                            }

                            totalBalance.balance += meta.balance
                            totalBalance.incoming += meta.incoming
                            totalBalance.outgoing += meta.outgoing

                            aggregateAccountActivity(account)
                            const updatedAccountInfo = formatAccountWithMetadata(account, meta)

                            updatedAccounts.push(
                                account?.index === updatedAccountInfo?.index
                                    ? { ...updatedAccountInfo, alias: account?.alias }
                                    : account
                            )

                            if (idx === get(accounts).length - 1) {
                                accounts.update((_accounts) => updatedAccounts.sort((a, b) => a.index - b.index))

                                updateBalanceOverview(
                                    totalBalance.balance,
                                    totalBalance.incoming,
                                    totalBalance.outgoing
                                )
                            }
                        })
                    })
                },
                onError(response) {},
            })

            // Migration
            if (messageId === '0'.repeat(64)) {
                updateProfile('migratedTransactions', [])
            }
        },
        onError(error) {
            console.error(error)
        },
    })

    /**
     * Event listener for reattachment
     */
    api.onReattachment({
        onSuccess(response) {
            // Replace original message with reattachment
            replaceMessage(response.payload.accountId, response.payload.reattachedMessageId, response.payload.message)
        },
        onError(error) {
            console.error(error)
        },
    })

    /**
     * Event listener for transfer progress
     */
    api.onTransferProgress({
        onSuccess(response) {
            const { event } = response.payload
            if ('type' in event) {
                transferState.set({
                    type: event.type,
                    data: { ...event },
                })
            }
        },
        onError(error) {
            console.error(error)
        },
    })

    /**
     * Event listener for Ledger receive address generation
     */
    api.onLedgerAddressGeneration({
        onSuccess(response) {
            const { event } = response.payload
            openPopup({
                type: 'ledgerAddress',
                hideClose: true,
                preventClose: true,
                props: {
                    address: event.address,
                },
            })
        },
        onError(error) {
            console.error(error)
        },
    })
}

const updateAllMessagesState = (accounts, messageId, confirmation) => {
    let confirmationHasChanged = false

    accounts.update((storedAccounts) =>
        storedAccounts.map((storedAccount) =>
            Object.assign<WalletAccount, Partial<WalletAccount>, Partial<WalletAccount>>(
                {} as WalletAccount,
                storedAccount,
                {
                    messages: storedAccount.messages.map((_message: Message) => {
                        if (_message.id === messageId) {
                            confirmationHasChanged = _message.confirmed !== confirmation
                            _message.confirmed = confirmation
                        }
                        return _message
                    }),
                }
            )
        )
    )

    return confirmationHasChanged
}

/**
 * Displays participation (stake/unstake) notification
 *
 * @method displayParticipationNotification
 *
 * @param {PendingParticipation} pendingParticipation
 *
 * @return void
 */
export function displayParticipationNotification(pendingParticipation: PendingParticipation): void {
    if (pendingParticipation) {
        const { accounts } = get(wallet)
        const { action } = pendingParticipation
        const account = get(accounts).find((_account) => _account.id === pendingParticipation.accountId)
        let localeGroup
        let localeAction
        if (action === ParticipationAction.Stake || action === ParticipationAction.Unstake) {
            localeGroup = 'stakingManager'
            localeAction = action === ParticipationAction.Stake ? 'staked' : 'unstaked'
        } else if (action === ParticipationAction.Vote || action === ParticipationAction.Unvote) {
            localeGroup = 'governanceManager'
            localeAction = action === ParticipationAction.Vote ? 'voted' : 'unvoted'
        }
        showAppNotification({
            type: 'info',
            message: localize(`popups.${localeGroup}.${localeAction}Successfully`, {
                values: { account: account.alias },
            }),
        })
    }
}

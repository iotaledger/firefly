import { api, isTransferring, transferState, wallet } from './wallet'
import { checkStronghold } from '@lib/stronghold'
import { deepCopy } from '@lib/helpers'
import { Message, Transaction } from 'shared/lib/typings/message'
import { WalletAccount } from './typings/wallet'
import { TransferProgressEventType } from './typings/events'
import { clearSendParams } from './app'
import { showAppNotification } from './notifications'
import { localize } from '@core/i18n'
import { openPopup } from './popup'
import { get } from 'svelte/store'
import { isSoftwareProfile } from './profile'

export function sendExternalTransaction(senderAccountId: string, receiveAddress: string, amount: number): void {
    const { accounts } = get(wallet)

    const _send = () => {
        isTransferring.set(true)
        api.send(
            senderAccountId,
            {
                amount,
                address: receiveAddress,
                remainder_value_strategy: {
                    strategy: 'ChangeAddress',
                },
                indexation: { index: 'firefly', data: [] },
            },
            {
                onSuccess(response) {
                    accounts.update((_accounts) =>
                        _accounts?.map((_account) => {
                            if (_account.id === senderAccountId) {
                                return Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>(
                                    {} as WalletAccount,
                                    _account,
                                    {
                                        messages: [response.payload, ..._account.messages],
                                    }
                                )
                            }

                            return _account
                        })
                    )

                    transferState.set({
                        type: TransferProgressEventType.Complete,
                    })

                    setTimeout(() => {
                        clearSendParams()
                        isTransferring.set(false)
                    }, 3000)
                },
                onError(err) {
                    isTransferring.set(false)
                    showAppNotification({
                        type: 'error',
                        message: localize(err.error),
                    })
                },
            }
        )
    }

    if (get(isSoftwareProfile)) {
        checkStronghold(_send)
    } else {
        _send()
    }
}

export function sendInternalTransaction(
    senderAccountId: string,
    receiverAccountId: string,
    amount: number,
    internal: boolean
): void {
    const { accounts, internalTransfersInProgress } = get(wallet)

    const _internalTransfer = () => {
        isTransferring.set(true)
        api.internalTransfer(senderAccountId, receiverAccountId, amount, {
            onSuccess(response) {
                const message = response.payload
                internalTransfersInProgress.update((transfers) => {
                    transfers[message.id] = {
                        from: senderAccountId,
                        to: receiverAccountId,
                    }
                    return transfers
                })
                accounts.update((_accounts) =>
                    _accounts.map((_account) => {
                        if (_account.id === senderAccountId) {
                            const m = deepCopy(message) as Message
                            const mPayload = m.payload as Transaction
                            mPayload.data.essence.data.incoming = false
                            mPayload.data.essence.data.internal = true
                            _account.messages.push(m)
                        }
                        if (_account.id === receiverAccountId) {
                            const m = deepCopy(message) as Message
                            const mPayload = m.payload as Transaction
                            mPayload.data.essence.data.incoming = true
                            mPayload.data.essence.data.internal = true
                            _account.messages.push(m)
                        }
                        return _account
                    })
                )
                transferState.set({
                    type: TransferProgressEventType.Complete,
                })
                setTimeout(() => {
                    clearSendParams(internal)
                    isTransferring.set(false)
                }, 3000)
            },
            onError(err) {
                isTransferring.set(false)
                showAppNotification({
                    type: 'error',
                    message: localize(err.error),
                })
            },
        })
    }
    if (get(isSoftwareProfile)) {
        api.getStrongholdStatus({
            onSuccess(strongholdStatusResponse) {
                if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                    openPopup({ type: 'password', props: { onSuccess: _internalTransfer } })
                } else {
                    _internalTransfer()
                }
            },
            onError(error) {
                console.error(error)
            },
        })
    } else {
        _internalTransfer()
    }
}

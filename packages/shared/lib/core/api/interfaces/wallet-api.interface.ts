import { BridgeError, BridgeEvent } from '@core/actor'
import {
    BalanceChangeEventPayload,
    ConfirmationStateChangeEventPayload,
    LedgerAddressGenerationEventPayload,
    MigrationProgressEventPayload,
    ReattachmentEventPayload,
    TransactionEventPayload,
    TransferProgressEventPayload,
} from '@lib/typings/events'
import { Account, AccountIdentifier, AccountToCreate, Balance, SyncedAccount } from '@lib/typings/account'
import { Address } from '@lib/typings/address'
import { Duration, StrongholdStatus } from '@lib/typings/wallet'
import { Message } from '@lib/typings/message'
import { ClientOptions } from '@lib/typings/client'
import { NodeAuth, NodeInfo } from '@lib/typings/node'
import { AddressInput, MigrationBundle, MigrationData, SendMigrationBundleResponse } from '@lib/typings/migration'
import { GetMigrationAddressResponse } from '@core/actor'
import { LedgerStatus } from '@lib/typings/ledger'
import {
    ParticipateResponsePayload,
    Participation,
    ParticipationEvent,
    ParticipationOverviewResponse,
} from '@lib/participation/types'

export interface IWalletApi {
    generateMnemonic(callbacks: {
        onSuccess: (response: BridgeEvent<string>) => void
        onError: (err: BridgeError) => void
    })
    storeMnemonic(
        mnemonic: string,
        callbacks: { onSuccess: (response: BridgeEvent<string>) => void; onError: (err: BridgeError) => void }
    )
    verifyMnemonic(
        mnemonic: string,
        callbacks: { onSuccess: (response: BridgeEvent<string>) => void; onError: (err: BridgeError) => void }
    )
    getAccount(
        accountId: AccountIdentifier,
        callbacks: { onSuccess: (response: BridgeEvent<Account>) => void; onError: (err: BridgeError) => void }
    )
    getAccounts(callbacks: {
        onSuccess: (response: BridgeEvent<Account[]>) => void
        onError: (err: BridgeError) => void
    })
    getBalance(
        accountId: string,
        callbacks: { onSuccess: (response: BridgeEvent<Balance>) => void; onError: (err: BridgeError) => void }
    )
    latestAddress(
        accountId: string,
        callbacks: { onSuccess: (response: BridgeEvent<Address>) => void; onError: (err: BridgeError) => void }
    )
    areLatestAddressesUnused(callbacks: {
        onSuccess: (response: BridgeEvent<boolean>) => void
        onError: (err: BridgeError) => void
    })
    getUnusedAddress(
        accountId: string,
        callbacks: { onSuccess: (response: BridgeEvent<Address>) => void; onError: (err: BridgeError) => void }
    )
    getStrongholdStatus(callbacks: {
        onSuccess: (response: BridgeEvent<StrongholdStatus>) => void
        onError: (err: BridgeError) => void
    })
    syncAccounts(
        addressIndex: number,
        gapLimit: number,
        accountDiscoveryThreshold: number,
        callbacks: { onSuccess: (response: BridgeEvent<SyncedAccount[]>) => void; onError: (err: BridgeError) => void }
    )
    syncAccount(
        accountId: string,
        callbacks: { onSuccess: (response: BridgeEvent<void>) => void; onError: (err: BridgeError) => void }
    )
    startBackgroundSync(
        pollingInterval: Duration,
        automaticOutputConsolidation: boolean,
        callbacks: { onSuccess: (response: BridgeEvent<void>) => void; onError: (err: BridgeError) => void }
    )
    stopBackgroundSync(callbacks: {
        onSuccess: (response: BridgeEvent<void>) => void
        onError: (err: BridgeError) => void
    })
    createAccount(
        account: AccountToCreate,
        callbacks: { onSuccess: (response: BridgeEvent<Account>) => void; onError: (err: BridgeError) => void }
    )
    send(
        accountId: string,
        transfer: {
            amount: number
            address: string
            remainder_value_strategy: {
                strategy: string
            }
            indexation: { index: string; data: number[] }
        },
        callbacks: { onSuccess: (response: BridgeEvent<Message>) => void; onError: (err: BridgeError) => void }
    )
    internalTransfer(
        fromId: string,
        toId: string,
        amount: number,
        callbacks: { onSuccess: (response: BridgeEvent<Message>) => void; onError: (err: BridgeError) => void }
    )
    setAlias(
        accountId: string,
        alias: string,
        callbacks: { onSuccess: (response: BridgeEvent<void>) => void; onError: (err: BridgeError) => void }
    )
    lockStronghold(callbacks: { onSuccess: (response: BridgeEvent<void>) => void; onError: (err: BridgeError) => void })
    setStrongholdPassword(
        password: string,
        callbacks: { onSuccess: (response: BridgeEvent<void>) => void; onError: (err: BridgeError) => void }
    )
    changeStrongholdPassword(
        currentPassword: string,
        newPassword: string,
        callbacks: { onSuccess: (response: BridgeEvent<void>) => void; onError: (err: BridgeError) => void }
    )
    backup(
        strongholdPath: string,
        password: string,
        callbacks: { onSuccess: (response: BridgeEvent<void>) => void; onError: (err: BridgeError) => void }
    )
    restoreBackup(
        strongholdPath: string,
        password: string,
        callbacks: { onSuccess: (response: BridgeEvent<void>) => void; onError: (err: BridgeError) => void }
    )
    removeAccount(
        accountId: string,
        callbacks: { onSuccess: (response: BridgeEvent<void>) => void; onError: (err: BridgeError) => void }
    )
    setStoragePassword(
        newPinCode: string,
        callbacks: { onSuccess: (response: BridgeEvent<void>) => void; onError: (err: BridgeError) => void }
    )
    deleteStorage(callbacks: { onSuccess: (response: BridgeEvent<void>) => void; onError: (err: BridgeError) => void })
    setClientOptions(
        clientOptions: ClientOptions,
        callbacks: { onSuccess: (response: BridgeEvent<void>) => void; onError: (err: BridgeError) => void }
    )
    setStrongholdPasswordClearInterval(
        interval: Duration,
        callbacks: { onSuccess: (response: BridgeEvent<void>) => void; onError: (err: BridgeError) => void }
    )
    getNodeInfo(
        accountId: string,
        url: string,
        auth: NodeAuth,
        callbacks: { onSuccess: (response: BridgeEvent<NodeInfo>) => void; onError: (err: BridgeError) => void }
    )

    // Legacy seed APIs
    getLegacySeedChecksum(
        seed: string,
        callbacks: { onSuccess: (response: BridgeEvent<string>) => void; onError: (err: BridgeError) => void }
    )

    onStrongholdStatusChange(callbacks: {
        onSuccess: (response: BridgeEvent<StrongholdStatus>) => void
        onError: (err: BridgeError) => void
    })
    onNewTransaction(callbacks: {
        onSuccess: (response: BridgeEvent<TransactionEventPayload>) => void
        onError: (err: BridgeError) => void
    })
    onReattachment(callbacks: {
        onSuccess: (response: BridgeEvent<ReattachmentEventPayload>) => void
        onError: (err: BridgeError) => void
    })
    onConfirmationStateChange(callbacks: {
        onSuccess: (response: BridgeEvent<ConfirmationStateChangeEventPayload>) => void
        onError: (err: BridgeError) => void
    })
    onBalanceChange(callbacks: {
        onSuccess: (response: BridgeEvent<BalanceChangeEventPayload>) => void
        onError: (err: BridgeError) => void
    })
    onTransferProgress(callbacks: {
        onSuccess: (response: BridgeEvent<TransferProgressEventPayload>) => void
        onError: (err: BridgeError) => void
    })
    onLedgerAddressGeneration(callbacks: {
        onSuccess: (response: BridgeEvent<LedgerAddressGenerationEventPayload>) => void
        onError: (err: BridgeError) => void
    })
    onMigrationProgress(callbacks: {
        onSuccess: (response: BridgeEvent<MigrationProgressEventPayload>) => void
        onError: (err: BridgeError) => void
    })

    // Migration
    getMigrationData(
        seed: string,
        nodes: string[],
        securityLevel: number,
        initialAddressIndex: number,
        permanode: string | undefined,
        callbacks: { onSuccess: (response: BridgeEvent<MigrationData>) => void; onError: (err: BridgeError) => void }
    )
    createMigrationBundle(
        seed: string,
        inputAddressIndexes: number[],
        mine: boolean,
        timeoutSeconds: number,
        offset: number,
        logFilePath: string,
        callbacks: { onSuccess: (response: BridgeEvent<MigrationBundle>) => void; onError: (err: BridgeError) => void }
    )
    sendMigrationBundle(
        node: string[],
        bundleHash: string,
        mwm: number,
        callbacks: {
            onSuccess: (response: BridgeEvent<SendMigrationBundleResponse>) => void
            onError: (err: BridgeError) => void
        }
    )
    getMigrationAddress(
        prompt: boolean,
        accountIdentifier: AccountIdentifier,
        callbacks: {
            onSuccess: (response: BridgeEvent<GetMigrationAddressResponse>) => void
            onError: (err: BridgeError) => void
        }
    )
    mineBundle(
        bundle: string[],
        spentBundleHashes: string[],
        securityLevel: number,
        timeout: number,
        offset: number,
        callbacks: {
            onSuccess: (response: BridgeEvent<{ bundle: string[]; crackability: number }>) => void
            onError: (err: BridgeError) => void
        }
    )
    getLedgerMigrationData(
        addresses: AddressInput[],
        nodes: string[],
        permanode: string,
        securityLevel: number,
        callbacks: { onSuccess: (response: BridgeEvent<MigrationData>) => void; onError: (err: BridgeError) => void }
    )
    sendLedgerMigrationBundle(
        node: string[],
        bundle: string[],
        mwm: number,
        callbacks: {
            onSuccess: (response: BridgeEvent<SendMigrationBundleResponse>) => void
            onError: (err: BridgeError) => void
        }
    )
    getLedgerDeviceStatus(
        ledgerSimulator: boolean,
        callbacks: { onSuccess: (response: BridgeEvent<LedgerStatus>) => void; onError: (err: BridgeError) => void }
    )
    getLegacyAddressChecksum(
        address: string,
        callbacks: { onSuccess: (response: BridgeEvent<string>) => void; onError: (err: BridgeError) => void }
    )

    // Participation (voting / staking)
    getParticipationOverview(callbacks: {
        onSuccess: (response: BridgeEvent<ParticipationOverviewResponse>) => void
        onError: (err: BridgeError) => void
    })
    getParticipationEvents(callbacks: {
        onSuccess: (response: BridgeEvent<ParticipationEvent[]>) => void
        onError: (err: BridgeError) => void
    })
    participate(
        accountId: string,
        participations: Participation[],
        callbacks: {
            onSuccess: (response: BridgeEvent<ParticipateResponsePayload>) => void
            onError: (err: BridgeError) => void
        }
    )
    stopParticipating(
        accountId: string,
        eventIds: string[],
        callbacks: {
            onSuccess: (response: BridgeEvent<ParticipateResponsePayload>) => void
            onError: (err: BridgeError) => void
        }
    )
    participateWithRemainingFunds(
        accountId: string,
        participations: Participation[],
        callbacks: {
            onSuccess: (response: BridgeEvent<ParticipateResponsePayload>) => void
            onError: (err: BridgeError) => void
        }
    )
}

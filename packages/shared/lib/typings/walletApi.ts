import {
    ParticipateResponsePayload,
    Participation,
    ParticipationEvent,
    ParticipationOverviewResponse,
} from 'shared/lib/participation/types'
import { Account, AccountIdentifier, AccountSyncOptions, AccountToCreate, Balance, SyncedAccount } from './account'
import { Address } from './address'
import { GetMigrationAddressResponse } from './bridge'
import { ClientOptions } from './client'
import {
    BalanceChangeEventPayload,
    ConfirmationStateChangeEventPayload,
    ErrorEventPayload,
    Event,
    LedgerAddressGenerationEventPayload,
    MigrationProgressEventPayload,
    ReattachmentEventPayload,
    TransactionEventPayload,
    TransferProgressEventPayload,
} from './events'
import { LedgerStatus } from './ledger'
import { Message } from './message'
import { AddressInput, MigrationBundle, MigrationData, SendMigrationBundleResponse } from './migration'
import { NodeAuth, NodeInfo } from './node'
import { Duration, StrongholdStatus } from './wallet'

export interface IWalletApi {
    generateMnemonic(callbacks: {
        onSuccess: (response: Event<string>) => void
        onError: (err: ErrorEventPayload) => void
    })
    storeMnemonic(
        mnemonic: string,
        callbacks: { onSuccess: (response: Event<string>) => void; onError: (err: ErrorEventPayload) => void }
    )
    verifyMnemonic(
        mnemonic: string,
        callbacks: { onSuccess: (response: Event<string>) => void; onError: (err: ErrorEventPayload) => void }
    )
    getAccount(
        accountId: AccountIdentifier,
        callbacks: { onSuccess: (response: Event<Account>) => void; onError: (err: ErrorEventPayload) => void }
    )
    getAccounts(callbacks: {
        onSuccess: (response: Event<Account[]>) => void
        onError: (err: ErrorEventPayload) => void
    })
    getBalance(
        accountId: string,
        callbacks: { onSuccess: (response: Event<Balance>) => void; onError: (err: ErrorEventPayload) => void }
    )
    latestAddress(
        accountId: string,
        callbacks: { onSuccess: (response: Event<Address>) => void; onError: (err: ErrorEventPayload) => void }
    )
    areLatestAddressesUnused(callbacks: {
        onSuccess: (response: Event<boolean>) => void
        onError: (err: ErrorEventPayload) => void
    })
    getUnusedAddress(
        accountId: string,
        callbacks: { onSuccess: (response: Event<Address>) => void; onError: (err: ErrorEventPayload) => void }
    )
    getStrongholdStatus(callbacks: {
        onSuccess: (response: Event<StrongholdStatus>) => void
        onError: (err: ErrorEventPayload) => void
    })
    syncAccount(
        accountId: string,
        accountSyncOptions: AccountSyncOptions,
        callbacks: { onSuccess: (response: Event<SyncedAccount>) => void; onError: (err: ErrorEventPayload) => void }
    )
    syncAccounts(
        addressIndex: number,
        gapLimit: number,
        accountDiscoveryThreshold: number,
        callbacks: { onSuccess: (response: Event<SyncedAccount[]>) => void; onError: (err: ErrorEventPayload) => void }
    )
    startBackgroundSync(
        pollingInterval: Duration,
        automaticOutputConsolidation: boolean,
        gapLimit: number,
        callbacks: { onSuccess: (response: Event<void>) => void; onError: (err: ErrorEventPayload) => void }
    )
    stopBackgroundSync(callbacks: {
        onSuccess: (response: Event<void>) => void
        onError: (err: ErrorEventPayload) => void
    })
    createAccount(
        account: AccountToCreate,
        callbacks: { onSuccess: (response: Event<Account>) => void; onError: (err: ErrorEventPayload) => void }
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
        callbacks: { onSuccess: (response: Event<Message>) => void; onError: (err: ErrorEventPayload) => void }
    )
    internalTransfer(
        fromId: string,
        toId: string,
        amount: number,
        callbacks: { onSuccess: (response: Event<Message>) => void; onError: (err: ErrorEventPayload) => void }
    )
    setAlias(
        accountId: string,
        alias: string,
        callbacks: { onSuccess: (response: Event<void>) => void; onError: (err: ErrorEventPayload) => void }
    )
    lockStronghold(callbacks: { onSuccess: (response: Event<void>) => void; onError: (err: ErrorEventPayload) => void })
    setStrongholdPassword(
        password: string,
        callbacks: { onSuccess: (response: Event<void>) => void; onError: (err: ErrorEventPayload) => void }
    )
    changeStrongholdPassword(
        currentPassword: string,
        newPassword: string,
        callbacks: { onSuccess: (response: Event<void>) => void; onError: (err: ErrorEventPayload) => void }
    )
    backup(
        strongholdPath: string,
        password: string,
        callbacks: { onSuccess: (response: Event<void>) => void; onError: (err: ErrorEventPayload) => void }
    )
    restoreBackup(
        strongholdPath: string,
        password: string,
        callbacks: { onSuccess: (response: Event<void>) => void; onError: (err: ErrorEventPayload) => void }
    )
    removeAccount(
        accountId: string,
        callbacks: { onSuccess: (response: Event<void>) => void; onError: (err: ErrorEventPayload) => void }
    )
    setStoragePassword(
        newPinCode: string,
        callbacks: { onSuccess: (response: Event<void>) => void; onError: (err: ErrorEventPayload) => void }
    )
    deleteStorage(callbacks: { onSuccess: (response: Event<void>) => void; onError: (err: ErrorEventPayload) => void })
    setClientOptions(
        clientOptions: ClientOptions,
        callbacks: { onSuccess: (response: Event<void>) => void; onError: (err: ErrorEventPayload) => void }
    )
    setStrongholdPasswordClearInterval(
        interval: Duration,
        callbacks: { onSuccess: (response: Event<void>) => void; onError: (err: ErrorEventPayload) => void }
    )
    getNodeInfo(
        accountId: string,
        url: string,
        auth: NodeAuth,
        callbacks: { onSuccess: (response: Event<NodeInfo>) => void; onError: (err: ErrorEventPayload) => void }
    )

    // Legacy seed APIs
    getLegacySeedChecksum(
        seed: string,
        callbacks: { onSuccess: (response: Event<string>) => void; onError: (err: ErrorEventPayload) => void }
    )

    onStrongholdStatusChange(callbacks: {
        onSuccess: (response: Event<StrongholdStatus>) => void
        onError: (err: ErrorEventPayload) => void
    })
    onNewTransaction(callbacks: {
        onSuccess: (response: Event<TransactionEventPayload>) => void
        onError: (err: ErrorEventPayload) => void
    })
    onReattachment(callbacks: {
        onSuccess: (response: Event<ReattachmentEventPayload>) => void
        onError: (err: ErrorEventPayload) => void
    })
    onConfirmationStateChange(callbacks: {
        onSuccess: (response: Event<ConfirmationStateChangeEventPayload>) => void
        onError: (err: ErrorEventPayload) => void
    })
    onBalanceChange(callbacks: {
        onSuccess: (response: Event<BalanceChangeEventPayload>) => void
        onError: (err: ErrorEventPayload) => void
    })
    onTransferProgress(callbacks: {
        onSuccess: (response: Event<TransferProgressEventPayload>) => void
        onError: (err: ErrorEventPayload) => void
    })
    onLedgerAddressGeneration(callbacks: {
        onSuccess: (response: Event<LedgerAddressGenerationEventPayload>) => void
        onError: (err: ErrorEventPayload) => void
    })
    onMigrationProgress(callbacks: {
        onSuccess: (response: Event<MigrationProgressEventPayload>) => void
        onError: (err: ErrorEventPayload) => void
    })

    // Migration
    getMigrationData(
        seed: string,
        nodes: string[],
        securityLevel: number,
        initialAddressIndex: number,
        permanode: string | undefined,
        callbacks: { onSuccess: (response: Event<MigrationData>) => void; onError: (err: ErrorEventPayload) => void }
    )
    createMigrationBundle(
        seed: string,
        inputAddressIndexes: number[],
        mine: boolean,
        timeoutSeconds: number,
        offset: number,
        logFilePath: string,
        callbacks: { onSuccess: (response: Event<MigrationBundle>) => void; onError: (err: ErrorEventPayload) => void }
    )
    sendMigrationBundle(
        node: string[],
        bundleHash: string,
        mwm: number,
        callbacks: {
            onSuccess: (response: Event<SendMigrationBundleResponse>) => void
            onError: (err: ErrorEventPayload) => void
        }
    )
    getMigrationAddress(
        prompt: boolean,
        accountIdentifier: AccountIdentifier,
        callbacks: {
            onSuccess: (response: Event<GetMigrationAddressResponse>) => void
            onError: (err: ErrorEventPayload) => void
        }
    )
    mineBundle(
        bundle: string[],
        spentBundleHashes: string[],
        securityLevel: number,
        timeout: number,
        offset: number,
        callbacks: {
            onSuccess: (response: Event<{ bundle: string[]; crackability: number }>) => void
            onError: (err: ErrorEventPayload) => void
        }
    )
    getLedgerMigrationData(
        addresses: AddressInput[],
        nodes: string[],
        permanode: string,
        securityLevel: number,
        callbacks: { onSuccess: (response: Event<MigrationData>) => void; onError: (err: ErrorEventPayload) => void }
    )
    sendLedgerMigrationBundle(
        node: string[],
        bundle: string[],
        mwm: number,
        callbacks: {
            onSuccess: (response: Event<SendMigrationBundleResponse>) => void
            onError: (err: ErrorEventPayload) => void
        }
    )
    getLedgerDeviceStatus(
        ledgerSimulator: boolean,
        callbacks: { onSuccess: (response: Event<LedgerStatus>) => void; onError: (err: ErrorEventPayload) => void }
    )
    getLegacyAddressChecksum(
        address: string,
        callbacks: { onSuccess: (response: Event<string>) => void; onError: (err: ErrorEventPayload) => void }
    )

    // Participation (voting / staking)
    getParticipationOverview(
        assemblyEventId: string,
        callbacks: {
            onSuccess: (response: Event<ParticipationOverviewResponse>) => void
            onError: (err: ErrorEventPayload) => void
        }
    )
    getParticipationEvents(callbacks: {
        onSuccess: (response: Event<ParticipationEvent[]>) => void
        onError: (err: ErrorEventPayload) => void
    })
    participate(
        accountId: string,
        participations: Participation[],
        callbacks: {
            onSuccess: (response: Event<ParticipateResponsePayload>) => void
            onError: (err: ErrorEventPayload) => void
        }
    )
    stopParticipating(
        accountId: string,
        eventIds: string[],
        callbacks: {
            onSuccess: (response: Event<ParticipateResponsePayload>) => void
            onError: (err: ErrorEventPayload) => void
        }
    )
}

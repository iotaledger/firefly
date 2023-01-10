import type {
    AccountId,
    AccountSyncOptions,
    CreateAccountPayload,
} from '../account';
import type { GenerateAddressOptions } from '../address';
import type { WalletEvent } from '../event';
import type { Auth, ClientOptions, Node } from '../network';
import type { EventId } from '../participation';

export type __BackupMessage__ = {
    cmd: 'backup';
    payload: {
        destination: string;
        password: string;
    };
};

export type __Bech32ToHex__ = {
    cmd: 'bech32ToHex';
    payload: string;
};

export type __ChangeStrongholdPasswordMessage__ = {
    cmd: 'changeStrongholdPassword';
    payload: {
        currentPassword: string;
        newPassword: string;
    };
};

export type __ClearStrongholdPasswordMessage__ = {
    cmd: 'clearStrongholdPassword';
};

export type __CreateAccountMessage__ = {
    cmd: 'createAccount';
    payload: CreateAccountPayload;
};

export type __DeregisterParticipationEvent__ = {
    cmd: 'deregisterParticipationEvent';
    payload: {
        eventId: EventId;
    };
};

export type __EmitTestEventMessage__ = {
    cmd: 'emitTestEvent';
    payload: WalletEvent;
};

export type __GenerateMnemonicMessage__ = {
    cmd: 'generateMnemonic';
};

export type __GetAccountIndexesMessage__ = {
    cmd: 'getAccountIndexes';
};

export type __GetAccountsMessage__ = {
    cmd: 'getAccounts';
};

export type __GetAccountMessage__ = {
    cmd: 'getAccount';
    payload: AccountId;
};

export type __GetLedgerNanoStatusMessage__ = {
    cmd: 'getLedgerNanoStatus';
};

export type __GenerateAddressMessage__ = {
    cmd: 'generateAddress';
    payload: {
        accountIndex: number;
        internal: boolean;
        addressIndex: number;
        options?: GenerateAddressOptions;
        bech32Hrp?: string;
    };
};

export type __GetNodeInfoMessage__ = {
    cmd: 'getNodeInfo';
    payload: {
        url?: string;
        auth?: Auth;
    };
};

export type __GetParticipationEventMessage__ = {
    cmd: 'getParticipationEvent';
    payload: {
        eventId: EventId;
    };
};

export type __GetParticipationEventsMessage__ = {
    cmd: 'getParticipationEvents';
};

export type __GetParticipationEventStatusMessage__ = {
    cmd: 'getParticipationEventStatus';
    payload: {
        eventId: EventId;
    };
};

export type __HexToBech32__ = {
    cmd: 'hexToBech32';
    payload: {
        hex: string;
        bech32Hrp?: string;
    };
};

export type __IsStrongholdPasswordAvailableMessage__ = {
    cmd: 'isStrongholdPasswordAvailable';
};

export type __RecoverAccountsMessage__ = {
    cmd: 'recoverAccounts';
    payload: {
        accountStartIndex: number;
        accountGapLimit: number;
        addressGapLimit: number;
        syncOptions?: AccountSyncOptions;
    };
};

export type __RegisterParticipationEventMessage__ = {
    cmd: 'registerParticipationEvent';
    payload: {
        eventId: EventId;
        nodes: Node[];
    };
};

export type __RemoveLatestAccountMessage__ = {
    cmd: 'removeLatestAccount';
};

export type __RestoreBackupMessage__ = {
    cmd: 'restoreBackup';
    payload: {
        source: string;
        password: string;
    };
};

export type __SetClientOptionsMessage__ = {
    cmd: 'setClientOptions';
    payload: ClientOptions;
};

export type __SetStrongholdPasswordMessage__ = {
    cmd: 'setStrongholdPassword';
    payload: string;
};

export type __SetStrongholdPasswordClearIntervalMessage__ = {
    cmd: 'setStrongholdPasswordClearInterval';
    payload?: number;
};

export type __StartBackgroundSyncMessage__ = {
    cmd: 'startBackgroundSync';
    payload: {
        options?: AccountSyncOptions;
        intervalInMilliseconds?: number;
    };
};

export type __StopBackgroundSyncMessage__ = {
    cmd: 'stopBackgroundSync';
};

export type __StoreMnemonicMessage__ = {
    cmd: 'storeMnemonic';
    payload: string;
};

export type __VerifyMnemonicMessage__ = {
    cmd: 'verifyMnemonic';
    payload: string;
};

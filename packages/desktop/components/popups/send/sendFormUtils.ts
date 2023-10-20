import {
    TransactionActivity,
    NftActivity,
    NewTransactionDetails,
    Subject,
    VestingActivity,
} from '../../../../shared/lib/core/wallet'
import {
    ActivityDirection,
    ActivityType,
    InclusionState,
    ActivityAction,
} from '../../../../shared/lib/core/wallet/enums'
import { NewTransactionType } from '../../../../shared/lib/core/wallet/stores'
import {
    ACCOUNTS_CONTRACT,
    CONTRACT_FUNCTIONS,
    getDestinationNetworkFromAddress,
    ILayer2Parameters,
    TARGET_CONTRACTS,
    TRANSFER_ALLOWANCE,
} from '../../../../shared/lib/core/layer-2'
import { getAddressFromSubject } from '../../../../shared/lib/core/wallet/utils'
import { TimePeriod } from '../../../../shared/lib/core/utils'

export enum SendFormTab {
    SendToken = 'general.sendToken',
    SendNft = 'general.sendNft',
}

export enum OptionalInputType {
    Metadata = 'metadata',
    Tag = 'tag',
}

export function getInitialExpirationDate(
    expirationDate: Date,
    storageDeposit: number,
    giftStorageDeposit: boolean
): TimePeriod {
    if (expirationDate) {
        return TimePeriod.Custom
    } else if (storageDeposit && !giftStorageDeposit) {
        return TimePeriod.OneDay
    } else {
        return TimePeriod.None
    }
}

export function rebuildActivity(
    transactionDetails: NewTransactionDetails,
    recipient: Subject,
    storageDeposit: number,
    giftStorageDeposit: boolean,
    visibleSurplus: number,
    isInternal: boolean,
    layer2Parameters: ILayer2Parameters
): TransactionActivity | VestingActivity | NftActivity {
    return {
        ...transactionDetails,
        id: undefined,
        outputId: undefined,
        transactionId: undefined,
        time: undefined,
        asyncData: undefined,
        assetId: transactionDetails.type === NewTransactionType.TokenTransfer ? transactionDetails.asset.id : undefined,
        storageDeposit,
        subject: recipient,
        isInternal,
        containsValue: true,
        isAssetHidden: false,
        giftedStorageDeposit: giftStorageDeposit ? storageDeposit : 0,
        surplus: visibleSurplus,
        type: ActivityType.Basic,
        direction: ActivityDirection.Outgoing,
        inclusionState: InclusionState.Pending,
        action: ActivityAction.Send,
        destinationNetwork: getDestinationNetworkFromAddress(layer2Parameters?.networkAddress),
        ...(layer2Parameters?.networkAddress && {
            parsedLayer2Metadata: {
                ethereumAddress: getAddressFromSubject(recipient),
                targetContract: TARGET_CONTRACTS[ACCOUNTS_CONTRACT],
                contractFunction: CONTRACT_FUNCTIONS[TRANSFER_ALLOWANCE],
                gasBudget: layer2Parameters?.gasBudget ?? 0,
            },
        }),
    }
}

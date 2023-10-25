import { NewTransactionDetails, NftActivity, Subject, TransactionActivity, VestingActivity } from '@core/wallet/types'
import { NewTransactionType } from '@core/wallet/stores'
import { ActivityAction, ActivityDirection, ActivityType, InclusionState } from '@core/wallet/enums'
import { TimePeriod } from '@core/utils'
import { getAddressFromSubject } from '../getAddressFromSubject'
import {
    ACCOUNTS_CONTRACT,
    CONTRACT_FUNCTIONS,
    ILayer2Parameters,
    TARGET_CONTRACTS,
    TRANSFER_ALLOWANCE,
    getDestinationNetworkFromAddress,
} from '@core/layer-2'

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
): Partial<TransactionActivity | VestingActivity | NftActivity> {
    return {
        ...(transactionDetails as unknown as TransactionActivity | VestingActivity | NftActivity),
        id: undefined,
        outputId: undefined,
        transactionId: undefined,
        time: undefined,
        asyncData: undefined,
        assetId:
            transactionDetails.type === NewTransactionType.TokenTransfer ? transactionDetails?.asset?.id : undefined,
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
                gasBudget: (layer2Parameters?.gasBudget ?? 0).toString(),
            },
        }),
    }
}

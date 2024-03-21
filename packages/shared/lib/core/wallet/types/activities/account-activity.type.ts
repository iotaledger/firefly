import { ActivityAction, ActivityType } from '@core/wallet/enums'
import { ActivityBase, ActivityBaseOptions, SpecialStatus } from './base-activity.type'
import {
    ActivityGenerationParameters,
    IWalletState,
    ProcessedTransaction,
} from '../../interfaces'
import { AccountAddress, AccountOutput, Address, AddressType, InclusionState, OutputType } from '@iota/sdk/out/types'
import { api } from '@core/api'
import { getNetworkHrp } from '@core/profile'
import {
    getStorageDepositFromOutput,
    getAmountFromOutput,
    getMetadataFromOutput,
    getTagFromOutput,
    getAsyncDataFromOutput,
    AddressConverter,
} from '../../utils'
import { EMPTY_HEX_ID } from '../../constants'

interface ActivityAccountOptions extends ActivityBaseOptions {
    accountAddress: string
    accountId: string
}

export class ActivityAccount extends ActivityBase {
    constructor(private accountOptions: ActivityAccountOptions) {
        super(accountOptions)
    }

    type(){
        return ActivityType.Account
    }

    accountId(): string {
        return this.accountOptions.accountId
    }

    accountAddress(): string {
        return this.accountOptions.accountAddress
    }

    tileTitle(): string {
        const isConfirmed = this.inclusionState() === InclusionState.Confirmed
        //if (action === ActivityAction.Mint) {
        // return isConfirmed ? 'general.accountCreated' : 'general.creatingAnAccount'
        //}
        return isConfirmed ? 'general.minted' : 'general.minting'
    }

    static async fromOutputs(
        processedTransaction: ProcessedTransaction,
        wallet: IWalletState
    ): Promise<ActivityBase[]> {
        const outputs = processedTransaction.outputs
        const activities: ActivityAccount[] = []

        const accountOutputs = outputs.filter((output) => output.output.type === OutputType.Account)
        for (const accountOutput of accountOutputs) {
            const output = accountOutput.output as AccountOutput
            const activity = await ActivityAccount.fromProcessedTransaction(wallet, {
                // TODO: Check if an account is created or minted and set the action accordingly
                action: output.accountId === EMPTY_HEX_ID ? ActivityAction.Send : ActivityAction.Mint,
                processedTransaction,
                wrappedOutput: accountOutput,
            })
            activities.push(activity)
        }
        return activities
    }

    static async fromProcessedTransaction(
        wallet: IWalletState,
        { action, processedTransaction, wrappedOutput }: ActivityGenerationParameters
    ) {
        const { transactionId, claimingData, direction, time, inclusionState } = processedTransaction

        const specialStatus = SpecialStatus.Unclaimed // TODO: Fix this
        const output = wrappedOutput.output as AccountOutput
        const outputId = wrappedOutput.outputId
        const id = outputId || transactionId

        const { storageDeposit: _storageDeposit, giftedStorageDeposit } = await getStorageDepositFromOutput(output)
        const storageDeposit = getAmountFromOutput(output) + _storageDeposit
        const accountId = getAccountId(output, outputId)
        const accountAddress =  AddressConverter.addressToBech32(new AccountAddress(accountId));
        
        const isHidden = false
        const isAssetHidden = false
        const containsValue = true

        const metadata = getMetadataFromOutput(output)
        const tag = getTagFromOutput(output)
        const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, wallet)
        const sendingInfo = processedTransaction.getSendingInformation(wallet, output)

        return new ActivityAccount({
            isHidden,
            id,
            inclusionState,
            specialStatus,
            accountAddress,
            accountId,
            time,
            action,
            direction,
            isAssetHidden,
            containsValue,
            metadata,
            tag,
            asyncData,
            outputId,
            transactionId,
            storageDeposit,
            giftedStorageDeposit,
            ...sendingInfo
        })
    }
}

function getAccountId(output: AccountOutput, outputId: string): string {
    const isNewAccount = output.accountId === EMPTY_HEX_ID
    return isNewAccount ? api.computeAccountId(outputId) : output.accountId
}

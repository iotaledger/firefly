import { ActivityType, GovernanceAction } from '@core/wallet/enums'
import {
    ActivityGenerationParameters,
    IParticipation,
    IWalletState,
} from '@core/wallet/interfaces'
import { ActivityBase, ActivityBaseOptions, BaseActivity, SpecialStatus } from './base-activity.type'
import { BasicOutput, InclusionState } from '@iota/sdk/out/types'
import { activityOutputContainsValue, getGovernanceInfo, getMetadataFromOutput, getStorageDepositFromOutput, getTagFromOutput } from '../../utils'

export type GovernanceActivity = BaseActivity & {
    type: ActivityType.Governance
    governanceAction: GovernanceAction
    votingPower: number
    participation?: IParticipation
    votingPowerDifference?: number
}

interface ActivityGovernanceOptions extends ActivityBaseOptions {
    governanceAction: GovernanceAction
    votingPower: number
    participation?: IParticipation
    votingPowerDifference?: number
}

export class ActivityGovernance extends ActivityBase {
    constructor(private governanceOptions: ActivityGovernanceOptions) {
        super(governanceOptions)
    }

    governanceAction(){
        return this.governanceOptions.governanceAction
    }

    tileTitle(): string {
        const isConfirmed = this.inclusionState() === InclusionState.Confirmed;
        switch(this.governanceAction()) {
            case GovernanceAction.IncreaseVotingPower:
                return isConfirmed ? 'general.increased' : 'general.increasing'
            case GovernanceAction.DecreaseVotingPower:
                return isConfirmed ? 'general.decreased' : 'general.decreasing'
            case GovernanceAction.StartVoting:
                return isConfirmed ? 'general.voted' : 'general.voting'
            case GovernanceAction.StopVoting:
                return isConfirmed ? 'general.unvoted' : 'general.unvoting'
            case  GovernanceAction.ChangedVote:
                return isConfirmed ? 'general.changedVote' : 'general.changingVote'
            case GovernanceAction.Revote:
                return isConfirmed ? 'general.revoted' : 'general.revoting'
            default:
                return super.tileTitle()
        }
    }

    static async fromProcessedTransaction(
        wallet: IWalletState,
        { action, processedTransaction, wrappedOutput }: ActivityGenerationParameters
    ): Promise<ActivityGovernance> {
        const { transactionId, direction, time, inclusionState, wrappedInputs } = processedTransaction

        const specialStatus = SpecialStatus.Unclaimed // TODO: Fix this
        const giftedStorageDeposit = 0
        const isHidden = false
        const isAssetHidden = false
        const containsValue = await activityOutputContainsValue(wallet, wrappedOutput)

        const outputId = wrappedOutput.outputId
        const id = outputId || transactionId

        const output = wrappedOutput.output as BasicOutput

        const tag = getTagFromOutput(output)
        const metadata = getMetadataFromOutput(output)

        const sendingInfo = processedTransaction.getSendingInformation(wallet, output)

        const { storageDeposit } = await getStorageDepositFromOutput(output)
        const governanceInfo = getGovernanceInfo(output, wrappedInputs, metadata)

        return new ActivityGovernance({
            isHidden,
            id,
            inclusionState,
            specialStatus,
            time,
            transactionId,
            direction,
            action,
            isAssetHidden,
            containsValue,
            outputId,
            storageDeposit,
            giftedStorageDeposit,
            metadata,
            tag,
            ...governanceInfo,
            ...sendingInfo,
        })
    }
}

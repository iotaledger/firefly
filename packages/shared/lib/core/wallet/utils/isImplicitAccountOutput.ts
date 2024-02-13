import { OutputType, CommonOutput, UnlockConditionType, AddressUnlockCondition, AddressType } from '@iota/sdk/out/types'

export function isImplicitAccountOutput(output: CommonOutput): boolean {
    return (
        output?.type === OutputType.Basic &&
        output.unlockConditions.length === 1 &&
        (
            output.unlockConditions.find(
                (cmnOutput) => cmnOutput.type === UnlockConditionType.Address
            ) as AddressUnlockCondition
        )?.address.type === AddressType.ImplicitAccountCreation
    )
}

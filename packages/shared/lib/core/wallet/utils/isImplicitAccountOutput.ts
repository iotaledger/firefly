import {
    OutputType,
    CommonOutput,
    UnlockConditionType,
    AddressUnlockCondition,
    AddressType,
    OutputData,
} from '@iota/sdk/out/types'

export function isImplicitAccountOutput(outputData: OutputData): boolean {
    const output = outputData.output as CommonOutput
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

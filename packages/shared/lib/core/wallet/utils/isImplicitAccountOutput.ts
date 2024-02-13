import {
    OutputType,
    CommonOutput,
    UnlockConditionType,
    AddressUnlockCondition,
    AddressType,
    OutputData,
} from '@iota/sdk/out/types'

export function isImplicitAccountOutput(outputData: OutputData): boolean {
    const output = outputData?.output
    return (
        output?.type === OutputType.Basic &&
        (output as CommonOutput).unlockConditions.length === 1 &&
        (
            (output as CommonOutput).unlockConditions.find(
                (cmnOutput) => cmnOutput.type === UnlockConditionType.Address
            ) as AddressUnlockCondition
        )?.address.type === AddressType.ImplicitAccountCreation
    )
}

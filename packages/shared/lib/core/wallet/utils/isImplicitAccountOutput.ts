import {
    OutputType,
    CommonOutput,
    UnlockConditionType,
    AddressUnlockCondition,
    AddressType,
    Output,
} from '@iota/sdk/out/types'

export function isImplicitAccountOutput(_output: Output): boolean {
    const output = _output as CommonOutput
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

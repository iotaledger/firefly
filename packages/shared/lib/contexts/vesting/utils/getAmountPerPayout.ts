import { AddressWithOutputs } from '@core/account'

export function getAmountPerPayout(vestingOutputsWithAddresses: AddressWithOutputs[]): number {
    const calculatedTotalAmount = vestingOutputsWithAddresses.reduce(
        (acc, vestingOutputsWithAddress) =>
            acc +
                parseInt(
                    vestingOutputsWithAddress.outputs[vestingOutputsWithAddress.outputs?.length - 1]?.output.amount,
                    10
                ) || 0,
        0
    )
    return calculatedTotalAmount
}

import {
    ImplicitAccountCreationAddress,
    AccountOutput,
    AccountAddress,
    CommonOutput,
    OutputData,
} from '@iota/sdk/out/types'
import { getBech32AddressFromAddressTypes } from './getBech32AddressFromAddressTypes'
import { isImplicitAccountOutput } from './isImplicitAccountOutput'

export function getAddressFromOutput(accountOutput: OutputData): string {
    const output = accountOutput.output
    let address = ''
    if (isImplicitAccountOutput(output as CommonOutput)) {
        address = getBech32AddressFromAddressTypes(
            new ImplicitAccountCreationAddress(
                (output as CommonOutput).unlockConditions[0].address.pubKeyHash
            ).address()
        )
    } else {
        const accountId = (output as AccountOutput).accountId
        if (accountId) {
            address = getBech32AddressFromAddressTypes(new AccountAddress(accountId))
        }
    }
    return address
}

import { getClient } from '@core/profile-manager/api/getClient'
import { convertBech32AddressToEd25519Address } from '@core/utils'
import {
    AddressType,
    BasicOutputBuilderParams,
    UnlockConditionType,
    AddressUnlockCondition,
    Ed25519Address,
} from '@iota/sdk/out/types'
import { plainToInstance } from 'class-transformer'

export async function getMinimumRequiredStorageDeposit(bach32Address: string, amount: string): Promise<number> {
    const address = {
        type: AddressType.Ed25519,
        pubKeyHash: convertBech32AddressToEd25519Address(bach32Address),
    }
    const ed25519Address = plainToInstance(Ed25519Address, address)

    const unlockCondition = {
        type: UnlockConditionType.Address,
        address: ed25519Address,
    }
    const addressUnlockCondition = plainToInstance(AddressUnlockCondition, unlockCondition)

    const params: BasicOutputBuilderParams = {
        amount,
        unlockConditions: [addressUnlockCondition],
    }

    const client = await getClient()
    const basicOutput = await client.buildBasicOutput(params)
    const minimumRequiredStorageDeposit = await client.minimumRequiredStorageDeposit(basicOutput)

    return minimumRequiredStorageDeposit
}

import { getClient } from '@core/profile-manager/api/getClient'
import { EMPTY_HEX_ID } from '@core/wallet'
import {
    AddressType,
    BasicOutputBuilderParams,
    UnlockConditionType,
    AddressUnlockCondition,
    Ed25519Address,
} from '@iota/sdk/out/types'
import { plainToInstance } from 'class-transformer'

const MOCK_BASIC_OUTPUT_AMOUNT = '10'

export async function getRequiredStorageDepositForMinimalBasicOutput(): Promise<number> {
    const address = {
        type: AddressType.Ed25519,
        pubKeyHash: EMPTY_HEX_ID,
    }
    const ed25519Address = plainToInstance(Ed25519Address, address)

    const unlockCondition = {
        type: UnlockConditionType.Address,
        address: ed25519Address,
    }
    const addressUnlockCondition = plainToInstance(AddressUnlockCondition, unlockCondition)

    const params: BasicOutputBuilderParams = {
        amount: MOCK_BASIC_OUTPUT_AMOUNT,
        unlockConditions: [addressUnlockCondition],
    }

    const client = await getClient()
    const basicOutput = await client.buildBasicOutput(params)
    const minimumRequiredStorageDeposit = await client.minimumRequiredStorageDeposit(basicOutput)

    return minimumRequiredStorageDeposit
}

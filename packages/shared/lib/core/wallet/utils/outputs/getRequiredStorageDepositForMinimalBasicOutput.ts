import { EMPTY_HEX_ID } from '@core/wallet'
import {
    AddressType,
    AddressUnlockCondition,
    BasicOutputBuilderParams,
    Ed25519Address,
    UnlockConditionType,
} from '@iota/sdk/out/types'
import { plainToInstance } from 'class-transformer'
import { getClient } from '../../actions/getClient'

const MOCK_BASIC_OUTPUT_AMOUNT = '10'

/**
 * Calculate minimum storage deposit required for the most minimal basic output with a single address unlock condition.
 * @returns The minimum storage deposit.
 */
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
    const minimumRequiredStorageDeposit = await client.computeMinimumOutputAmount(basicOutput)

    return minimumRequiredStorageDeposit
}

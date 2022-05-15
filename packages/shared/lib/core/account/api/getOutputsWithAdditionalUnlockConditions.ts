import { getAccountOrSelectedAccount } from '../actions/getAccountOrSelectedAccount'

export async function getOutputsWithAdditionalUnlockConditions(outputs: unknown, id?: string): Promise<string> {
    return (await getAccountOrSelectedAccount(id))?.getOutputsWithAdditionalUnlockConditions(outputs)
}

import { getAccountOrSelectedAccount } from '../actions/getAccountOrSelectedAccount'

export async function collectOutputs(id?: string): Promise<void> {
    return (await getAccountOrSelectedAccount(id))?.collectOutputs()
}

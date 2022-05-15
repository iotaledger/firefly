import { OutputData } from '@iota/wallet'
import { getAccountOrSelectedAccount } from '../actions/getAccountOrSelectedAccount'

export async function listOutputs(id?: string): Promise<OutputData[]> {
    return (await getAccountOrSelectedAccount(id))?.listOutputs()
}

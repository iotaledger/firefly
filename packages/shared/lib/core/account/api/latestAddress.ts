import { Address } from '@iota/wallet'
import { getAccountOrSelectedAccount } from '../actions/getAccountOrSelectedAccount'

export async function latestAddress(id?: string): Promise<Address> {
    return (await getAccountOrSelectedAccount(id))?.latestAddress()
}

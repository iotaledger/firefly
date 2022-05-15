import { Address } from '@iota/wallet'
import { getAccountOrSelectedAccount } from '../actions/getAccountOrSelectedAccount'

export async function generateAddresses(id?: string): Promise<Address[]> {
    return (await getAccountOrSelectedAccount(id))?.generateAddresses()
}

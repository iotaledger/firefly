import { Address } from '@iota/wallet'
import { getAccountOrSelectedAccount } from '../actions/getAccountOrSelectedAccount'

export async function listAddressesWithBalance(id?: string): Promise<Address[]> {
    return (await getAccountOrSelectedAccount(id))?.listAddressesWithBalance()
}

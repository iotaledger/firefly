import { getAccountOrSelectedAccount } from '../actions/getAccountOrSelectedAccount'
import { IAccountBalances } from '../interfaces/account-balances.interface'

export async function getBalance(id?: string): Promise<IAccountBalances> {
    return (await getAccountOrSelectedAccount(id))?.balance()
}

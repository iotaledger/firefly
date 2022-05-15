import { Transaction } from '@iota/wallet'
import { getAccountOrSelectedAccount } from '../actions/getAccountOrSelectedAccount'

export async function listTransactions(id?: string): Promise<Transaction[]> {
    return (await getAccountOrSelectedAccount(id))?.listTransactions()
}

import { Transaction } from '@iota/wallet'
import { getAccountOrSelectedAccount } from '../actions/getAccountOrSelectedAccount'

export async function listPendingTransactions(id?: string): Promise<Transaction[]> {
    return (await getAccountOrSelectedAccount(id))?.listPendingTransactions()
}

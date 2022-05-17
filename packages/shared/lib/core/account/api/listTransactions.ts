import { Transaction } from '@iota/wallet'
import { getAccount } from '@core/profile-manager'

export async function listTransactions(id?: string): Promise<Transaction[]> {
    return (await getAccount(Number(id)))?.listTransactions()
}

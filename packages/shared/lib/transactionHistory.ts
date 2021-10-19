import type { WalletAccount } from './typings/wallet'

export const generateTransactionHistoryCsvFromAccount = (WalletAccount: WalletAccount): string => {
    const headers = 'id,timestamp,value,internal\r\n'
    let csv = headers

    WalletAccount.messages.forEach((message) => {
        if (message.payload.type === 'Transaction') {
            const id = message.id
            const timestamp = message.timestamp
            const incoming = message.payload.data.essence.data.incoming
            const value = message.payload.data.essence.data.value
            const internal = message.payload.data.essence.data.internal
            const csvLine = `${id},${timestamp},${incoming ? '-' : ''}${value},${internal}\r\n`
            csv = csv + csvLine
        }
    })

    return csv
}

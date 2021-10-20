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

export const generateTransactionHistoryCsvFileName = (profileName: string, accountAlias: string): string => {
    const DEFAULT_FILE_NAME_PATTERN = 'firefly-transaction-history-[profileName]-[accountAlias]-[date]'
    const tzoffset = new Date().getTimezoneOffset() * 60000 // offset in milliseconds
    const localISOTime = new Date(Date.now() - tzoffset).toISOString()
    const date = localISOTime.slice(0, -5)

    const fileName = DEFAULT_FILE_NAME_PATTERN.replace('[profileName]', profileName.toLowerCase())
        .replace('[accountAlias]', accountAlias.toLowerCase())
        .replace('[date]', date)

    return sanatiseFilename(fileName)
}

// TODO: Refactor out of this file
const sanatiseFilename = (s: string) => {
    return s.replace(/[^a-z0-9-]/gi, '-').replace(/-{2,}/g, '-')
}

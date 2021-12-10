import type { WalletAccount } from './typings/wallet'

interface ITransactionHistoryHeaderParameters {
    id?: boolean
    timestamp?: boolean
    internal?: boolean
    value?: boolean
    remainderValue?: boolean
}

const NEW_LINE = '\r\n'

export const generateTransactionHistoryCsvFromAccount = (
    WalletAccount: WalletAccount,
    headerParams: ITransactionHistoryHeaderParameters
): string => {
    const headerParts = []
    headerParams.id && headerParts.push('id')
    headerParams.internal && headerParts.push('internal')
    headerParams.timestamp && headerParts.push('timestamp')
    headerParams.value && headerParts.push('value')
    headerParams.remainderValue && headerParts.push('remainderValue')

    let csv = headerParts.join(',') + NEW_LINE

    WalletAccount.messages.forEach((message) => {
        const { id, timestamp } = message
        if (message.payload.type === 'Transaction') {
            const { internal, incoming, value, remainderValue } = message.payload.data.essence.data
            const valueString = incoming ? '-' + value : String(value)

            const csvLineParts: string[] = []
            headerParams.id && csvLineParts.push(String(id))
            headerParams.internal && csvLineParts.push(String(internal))
            headerParams.timestamp && csvLineParts.push(String(timestamp))
            headerParams.value && csvLineParts.push(valueString)
            headerParams.remainderValue && csvLineParts.push(String(remainderValue))

            const csvLine = csvLineParts.join(',') + NEW_LINE
            csv = csv + csvLine
        }
    })

    return csv
}

export const generateTransactionHistoryFileName = (profileName: string, accountAlias: string): string => {
    const DEFAULT_FILE_NAME_PATTERN = 'firefly-transaction-history-{{profileName}}-{{accountAlias}}-{{date}}'
    const tzoffset = new Date().getTimezoneOffset() * 60000 // offset in milliseconds
    const localISOTime = new Date(Date.now() - tzoffset).toISOString()
    const date = localISOTime.slice(0, -5)

    const fileName = DEFAULT_FILE_NAME_PATTERN.replace('{{profileName}}', profileName.toLowerCase())
        .replace('{{accountAlias}}', accountAlias.toLowerCase())
        .replace('{{date}}', date)

    return sanitiseFilename(fileName)
}

// TODO: Refactor out of this file
const sanitiseFilename = (s: string) => s.replace(/[^a-z0-9-]/gi, '-').replace(/-{2,}/g, '-')

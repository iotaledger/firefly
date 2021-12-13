import type { WalletAccount } from './typings/wallet'
import { formatUnitBestMatch } from './units'

interface ITransactionHistoryHeaderParameters {
    id?: boolean
    internal?: boolean
    value?: boolean
    formattedValue?: boolean
    date?: boolean
    time?: boolean
}

const NEW_LINE = '\r\n'

export const generateTransactionHistoryCsvFromAccount = (
    WalletAccount: WalletAccount,
    headerParams: ITransactionHistoryHeaderParameters
): string => {
    const headerParts = []
    headerParams.id && headerParts.push('message id')
    headerParams.internal && headerParts.push('internal')
    headerParams.value && headerParts.push('raw value (iota)')
    headerParams.formattedValue && headerParts.push('formatted value')
    headerParams.date && headerParts.push('date')
    headerParams.time && headerParts.push('time (UTC)')

    let csv = headerParts.join(',') + NEW_LINE

    WalletAccount.messages.forEach((message) => {
        const { id, timestamp } = message
        if (message.payload.type === 'Transaction') {
            const { internal, incoming, value } = message.payload.data.essence.data
            const valueString = incoming ? String(value) : '-' + value
            const formattedValueString = incoming
                ? formatUnitBestMatch(value, true)
                : '-' + formatUnitBestMatch(value, true)

            const timestampParts = timestamp.split(/[TZ.]/, 2)

            const csvLineParts: string[] = []
            headerParams.id && csvLineParts.push(String(id))
            headerParams.internal && csvLineParts.push(String(internal))
            headerParams.value && csvLineParts.push(valueString)
            headerParams.formattedValue && csvLineParts.push(formattedValueString)
            headerParams.date && csvLineParts.push(String(timestampParts[0]))
            headerParams.date && csvLineParts.push(timestampParts[1])

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

    return sanatiseFilename(fileName)
}

// TODO: Refactor out of this file
const sanatiseFilename = (s: string) => {
    return s.replace(/[^a-z0-9-]/gi, '-').replace(/-{2,}/g, '-')
}

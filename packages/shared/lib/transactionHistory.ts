import { IAccountState } from '@core/account'
import { formatDate, localize } from '@core/i18n'
import { formatIotaUnitBestMatch } from '@core/utils'

interface ITransactionHistoryHeaderParameters {
    id?: boolean
    internal?: boolean
    value?: boolean
    formattedValue?: boolean
    date?: boolean
    time?: boolean
}

const NEW_LINE = '\r\n'

export function generateTransactionHistoryCsvFromAccount(
    IAccountState: IAccountState,
    headerParams: ITransactionHistoryHeaderParameters
): string {
    const headerParts = []
    headerParams.id && headerParts.push(localize('exports.transactionHistoryCsv.messageId'))
    headerParams.internal && headerParts.push(localize('exports.transactionHistoryCsv.internal'))
    headerParams.value && headerParts.push(localize('exports.transactionHistoryCsv.rawValue'))
    headerParams.formattedValue && headerParts.push(localize('exports.transactionHistoryCsv.formattedValue'))
    headerParams.date && headerParts.push(localize('exports.transactionHistoryCsv.date'))
    headerParams.time && headerParts.push(localize('exports.transactionHistoryCsv.time'))

    let csv = headerParts.join(',') + NEW_LINE

    IAccountState.messages.forEach((message) => {
        const { id, timestamp } = message
        if (message.payload.type === 'Transaction') {
            const { internal, incoming, value } = message.payload.data.essence.data
            const valueString = incoming ? String(value) : '-' + value
            const formattedValueString = incoming
                ? formatIotaUnitBestMatch(value, true)
                : '-' + formatIotaUnitBestMatch(value, true)
            let date
            let time
            try {
                date = formatDate(new Date(timestamp), {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                })
                time = formatDate(new Date(timestamp), {
                    hour: 'numeric',
                    minute: 'numeric',
                    timeZoneName: 'short',
                })
            } catch {
                date = localize('error.invalidDate')
                time = localize('error.invalidTime')
            }

            const csvLineParts: string[] = []
            headerParams.id && csvLineParts.push(String(id))
            headerParams.internal && csvLineParts.push(String(internal))
            headerParams.value && csvLineParts.push(valueString)
            headerParams.formattedValue && csvLineParts.push(formattedValueString)
            headerParams.date && csvLineParts.push(date)
            headerParams.time && csvLineParts.push(time)

            const csvLine = csvLineParts.join(',') + NEW_LINE
            csv = csv + csvLine
        }
    })

    return csv
}

export function generateTransactionHistoryFileName(profileName: string, accountAlias: string): string {
    const DEFAULT_FILE_NAME_PATTERN = 'firefly-transaction-history-{{profileName}}-{{accountAlias}}-{{date}}'
    const tzoffset = new Date().getTimezoneOffset() * 60000 // offset in milliseconds
    const localISOTime = new Date(Date.now() - tzoffset).toISOString()
    const date = localISOTime.slice(0, -5)

    const fileName = DEFAULT_FILE_NAME_PATTERN.replace('{{profileName}}', profileName.toLowerCase())
        .replace('{{accountAlias}}', accountAlias.toLowerCase())
        .replace('{{date}}', date)

    return sanitisedFilename(fileName)
}

// TODO: Refactor out of this file
const sanitisedFilename = (s: string): string => s.replace(/[^a-z0-9-]/gi, '-').replace(/-{2,}/g, '-')

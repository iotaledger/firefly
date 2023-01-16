import { formatDate } from '@core/i18n'

export function getFormattedTimeStamp(date: Date): string {
    try {
        if (date) {
            return formatDate(date, {
                dateStyle: 'long',
                timeStyle: 'medium',
            })
        } else {
            return undefined
        }
    } catch (err) {
        return undefined
    }
}

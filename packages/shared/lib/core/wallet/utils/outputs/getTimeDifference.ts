import {
    HOURS_PER_DAY,
    MILLISECONDS_PER_SECOND,
    MINUTES_PER_HOUR,
    SECONDS_PER_DAY,
    SECONDS_PER_MINUTE,
} from '@core/utils'

export function getTimeDifference(lateDate: Date, earlyDate: Date): string {
    const elapsedTime = lateDate.getTime() - earlyDate.getTime()
    const days = Math.floor(elapsedTime / (MILLISECONDS_PER_SECOND * SECONDS_PER_DAY))
    const hours = Math.floor(
        (elapsedTime / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR)) % HOURS_PER_DAY
    )
    const minutes = Math.floor((elapsedTime / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)) % MINUTES_PER_HOUR)
    const seconds = Math.floor((elapsedTime / MILLISECONDS_PER_SECOND) % SECONDS_PER_MINUTE)

    if (days > 0 || hours > 0) {
        return `${days}d ${hours}h`
    } else if (minutes > 0) {
        return `${minutes}min`
    } else if (seconds > 0) {
        return '<1min'
    } else {
        return '-'
    }
}

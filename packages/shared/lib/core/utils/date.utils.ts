export function datesOnSameDay(first: Date, second: Date): boolean {
    return (
        first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate()
    )
}

export function dateIsBeforeOtherDate(first: Date, second: Date): boolean {
    return first < second && !datesOnSameDay(first, second)
}

export function dateIsAfterOtherDate(first: Date, second: Date): boolean {
    return first > second && !datesOnSameDay(first, second)
}

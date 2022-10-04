import { IGNORED_ERROR_REGEXES } from '../constants'

export function shouldReportError(errorMessage: string): boolean {
    return !IGNORED_ERROR_REGEXES.some((regex) => regex.test(errorMessage))
}

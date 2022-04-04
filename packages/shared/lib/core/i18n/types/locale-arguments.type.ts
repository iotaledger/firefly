type LocaleValue = string | number | unknown

/**
 * The type for providing dynamic data to the
 * locale function (e.g. names, numbers, dates).
 */
export type LocaleArguments = Record<string, LocaleValue>

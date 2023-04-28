export function resolveObjectPath(object: Record<string, unknown>, path: string, defaultValue: unknown = ''): unknown {
    if (!object || !path) {
        return defaultValue
    }

    return (
        path.split('.').reduce((currentObject, pathSegment) => currentObject && currentObject[pathSegment], object) ??
        defaultValue
    )
}

export function deepCopy<T>(object: T): T {
    return JSON.parse(JSON.stringify(object)) as T
}

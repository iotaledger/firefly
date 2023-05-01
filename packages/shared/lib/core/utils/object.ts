export function resolveObjectPath(object: Record<string, unknown>, path: string, defaultValue: unknown = ''): unknown {
    if (!object || !path) {
        return defaultValue
    }

    return path.split('.').reduce((o, p) => o && o[p], object) ?? defaultValue
}

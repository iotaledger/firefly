export function resolveObjectPath(object: Record<string, unknown>, path: string, defaultValue: unknown = ''): unknown {
    if (!object || !path) {
        return defaultValue
    }

    return (
        path.split('.').reduce((currentObject, pathSegment) => {
            if (currentObject) {
                const isArrayIndex = /\[[0-9]\]/.exec(pathSegment)
                if (isArrayIndex) {
                    const arrayIndex = isArrayIndex[0] // '[0]'
                    const arrayPath = pathSegment.replace(arrayIndex, '')
                    const index = parseInt(arrayIndex.substring(1, 2), 10)
                    return currentObject[arrayPath][index] || undefined
                } else {
                    return currentObject[pathSegment]
                }
            }
            return undefined
        }, object) ?? defaultValue
    )
}

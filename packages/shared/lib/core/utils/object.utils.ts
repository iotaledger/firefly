/**
 * Migrates an object to a newer version keeping old data if it already exists and
 * adds new data if the property doesn't exist.
 *
 * @param oldObj The object whose keys and data will be used if found and matching the newer version
 * @param newObj The object whose keys and data will be used if not found on older version
 *
 * @returns The resulting object of migrating from an older version to a newer one (i.e. updated keys and / or data)
 */
export function migrateObjects<T>(oldObj: T, newObj: T): T {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const _helper = (curObj: any, oldObj: any, newObj: any): any => {
        // Iterate through each key of a new object...
        for (const k in newObj) {
            // If key also exists in old object then...
            if (k in oldObj) {
                // If corresponding value in the new object is also an object and is not undefined or null then...
                if (typeof newObj[k] === 'object' && newObj[k] !== undefined && newObj[k] !== null) {
                    // If corresponding value is actually an array (b/c an "Array" is an object in JS) then...
                    if (Array.isArray(newObj[k])) {
                        // Create key-value pair with array from new object or old object if it already exists
                        curObj[k] = Array.isArray(oldObj[k]) ? oldObj[k] : newObj[k]
                        // Else corresponding value is really an object, so...
                    } else {
                        // Create key-value pair with this function called on nested object
                        curObj[k] = _helper({}, oldObj[k], newObj[k])
                    }
                    // Else corresponding value is NOT an object, so...
                } else {
                    // We can just simply assign the value from the old object
                    curObj[k] = oldObj[k]
                }
                // Else the key does NOT exist in the old object, so...
            } else {
                // We create a new key-value pair with the value from the new object
                curObj[k] = newObj[k]
            }
        }

        return curObj
    }

    return _helper({}, oldObj, newObj) as T
}

export function resolveObjectPath(object: Record<string, any>, path: string, defaultValue: unknown = ''): unknown {
    if (!object || !path) {
        return defaultValue
    }

    return path.split('.').reduce((o, p) => o && o[p], object) ?? defaultValue
}

export function deepCopy<T>(object: T): T {
    return JSON.parse(JSON.stringify(object)) as T
}

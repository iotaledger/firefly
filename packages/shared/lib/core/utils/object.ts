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
        // Iterate through each key of a new AND old objects...
        for (const key in { ...oldObj, ...newObj }) {
            // If key also exists in old object then...
            if (key in oldObj) {
                // If corresponding value in the new object is also an object and is not undefined or null then...
                if (typeof newObj[key] === 'object' && newObj[key] !== undefined && newObj[key] !== null) {
                    // If corresponding value is actually an array (b/c an "Array" is an object in JS) then...
                    if (Array.isArray(newObj[key])) {
                        // Create key-value pair with array from new object or old object if it already exists
                        curObj[key] = Array.isArray(oldObj[key]) ? oldObj[key] : newObj[key]
                        // Else if corresponding value is actually a date
                    } else if (typeof newObj[key]['getMonth'] === 'function') {
                        curObj[key] = newObj[key]
                        // Else corresponding value is really an object, so...
                    } else {
                        // Create key-value pair with this function called on nested object
                        curObj[key] = _helper({}, oldObj[key], newObj[key])
                    }
                    // Else corresponding value is NOT an object, so...
                } else {
                    // We can just simply assign the value from the old object
                    curObj[key] = oldObj[key]
                }
                // Else the key does NOT exist in the old object, so...
            } else {
                // We create a new key-value pair with the value from the new object
                curObj[key] = newObj[key]
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

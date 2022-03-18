/**
 * Returns a new object of the same type with updated data.
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

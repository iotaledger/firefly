export function isFunction(fn: () => unknown): boolean {
    return typeof fn === 'function'
}

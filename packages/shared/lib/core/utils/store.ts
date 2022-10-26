import { writable, Writable } from 'svelte/store'

/**
 * Persist a writable Svelte store to local storage
 */
export const persistent = <T>(key: string, initialValue: T): Writable<T> => {
    let value = initialValue

    try {
        const json = localStorage.getItem(key)
        if (json) {
            value = JSON.parse(json)
        }
    } catch (err) {
        console.error(err)
    }

    const state = writable(value)

    state.subscribe(($value): void => {
        if ($value === undefined || $value === null) {
            localStorage.removeItem(key)
        } else {
            localStorage.setItem(key, JSON.stringify($value))
        }
    })

    return state
}

import { writable, Writable } from 'svelte/store'
import { view } from './router'

/**
 * Sets next route
 *
 * @method setRoute
 *
 * @param {string} path
 *
 * @returns {void}
 */
export const setRoute = (path: string): void => {
    view.set(path)
}

/**
 * Update application path
 */
export const goto = (path: string): void => {
    window.location.hash = path
}

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
        localStorage.setItem(key, JSON.stringify($value))
    })

    return state
}

/**
 * Shuffle an array
 */
export const shuffleArray = (array) => array.sort(() => Math.random() - 0.5)

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
        localStorage.setItem(key, JSON.stringify($value))
    })

    return state
}

export const safeAssign = (target: { [key: string]: any }, ...sources: { [key: string]: any }[]): Object => {
    // Based on Object.assign polyfill
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
    'use strict';
    if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
    }

    const to = Object(target);

    for (let index = 0; index < sources.length; index++) {
        const nextSource = sources[index];

        if (nextSource !== null && nextSource !== undefined) {
            for (const nextKey in nextSource) {
                // Avoid prototype pollution by not merging prototype, __proto__, or constructor properties
                if (nextKey === 'prototype' || nextKey === '__proto__' || nextKey === 'constructor') {
                    continue;
                }
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                    to[nextKey] = nextSource[nextKey];
                }
            }
        }
    }
    return to;
};

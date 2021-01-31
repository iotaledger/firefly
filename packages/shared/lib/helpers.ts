import { writable, Writable } from 'svelte/store'

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
export const shuffleArray = (array) => array.slice().sort(() => Math.random() - 0.5)

/**
 * Extract initials from string
 */
export const getInitials = (string: string, maxChars: number) => {
    let initialsArray: string[] = string.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g);
    if (maxChars) {
        initialsArray = initialsArray.slice(0, maxChars)
    }
    let initials = initialsArray.join('').toUpperCase()
    return initials
}

/**
 * Truncate strings
 *  
 * @param str: String which has to be truncated
 * @param firstCharCount: Number of characters which has to be shown as first portion. Default = 5
 * @param endCharCount: Number of characters which has to be shown at end portion. Default = 5
 * @param dotCount: Count of dots in between first and end portion. Default = 3
 */

export const truncateString = (str: string, firstCharCount: number = 5, endCharCount: number = 5, dotCount: number = 3) => {
    const MAX_LENGTH = 13
    if (str.length <= MAX_LENGTH) {
        return str
    }
    let convertedStr = "";
    convertedStr += str.substring(0, firstCharCount);
    convertedStr += ".".repeat(dotCount);
    convertedStr += str.substring(str.length - endCharCount, str.length);
    return convertedStr;
}

/**
 * Set text to clipboard
 */
export const setClipboard = (input: string): boolean => {
    try {
        const textArea = document.createElement('textarea')
        textArea.value = input
        document.body.appendChild(textArea)

        if (navigator.userAgent.match(/ipad|iphone/i)) {
            const range = document.createRange()
            range.selectNodeContents(textArea)
            const selection = window.getSelection()
            selection.removeAllRanges()
            selection.addRange(range)
            textArea.setSelectionRange(0, 999999)
        } else {
            textArea.select()
        }

        document.execCommand('copy')
        document.body.removeChild(textArea)

        return true
    } catch (err) {
        console.log(err)
        return false
    }
}
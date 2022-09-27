import { writable } from 'svelte/store'

export const keyboardHeight = writable<number>(0)

export const isKeyboardOpen = writable<boolean>(false)

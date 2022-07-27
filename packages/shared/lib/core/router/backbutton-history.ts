import { writable } from 'svelte/store'

/**
 * Tracks routing functions to process them sequentially if a back button is clicked/pressed.
 * Optionally, a function can be passed that closes the app as the last element
 */
export class BackButtonHeap {
    constructor(private _closeFunc: () => unknown = () => {}) {}

    private _heap: { (): Promise<void> }[] = []

    add(func: () => Promise<void>): void {
        this._heap.push(func)
    }

    remove(): () => Promise<void> {
        return this._heap.pop()
    }

    /**
     * Initializes the heap and puts the app close function as the first element
     */
    refresh(): void {
        this._heap = [this._closeFunc as () => Promise<void>]
    }
}

export const backButtonStore = writable<BackButtonHeap>(null)

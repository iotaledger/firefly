import { readable } from 'svelte/store'

export const time = readable(null, (set) => {
    set(new Date())

    const interval = setInterval(() => {
        set(new Date())
    }, 1000)

    return (): void => clearInterval(interval)
})

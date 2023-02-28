import { readable, Readable } from 'svelte/store'

export const time: Readable<Date> = readable(null, (set) => {
    set(new Date())

    const interval = setInterval(() => {
        set(new Date())
    }, 1000)

    return (): void => clearInterval(interval)
})

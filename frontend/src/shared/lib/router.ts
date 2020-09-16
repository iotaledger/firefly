import { readable } from 'svelte/store'
import { notification } from './app'

/**
 * Application path based on location hash
 */
const path = readable<string>(null, (set) => {
    const updatePath = (): void => {
        const pathName = window.location.hash.substr(1)
        set(pathName)

        notification.set(null)
    }

    window.addEventListener('hashchange', updatePath)
    updatePath()

    return (): void => {
        window.removeEventListener('hashchange', updatePath)
    }
})

export default path

import { persistent } from '@lib/helpers'

export const activeProfileId = persistent<string>('activeProfileId', null)

/**
 * Sets profile with provided id as active
 * @method setActiveProfileId
 * @param {string} id
 * @returns {void}
 */
export function setActiveProfileId(id: string): void {
    activeProfileId.set(id)
}

/**
 * Resets the active profile ID
 * @method resetActiveProfileId
 * @returns {void}
 */
export function resetActiveProfileId(): void {
    activeProfileId.set(null)
}

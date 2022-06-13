import { PROFILE_VERSION } from '../../constants'

/**
 * Returns true if a profile is outdated according to its version.
 */
export function isActiveProfileOutdated(version: number): boolean {
    version = version ?? -1
    return version < PROFILE_VERSION
}

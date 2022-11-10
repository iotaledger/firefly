import { AppTheme } from '../enums'

/**
 * NOTE: This media query is performed only once to help make the UX
 * consistent across OS platforms. To be specific, it ensures that users
 * are required to restart Firefly for system theme changes to take effect.
 * This is because the behaviour of this media query is different among platforms,
 * e.g. queries on MacOS result in up-to-date information whereas Linux-based platforms
 * result in stale information.
 */
const IS_SYSTEM_IN_DARK_MODE = window.matchMedia('(prefers-color-scheme: dark)').matches

/**
 * Returns true if the application should be in dark mode based off of
 * a given theme.
 */
export const shouldBeDarkMode = (theme: AppTheme): boolean => {
    switch (theme) {
        case AppTheme.Light:
            return false
        case AppTheme.Dark:
            return true
        case AppTheme.System:
            return IS_SYSTEM_IN_DARK_MODE
        default:
            return false
    }
}

import { cleanupSignup, login, strongholdPassword, walletPin } from 'shared/lib/app'
import { profiles, updateProfile } from 'shared/lib/profile'
import { selectedAccountId } from 'shared/lib/wallet'
import { AccountRoutes, AppRoute, SettingsRoutes, SetupType, Tabs, WalletRoutes } from 'shared/lib/typings/routes'
import { get, readable, writable } from 'svelte/store'
import { deepLinkRequestActive } from './deepLinking'

/**
 * Sets next route
 *
 * @method setRoute
 *
 * @param {string} path
 *
 * @returns {void}
 */
export const setRoute = (path: string): void => {
    appRoute.set(path)
}

/**
 * Application path based on location hash
 */
export const path = readable<string>(null, (set) => {
    const updatePath = (): void => {
        const pathName = window.location.hash.substr(1)
        set(pathName)
    }

    window.addEventListener('hashchange', updatePath)
    updatePath()

    return (): void => {
        window.removeEventListener('hashchange', updatePath)
    }
})

/**
 * Onboarding/setup type
 */
export const walletSetupType = writable<SetupType>(null)

/*
 * Current view
 */
export const appRoute = writable<string>(null)

/**
 * Application route history
 */
const history = writable<Array<string>>([])

/**
 * Active dashboard tab
 */
export const dashboardRoute = writable<Tabs>(Tabs.Wallet)

/**
 * Wallet view route
 */
export const walletRoute = writable<WalletRoutes>(WalletRoutes.Init)

/**
 * Account view route
 */
export const accountRoute = writable<AccountRoutes>(AccountRoutes.Init)

/**
 * Settings view route
 */
export const settingsRoute = writable<SettingsRoutes>(SettingsRoutes.Init)

/**
 * Settings child route
 */
export const settingsChildRoute = writable<string>(null)

/**
 * Navigate to initial route
 */
export const initRouter = () => {
    let hasCompletedSetup: boolean = get(profiles).length > 0

    if (hasCompletedSetup) {
        setRoute(AppRoute.Login)
    } else {
        setRoute(AppRoute.Welcome)
    }
}

// TODO: only handle route changes, not app variables
export const routerNext = (event) => {
    let params = event.detail || {}
    const currentRoute: string = get(appRoute)
    let nextRoute: AppRoute

    switch (currentRoute) {
        case AppRoute.Login:
            const { shouldAddProfile } = params

            if (shouldAddProfile) {
                nextRoute = AppRoute.Setup
            } else {
                login()
                nextRoute = AppRoute.Dashboard
            }
            break
        case AppRoute.Dashboard:
            const { reset } = params

            if (reset) {
                nextRoute = AppRoute.Login
            }
            break
        case AppRoute.Welcome:
            nextRoute = AppRoute.Legal
            break
        case AppRoute.Legal:
            nextRoute = AppRoute.Appearance
            break
        case AppRoute.Appearance:
            nextRoute = AppRoute.Setup
            break
        case AppRoute.Setup:
            const { setupType } = params
            if (setupType) {
                walletSetupType.set(setupType)
                if (setupType === SetupType.New) {
                    nextRoute = AppRoute.Secure
                } else if (setupType === SetupType.Import) {
                    nextRoute = AppRoute.Import
                }
            }
            break
        case AppRoute.Secure:
            nextRoute = AppRoute.Password
            break
        case AppRoute.Password:
            const { password } = params
            if (password) {
                strongholdPassword.set(password)
                nextRoute = AppRoute.Protect
            }
            break
        case AppRoute.Protect:
            const { pin } = params
            if (pin) {
                walletPin.set(pin)
                if (get(walletSetupType) === SetupType.Mnemonic || get(walletSetupType) === SetupType.Stronghold) {
                    nextRoute = AppRoute.Congratulations
                } else {
                    nextRoute = AppRoute.Backup
                }
            }
            break
        case AppRoute.Backup:
            if (get(walletSetupType) === SetupType.Seed || get(walletSetupType) === SetupType.Seedvault) {
                nextRoute = AppRoute.Migrate
            } else {
                nextRoute = AppRoute.Congratulations
            }
            break
        case AppRoute.Import:
            nextRoute = AppRoute.Congratulations
            const { importType } = params
            walletSetupType.set(importType)
            if (importType === SetupType.Mnemonic) {
                nextRoute = AppRoute.Secure
            } else if (importType === SetupType.Stronghold) {
                nextRoute = AppRoute.Protect
            } else if (importType === SetupType.Seed || importType === SetupType.Seedvault) {
                nextRoute = AppRoute.Balance
            }
            break
        case AppRoute.Balance:
            nextRoute = AppRoute.Password
            break
        case AppRoute.Migrate:
            nextRoute = AppRoute.Congratulations
            break
        case AppRoute.Congratulations:
            updateProfile('gapLimit', get(walletSetupType) === SetupType.New ? 10 : 50)
            cleanupSignup()
            login()
            nextRoute = AppRoute.Dashboard
            break
    }

    // Update history and navigate to new route
    if (nextRoute) {
        history.update((_history) => {
            _history.push(currentRoute)
            return _history
        })
        setRoute(nextRoute)
    } else {
        console.error('Routing Error: Could not find next route')
    }
}

// TODO: only handle route changes, not app variables
export const routerPrevious = () => {
    let previousRoute: AppRoute

    history.update((_history) => {
        previousRoute = _history.pop() as AppRoute
        return _history
    })

    if (previousRoute) {
        setRoute(previousRoute)
    }
}

export const resetRouter = () => {
    history.set([])
    let hasCompletedSetup: boolean = get(profiles).length > 0
    if (hasCompletedSetup) {
        setRoute(AppRoute.Login)
    } else {
        setRoute(AppRoute.Welcome)
    }

    walletRoute.set(WalletRoutes.Init)
    accountRoute.set(AccountRoutes.Init)
    settingsRoute.set(SettingsRoutes.Init)
    dashboardRoute.set(Tabs.Wallet)
    deepLinkRequestActive.set(false)
}

export const resetWalletRoute = () => {
    dashboardRoute.set(Tabs.Wallet)
    walletRoute.set(WalletRoutes.Init)
    accountRoute.set(AccountRoutes.Init)
    selectedAccountId.set(null)
}
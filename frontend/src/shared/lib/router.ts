import { readable, writable, get } from 'svelte/store'
import { notification, walletPin, strongholdPassword, mnemonic } from '@shared-lib/app'
import { goto, setRoute } from '@shared-lib/helpers'
import { generateRecoveryPhrase } from '@shared-lib/utils'

/**
 * Application path based on location hash
 */
export const path = readable<AppRoute>(null, (set) => {
    const updatePath = (): void => {
        const pathName = window.location.hash.substr(1)
        set(pathName as AppRoute)
        notification.set(null)
    }

    window.addEventListener('hashchange', updatePath)
    updatePath()

    return (): void => {
        window.removeEventListener('hashchange', updatePath)
    }
})

/*
* Current view
*/
export const view = writable<string>('')

/**
 * Application Routes
 */
export enum AppRoute {
    Welcome = "welcome",
    Legal = "legal",
    Setup = "setup",
    Password = "password",
    Protect = "protect",
    Backup = "backup",
    Import = "import",
    Migrate = "migrate",
    Balance = "balance",
    Congratulations = "congratulations",
    Dashboard = "dashboard",
}

enum SetupType {
    New = 'new',
    Import = 'import',
    Mnemonic = 'mnemonic',
    Seed = 'seed',
    Stronghold = 'stronghold',
    Seedvault = 'seedvault',
}

/**
 * Application route history
 */
const history = writable<Array<AppRoute>>([])

/**
 * Onboarding/setup type
 */
let walletSetupType = writable<SetupType>(null)

/**
 * Navigate to initial route
 */
export const initRouter = () => {
    setRoute(AppRoute.Import)
    // let userLogged: boolean = get(logged)
    // if (userLogged) {
    //     setRoute(AppRoute.Dashboard)
    // } else {
    //     setRoute(AppRoute.Welcome)
    // }
}

export const requestMnemonic = () => {
    let recovPhrase = generateRecoveryPhrase()
    mnemonic.set(recovPhrase)
}

// TODO: only handle route changes, not app variables
export const routerNext = (event) => {
    let params = event.detail || {}
    let currentRoute: AppRoute = get(path)
    let nextRoute: AppRoute

    switch (currentRoute) {
        case AppRoute.Welcome:
            nextRoute = AppRoute.Legal
            break
        case AppRoute.Legal:
            nextRoute = AppRoute.Setup
            break
        case AppRoute.Setup:
            const { setupType } = params
            if (setupType) {
                walletSetupType.set(setupType)
                if (setupType === SetupType.New) {
                    nextRoute = AppRoute.Password
                }
                else if (setupType === SetupType.Import) {
                    nextRoute = AppRoute.Import
                }
            }
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
                }
                else {
                    nextRoute = AppRoute.Backup
                }
            }
            break
        case AppRoute.Backup:
            nextRoute = AppRoute.Congratulations
            break
        case AppRoute.Import:
            nextRoute = AppRoute.Congratulations
            const { importType } = params
            walletSetupType.set(importType)
            if (importType === SetupType.Mnemonic) {
                nextRoute = AppRoute.Password
            }
            else if (importType === SetupType.Seed || importType === SetupType.Seedvault) {
                nextRoute = AppRoute.Balance
            }
            else if (importType === SetupType.Stronghold) {
                nextRoute = AppRoute.Protect
            }
            break
        case AppRoute.Balance:
            nextRoute = AppRoute.Password
            break
        case AppRoute.Congratulations:
            nextRoute = AppRoute.Dashboard
            break
    }

    // Update history and navigate to new route
    if (nextRoute) {
        history.update(_history => {
            _history.push(currentRoute)
            return _history
        })
        setRoute(nextRoute)
    }
    else {
        console.error('Routing Error: Could not find next route')
    }
}
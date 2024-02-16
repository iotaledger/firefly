import { AppContext } from '@core/app/enums'
import { IRouter } from '@core/router/interfaces'
import { updateStrongholdRouter } from '@core/router'
import { get } from 'svelte/store'

export function getSubroutersForAppContext(context: AppContext): IRouter[] {
    switch (context) {
        case AppContext.Dashboard:
            return []
        case AppContext.Login:
            return [get(updateStrongholdRouter)]
        case AppContext.Onboarding:
            return []
        case AppContext.Settings:
            return []
        default:
            return []
    }
}

import { IRouter } from '@core/router/interfaces'
import { Writable } from 'svelte/store'
import { accountActionsRouter, profileRouter, sendRouter } from '../../../routers'
import { DrawerId } from '../enums'

export function getDrawerRouter(drawerId: DrawerId): Writable<IRouter> | undefined {
    switch (drawerId) {
        case DrawerId.AccountActions:
            return accountActionsRouter
        case DrawerId.Profile:
            return profileRouter
        case DrawerId.Send:
            return sendRouter
        case DrawerId.AccountSwitcher:
        case DrawerId.SelectedToken:
        case DrawerId.Legal:
        case DrawerId.SelectedActivity:
        case DrawerId.EnterPassword:
        case DrawerId.AddReferences:
        case DrawerId.AddExpiration:
        case DrawerId.Confirm:
        case DrawerId.Receive:
            return undefined
    }
}

import { Writable } from 'svelte/store'
import { accountActionsRouter, accountSwitcherRouter, profileRouter, sendRouter, tokenRouter } from '../../../routers'
import { DrawerId } from '../enums'

export function getDrawerRouter(drawerId: DrawerId): Writable<unknown> | undefined {
    switch (drawerId) {
        case DrawerId.AccountActions:
            return accountActionsRouter
        case DrawerId.AccountSwitcher:
            return accountSwitcherRouter
        case DrawerId.Profile:
            return profileRouter
        case DrawerId.Send:
            return sendRouter
        case DrawerId.SelectedToken:
            return tokenRouter
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

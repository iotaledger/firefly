import { get, writable } from 'svelte/store'
import { Router } from '@core/router'
import { openPopup, PopupId } from '@auxiliary/popup'

export enum SendRoute {
    SelectAsset = 'selectAsset',
    SendForm = 'sendForm',
    SendConfirmation = 'sendConfirmation',
}

export const sendRoute = writable<SendRoute>(null)
export const sendRouter = writable<SendRouter>(null)

export class SendRouter extends Router<SendRoute> {
    constructor() {
        super(SendRoute.SelectAsset, sendRoute)
    }

    next(): void {
        let nextRoute: SendRoute

        switch (get(this.routeStore)) {
            case SendRoute.SelectAsset:
                nextRoute = SendRoute.SendForm
                openPopup({
                    id: PopupId.SendForm,
                    overflow: true,
                })
                break
            case SendRoute.SendForm:
                nextRoute = SendRoute.SendConfirmation
                openPopup({
                    id: PopupId.SendConfirmation,
                    overflow: true,
                })
                break
            case SendRoute.SendConfirmation:
                break
        }

        this.setNext(nextRoute)
    }

    previous(): void {
        const lastRoute = this.history.pop()
        this.history.push(lastRoute)
        super.previous()

        switch (lastRoute) {
            case SendRoute.SelectAsset:
                openPopup({
                    id: PopupId.SelectAsset,
                    overflow: true,
                })
                break
            case SendRoute.SendForm:
                openPopup({
                    id: PopupId.SendForm,
                    overflow: true,
                })
                break
            default:
                break
        }
    }
}

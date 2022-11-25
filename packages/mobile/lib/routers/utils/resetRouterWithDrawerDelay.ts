import { IRouter } from '@core/router/interfaces'
import { DRAWER_OUT_ANIMATION_DURATION_MS } from '../../contexts/dashboard'

export function resetRouterWithDrawerDelay(router: IRouter): void {
    const SAFE_DELAY_MS = 50
    setTimeout(() => {
        router?.reset()
    }, DRAWER_OUT_ANIMATION_DURATION_MS + SAFE_DELAY_MS)
}

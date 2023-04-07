import { CollectiblesSettingsRoute } from '@core/router'
import { MaxMediaSize, RefreshNftMedia } from '.'

export const COLLECTIBLES_SETTINGS = [
    {
        component: MaxMediaSize,
        childRoute: CollectiblesSettingsRoute.MaxMediaSize,
    },
    {
        component: RefreshNftMedia,
        childRoute: CollectiblesSettingsRoute.RefreshNftMedia,
    },
]

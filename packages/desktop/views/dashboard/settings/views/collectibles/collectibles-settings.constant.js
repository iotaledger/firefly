import { CollectiblesSettingsRoute } from '@core/router'
import { MaxMediaDownloadTime, MaxMediaSize, RefreshNftMedia } from '.'

export const COLLECTIBLES_SETTINGS = [
    {
        component: MaxMediaDownloadTime,
        childRoute: CollectiblesSettingsRoute.MaxMediaDownloadTime,
    },
    {
        component: MaxMediaSize,
        childRoute: CollectiblesSettingsRoute.MaxMediaSize,
    },
    {
        component: RefreshNftMedia,
        childRoute: CollectiblesSettingsRoute.RefreshNftMedia,
    },
]

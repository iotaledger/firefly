import { NetworkSettingsRoute } from '@core/router'
import { NetworkInformation, ConfigureNodeList } from './'

export const NETWORK_SETTINGS = [
    { component: NetworkInformation, childRoute: NetworkSettingsRoute.NetworkInformation },
    { component: ConfigureNodeList, childRoute: NetworkSettingsRoute.ConfigureNodeList },
]

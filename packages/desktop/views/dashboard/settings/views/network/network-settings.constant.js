import { NetworkSettingsRoute } from '@core/router'
import { NetworkConfiguration } from './'

export const NETWORK_SETTINGS = [
    { component: NetworkConfiguration, childRoute: NetworkSettingsRoute.NetworkConfiguration },
]

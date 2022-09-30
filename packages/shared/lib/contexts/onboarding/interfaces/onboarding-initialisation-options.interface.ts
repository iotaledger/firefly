import { NetworkProtocol, NetworkType } from '@core/network'

export interface IOnboardingInitialisationOptions {
    isDeveloperProfile: boolean
    networkProtocol: NetworkProtocol
    networkType?: NetworkType
    resetProfileManagers?: boolean
    resetRouters?: boolean
}

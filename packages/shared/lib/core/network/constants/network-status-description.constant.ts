import { NetworkHealth } from '../enums'

export const NETWORK_STATUS_DESCRIPTION: Readonly<{ [key in NetworkHealth]: string }> = {
    [NetworkHealth.Down]: 'down',
    [NetworkHealth.Degraded]: 'degraded',
    [NetworkHealth.Operational]: 'operational',
    [NetworkHealth.Disconnected]: 'disconnected',
}

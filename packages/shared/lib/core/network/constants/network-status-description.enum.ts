import { NetworkHealth } from '../enums'

export const NetworkStatusDescription = {
    [NetworkHealth.Down]: 'down',
    [NetworkHealth.Degraded]: 'degraded',
    [NetworkHealth.Operational]: 'operational',
    [NetworkHealth.Disconnected]: 'disconnected',
}

import { NetworkHealth } from '../enums/network-health.enum'

export const NETWORK_HEALTH_COLORS = {
    [NetworkHealth.Down]: 'red',
    [NetworkHealth.Degraded]: 'yellow',
    [NetworkHealth.Operational]: 'green',
    [NetworkHealth.Disconnected]: 'red',
}

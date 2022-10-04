import { NetworkHealth } from '../enums/network-health.enum'

export const NETWORK_HEALTH_COLORS: Readonly<{ [key in NetworkHealth]: string }> = {
    [NetworkHealth.Down]: 'red',
    [NetworkHealth.Degraded]: 'yellow',
    [NetworkHealth.Operational]: 'green',
    [NetworkHealth.Disconnected]: 'red',
}

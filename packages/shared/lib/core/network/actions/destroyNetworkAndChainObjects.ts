import { resetChains, resetNetwork } from '../stores'

export function destroyNetworkAndChainObjects(): void {
    resetNetwork()
    resetChains()
}

import { StardustNetwork } from '../classes'
import { network } from '../stores'

export function buildNetworkAndChains(): void {
    buildNetwork()
}

function buildNetwork(): void {
    network.set(new StardustNetwork())
}

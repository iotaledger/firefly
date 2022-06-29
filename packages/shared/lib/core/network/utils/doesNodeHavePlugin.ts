enum NodePlugin {
    Participation = 'Participation',
    ProofOfWork = 'PoW',
}

export function doesNodeHavePlugin(plugin: NodePlugin): boolean {
    return Object.keys(NodePlugin).includes(plugin)
    // return get(networkStatus).nodePlugins.includes(plugin)
}

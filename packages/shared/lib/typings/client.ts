export interface Node {
    url: string
    auth?: {
        password: string
        username: string
    },
    disabled?: boolean
}

export interface ClientOptions {
    nodes?: Node[]
    node?: Node
    network?: string
    localPow?: boolean
    nodeSyncEnabled?: boolean
    nodePoolUrls?: string[]
}

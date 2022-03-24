export type BridgeMessage = {
    actorId: string
    // TODO: rename to messageId for clarity
    id: string
    cmd: string
    payload?: unknown
}

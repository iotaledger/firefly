import { Converter } from '@iota/util.js'

export function getAgentBalanceParameters(agentID: Uint8Array): {
    items: { key: Uint8Array; value: Uint8Array }[]
} {
    return {
        items: [
            {
                key: Converter.utf8ToBytes('a'),
                value: agentID,
            },
        ],
    }
}

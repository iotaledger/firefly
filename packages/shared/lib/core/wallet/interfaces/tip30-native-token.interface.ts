import { JSONSchemaType } from 'ajv'

export interface TIP30NativeToken {
    standard: string
    name: string
    description?: string
    symbol: string
    decimals: number
    url?: string
    logoUrl?: string
    logo?: string
}

export const nativeTokenSchema: JSONSchemaType<TIP30NativeToken> = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://github.com/iotaledger/tips/main/tips/TIP-0030/irc30.schema.json',
    title: 'IRC30 Native Token Metadata Schema',
    description: 'A JSON schema for IRC30 compliant native token metadata',
    type: 'object',
    properties: {
        standard: {
            description: 'The IRC standard of the token metadata',
            type: 'string',
            pattern: '^IRC30$',
        },
        name: {
            description: 'The human-readable name of the native token',
            type: 'string',
        },
        description: {
            description: 'The human-readable description of the token',
            type: 'string',
        },
        symbol: {
            description: 'The symbol/ticker of the token',
            type: 'string',
        },
        decimals: {
            description:
                'Number of decimals the token uses (divide the token amount by 10^decimals to get its user representation)',
            type: 'integer',
            minimum: 0,
        },
        url: {
            description: 'URL pointing to more resources about the token',
            type: 'string',
        },
        logoUrl: {
            description: 'URL pointing to an image resource of the token logo',
            type: 'string',
        },
        logo: {
            description: 'The svg logo of the token encoded as a byte string',
            type: 'string',
        },
    },
    required: ['standard', 'name', 'symbol', 'decimals'],
}

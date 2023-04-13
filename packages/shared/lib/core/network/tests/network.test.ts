import { ITokenMetadata } from '@core/wallet/interfaces'

import { IAuth, IClientOptions, INetwork, INode } from '../interfaces'

import { NetworkId, NetworkProtocol, NetworkType, TokenSupply } from '../enums'

import { checkNodeUrlValidity, cleanAuth, getDefaultClientOptions, getOfficialNodes, isOfficialNetwork } from '../utils'

describe('File: network.ts', () => {
    function _buildNode(url: string | undefined): INode | undefined {
        if (!url) {
            return undefined
        } else {
            return {
                url,
                disabled: false,
            }
        }
    }

    function _buildNodes(networkId: NetworkId) {
        return EXPECTED_NODE_URLS?.[networkId]?.map((url) => _buildNode(url)) ?? []
    }

    const EXPECTED_BASE_TOKEN: Readonly<{ [key in NetworkProtocol]: ITokenMetadata }> = {
        iota: {
            name: 'IOTA',
            tickerSymbol: 'MIOTA',
            unit: 'i',
            decimals: 0,
            subunit: null,
            useMetricPrefix: true,
            primaryColor: '#6E82A4',
        },
        shimmer: {
            name: 'Shimmer',
            tickerSymbol: 'SMR',
            unit: 'SMR',
            decimals: 6,
            subunit: 'glow',
            useMetricPrefix: false,
            primaryColor: '#25DFCA',
            url: 'https://shimmer.network/',
        },
    }

    const EXPECTED_NETWORK: Readonly<{ [key in NetworkId]?: INetwork }> = {
        [NetworkId.Iota]: {
            id: NetworkId.Iota,
            name: 'IOTA',
            protocol: {
                version: 1,
                networkName: 'iota',
                bech32Hrp: 'iota',
                minPowScore: 1500,
                belowMaxDepth: 15,
                rentStructure: {
                    vByteCost: 500,
                    vByteFactorData: 1,
                    vByteFactorKey: 10,
                },
                tokenSupply: TokenSupply.Iota,
            },
            baseToken: EXPECTED_BASE_TOKEN[NetworkProtocol.IOTA],
        },
        [NetworkId.Shimmer]: {
            id: NetworkId.Shimmer,
            name: 'Shimmer',
            protocol: {
                version: 2,
                networkName: 'shimmer',
                bech32Hrp: 'smr',
                minPowScore: 1500,
                belowMaxDepth: 15,
                rentStructure: {
                    vByteCost: 100,
                    vByteFactorData: 1,
                    vByteFactorKey: 10,
                },
                tokenSupply: TokenSupply.Shimmer,
            },
            baseToken: EXPECTED_BASE_TOKEN[NetworkProtocol.Shimmer],
        },
        [NetworkId.Testnet]: {
            id: NetworkId.Testnet,
            name: 'Testnet',
            protocol: {
                version: 2,
                networkName: 'testnet',
                bech32Hrp: 'rms',
                minPowScore: 1500,
                belowMaxDepth: 15,
                rentStructure: {
                    vByteCost: 100,
                    vByteFactorData: 1,
                    vByteFactorKey: 10,
                },
                tokenSupply: TokenSupply.Testnet,
            },
            baseToken: EXPECTED_BASE_TOKEN[NetworkProtocol.Shimmer],
        },
    }

    const EXPECTED_NODE_URLS: Readonly<{ [key in NetworkId]?: string[] }> = {
        [NetworkId.Iota]: [
            'https://chrysalis-nodes.iota.org',
            'https://chrysalis-nodes.iota.cafe',
            'https://mainnet-node.tanglebay.com',
        ],
        [NetworkId.Shimmer]: ['https://api.shimmer.network'],
        [NetworkId.Testnet]: ['https://api.testnet.shimmer.network'],
    }

    const EXPECTED_CLIENT_OPTIONS: Readonly<{ [key in NetworkId]?: IClientOptions }> = {
        [NetworkId.Iota]: {
            network: EXPECTED_NETWORK[NetworkId.Iota]?.id,
            nodes: _buildNodes(NetworkId.Iota) as INode[],
            localPow: true,
        },
        [NetworkId.Shimmer]: {
            network: EXPECTED_NETWORK?.[NetworkId.Shimmer]?.id,
            nodes: _buildNodes(NetworkId.Shimmer) as INode[],
            localPow: true,
        },
    }

    const EXPECTED_NODES: Readonly<{ [key in NetworkId]: (INode | undefined)[] }> = {
        [NetworkId.Iota]: _buildNodes(NetworkId.Iota),
        [NetworkId.Shimmer]: _buildNodes(NetworkId.Shimmer),
        [NetworkId.Testnet]: _buildNodes(NetworkId.Testnet),
        [NetworkId.Custom]: _buildNodes(NetworkId.Custom),
    }

    const EMPTY_NODE_AUTH = { basicAuthNamePwd: ['', ''] }
    const FAKE_NODE_AUTH = <IAuth>{
        basicAuthNamePwd: ['theUser', 'mY-rEaLlY-sEcUrE-pAsSwOrD'],
    }
    const FAKE_NODE_AUTH_JWT = <IAuth>{
        jwt: 'SOME JWT',
        basicAuthNamePwd: ['theUser', 'mY-rEaLlY-sEcUrE-pAsSwOrD'],
    }

    describe('Function: getClientOptions', () => {
        it('should return the client options of the active profile if present', () => {
            const clientOptions = getDefaultClientOptions(NetworkId.Iota)
            expect(clientOptions).toEqual(<IClientOptions>{
                nodes: [
                    _buildNode(EXPECTED_NODE_URLS?.[NetworkId.Iota]?.[0]),
                    _buildNode(EXPECTED_NODE_URLS?.[NetworkId.Iota]?.[1]),
                    _buildNode(EXPECTED_NODE_URLS?.[NetworkId.Iota]?.[2]),
                ],
            })
        })
    })

    describe('Function: getOfficialNodes', () => {
        it('should return the correct official nodes given a valid network type', () => {
            Object.values(NetworkId).forEach((networkId) => {
                if (networkId !== NetworkId.Custom) {
                    expect(getOfficialNodes(networkId)).toEqual(
                        EXPECTED_NODE_URLS?.[networkId]?.map((url) => _buildNode(url))
                    )
                }
            })
        })
        it('should return no official nodes given an invalid network type', () => {
            expect(getOfficialNodes(undefined)).toEqual([])
        })
    })

    describe('Function: isOfficialNetwork', () => {
        it('should return the correct values given a valid network type', () => {
            Object.values(NetworkType).forEach((networkType) => {
                if (networkType === NetworkType.PrivateNet) {
                    expect(isOfficialNetwork(networkType)).toBe(false)
                } else {
                    expect(isOfficialNetwork(networkType)).toBe(true)
                }
            })
        })
        it('should return false given an invalid network type', () => {
            expect(isOfficialNetwork(undefined)).toBe(false)
        })
    })

    describe('Function: cleanAuth', () => {
        it('should return an empty basic auth configuration given nothing', () => {
            expect(cleanAuth(<IAuth>{})).toEqual(EMPTY_NODE_AUTH)
            expect(cleanAuth(undefined)).toEqual(EMPTY_NODE_AUTH)
        })
        it('should return a basic auth configuration if given that', () => {
            expect(cleanAuth(FAKE_NODE_AUTH)).toEqual(FAKE_NODE_AUTH)
        })
        it('should return the entire auth configuration if the JWT exists', () => {
            expect(cleanAuth(<IAuth>{ jwt: 'SOME JWT' })).toEqual(<IAuth>{ jwt: 'SOME JWT' })
            expect(cleanAuth(FAKE_NODE_AUTH_JWT)).toEqual(FAKE_NODE_AUTH_JWT)
        })
    })

    describe('Function: checkNodeUrlValidity', () => {
        enum UrlError {
            Invalid = 'error.node.invalid',
            Insecure = 'error.node.https',
            Duplicate = 'error.node.duplicate',
        }

        const _check = (url: string, allowInsecure: boolean = false): string | undefined =>
            checkNodeUrlValidity(EXPECTED_NODES?.[NetworkId.Iota], url, allowInsecure)

        it('should return undefined for valid node URLs', () => {
            expect(_check('https://mainnet.tanglebay.com')).toBeUndefined()
            expect(_check(EXPECTED_NODE_URLS?.[NetworkId.Shimmer][0])).toBeUndefined()
        })
        it('should catch generally invalid URLs', () => {
            expect(_check('htps://mainnet.tanglebay.com')).toEqual(UrlError.Invalid)
            expect(_check('https:/mainnet.tanglebay.com')).toEqual(UrlError.Invalid)

            expect(_check('https://mainnet.tanglebay.com')).toBeUndefined()
        })
        it('should catch duplicate node URLs', () => {
            expect(_check(EXPECTED_NODE_URLS[NetworkId.Iota][0])).toEqual(UrlError.Duplicate)
            expect(_check(EXPECTED_NODE_URLS[NetworkId.Iota][1])).toEqual(UrlError.Duplicate)

            expect(_check(EXPECTED_NODE_URLS[NetworkId.Shimmer][0])).toBeUndefined()
        })
        it('may or may NOT catch insecure URLs', () => {
            expect(_check('http://mainnet.tanglebay.com')).toEqual(UrlError.Insecure)

            // TODO: Enable this test when HTTP support has been audited
            // expect(_check('http://mainnet.tanglebay.com', true)).toBeUndefined()
        })
    })
})

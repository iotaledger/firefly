import './mocks/matchMedia'

import {
    checkNodeUrlValidity,
    cleanNodeAuth,
    ensureSinglePrimaryNode,
    getDefaultClientOptions,
    getNetworkById,
    getNodeCandidates,
    getOfficialNetwork,
    getOfficialNodes,
    isNodeAuthValid,
    isOfficialNetwork,
} from '../network'
import { Network, NetworkConfig, NetworkType } from '../typings/network'
import { ClientOptions } from '../typings/client'
import { Node, NodeAuth } from '../typings/node'
import { BaseToken, SubUnit, TickerSymbol, Token, TokenUnit } from '../typings/assets'

describe('File: network.ts', () => {
    function _buildNode(url: string, network: Network, isPrimary: boolean = false, isDisabled: boolean = false): Node {
        return {
            url,
            network,
            auth: { username: '', password: '' },
            isPrimary,
            isDisabled,
        }
    }

    function _buildNodes(networkType: NetworkType) {
        return NODE_URLS[networkType].map((url) => _buildNode(url, NETWORK[networkType]))
    }

    const BASE_TOKEN: Readonly<{ IOTA: BaseToken; Shimmer: BaseToken }> = {
        IOTA: {
            name: 'IOTA' as Token,
            tickerSymbol: 'MIOTA' as TickerSymbol,
            unit: 'i' as TokenUnit,
            decimals: 0,
            subunit: null,
            useMetricPrefix: true,
        },
        Shimmer: {
            name: 'Shimmer' as Token,
            tickerSymbol: 'SMR' as TickerSymbol,
            unit: 'SMR' as TokenUnit,
            decimals: 6,
            subunit: 'glow' as SubUnit,
            useMetricPrefix: false,
        },
    }

    const NETWORK: Readonly<{ [key in NetworkType]: Network }> = {
        [NetworkType.ChrysalisMainnet]: {
            id: 'chrysalis-mainnet',
            name: 'Chrysalis Mainnet',
            bech32Hrp: 'iota',
            type: 'chrysalis-mainnet' as NetworkType,
            baseToken: BASE_TOKEN.IOTA,
        },
        [NetworkType.ChrysalisDevnet]: {
            id: 'chrysalis-devnet',
            name: 'Chrysalis Devnet',
            bech32Hrp: 'atoi',
            type: 'chrysalis-devnet' as NetworkType,
            baseToken: BASE_TOKEN.IOTA,
        },
        [NetworkType.ShimmerMainnet]: {
            id: 'shimmer-mainnet',
            name: 'Shimmer Mainnet',
            bech32Hrp: 'smr',
            type: 'shimmer-mainnet' as NetworkType,
            baseToken: BASE_TOKEN.Shimmer,
        },
        [NetworkType.ShimmerDevnet]: {
            id: 'shimmer-devnet',
            name: 'Shimmer Devnet',
            bech32Hrp: 'rms',
            type: 'shimmer-devnet' as NetworkType,
            baseToken: BASE_TOKEN.Shimmer,
        },
        [NetworkType.PrivateNet]: <Network>{
            name: 'Private Net',
            type: 'private-net' as NetworkType,
        },
    }

    const NODE_URLS: Readonly<{ [key in NetworkType]: string[] }> = {
        [NetworkType.ChrysalisMainnet]: [
            'https://chrysalis-nodes.iota.org',
            'https://chrysalis-nodes.iota.cafe',
            'https://mainnet-node.tanglebay.com',
        ],
        [NetworkType.ChrysalisDevnet]: [
            'https://api.lb-0.h.chrysalis-devnet.iota.cafe',
            'https://api.lb-1.h.chrysalis-devnet.iota.cafe',
        ],
        [NetworkType.ShimmerMainnet]: [],
        [NetworkType.ShimmerDevnet]: [],
        [NetworkType.PrivateNet]: [],
    }

    const NODES: Readonly<{ [key in NetworkType]: Node[] }> = {
        [NetworkType.ChrysalisMainnet]: _buildNodes(NetworkType.ChrysalisMainnet),
        [NetworkType.ChrysalisDevnet]: _buildNodes(NetworkType.ChrysalisDevnet),
        [NetworkType.ShimmerMainnet]: _buildNodes(NetworkType.ShimmerMainnet),
        [NetworkType.ShimmerDevnet]: _buildNodes(NetworkType.ShimmerDevnet),
        [NetworkType.PrivateNet]: _buildNodes(NetworkType.PrivateNet),
    }

    const CONFIG: Readonly<{ [key in NetworkType]: NetworkConfig }> = {
        [NetworkType.ChrysalisMainnet]: {
            network: NETWORK[NetworkType.ChrysalisMainnet],
            nodes: _buildNodes(NetworkType.ChrysalisMainnet),
            includeOfficialNodes: false,
            automaticNodeSelection: true,
            localPow: true,
        },
        [NetworkType.ChrysalisDevnet]: {
            network: NETWORK[NetworkType.ChrysalisDevnet],
            nodes: _buildNodes(NetworkType.ChrysalisMainnet),
            includeOfficialNodes: true,
            automaticNodeSelection: false,
            localPow: true,
        },
        [NetworkType.ShimmerMainnet]: <NetworkConfig>{},
        [NetworkType.ShimmerDevnet]: <NetworkConfig>{},
        [NetworkType.PrivateNet]: <NetworkConfig>{},
    }

    const EMPTY_NODE_AUTH = { username: '', password: '' }
    const FAKE_NODE_AUTH = <NodeAuth>{
        username: 'theUser',
        password: 'mY-rEaLlY-sEcUrE-pAsSwOrD',
    }
    const FAKE_NODE_AUTH_JWT = <NodeAuth>{
        jwt: 'SOME JWT',
        username: 'theUser',
        password: 'mY-rEaLlY-sEcUrE-pAsSwOrD',
    }

    describe('Function: getClientOptions', () => {
        it('should return the client options of the active profile if present', () => {
            const clientOpts = getDefaultClientOptions()
            expect(clientOpts).toEqual(<ClientOptions>{
                network: 'chrysalis-mainnet',
                automaticNodeSelection: true,
                includeOfficialNodes: true,
                localPow: true,
                node: _buildNode(
                    NODE_URLS[NetworkType.ChrysalisMainnet][0],
                    NETWORK[NetworkType.ChrysalisMainnet],
                    true,
                    false
                ),
                nodes: [
                    _buildNode(
                        NODE_URLS[NetworkType.ChrysalisMainnet][0],
                        NETWORK[NetworkType.ChrysalisMainnet],
                        true,
                        false
                    ),
                    _buildNode(NODE_URLS[NetworkType.ChrysalisMainnet][1], NETWORK[NetworkType.ChrysalisMainnet]),
                    _buildNode(NODE_URLS[NetworkType.ChrysalisMainnet][2], NETWORK[NetworkType.ChrysalisMainnet]),
                ],
            })
        })
    })

    describe('Function: getOfficialNetwork', () => {
        it('should return the correct official network metadata given a valid network type', () => {
            Object.values(NetworkType).forEach((networkType) => {
                expect(getOfficialNetwork(networkType)).toEqual(NETWORK[networkType])
            })
        })
        it('should return an empty network given an invalid network type', () => {
            expect(getOfficialNetwork(undefined)).toEqual(<Network>{})
        })
    })

    describe('Function: getOfficialNodes', () => {
        it('should return the correct official nodes given a valid network type', () => {
            Object.values(NetworkType).forEach((networkType) => {
                expect(getOfficialNodes(networkType)).toEqual(
                    NODE_URLS[networkType].map((url) => _buildNode(url, NETWORK[networkType]))
                )
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

    describe('Function: getNetworkById', () => {
        it('should return all metadata for official networks', () => {
            Object.values(NETWORK).forEach((network) => {
                if (network.type !== NetworkType.PrivateNet) {
                    expect(getNetworkById(network.id)).toEqual(NETWORK[network.type])
                }
            })
        })
        it('should return partial metadata for unofficial networks', () => {
            expect(getNetworkById('another-tangle')).toEqual(<Network>{
                id: 'another-tangle',
                name: 'Private Net',
                type: NetworkType.PrivateNet,
            })
        })
        it('should return nothing given an invalid network ID', () => {
            expect(getNetworkById(undefined)).toEqual(<Network>{})
        })
    })

    describe('Function: cleanNodeAuth', () => {
        it('should return an empty basic auth configuration given nothing', () => {
            expect(cleanNodeAuth(<NodeAuth>{})).toEqual(EMPTY_NODE_AUTH)
            expect(cleanNodeAuth(undefined)).toEqual(EMPTY_NODE_AUTH)
        })
        it('should return a basic auth configuration if given that', () => {
            expect(cleanNodeAuth(FAKE_NODE_AUTH)).toEqual(FAKE_NODE_AUTH)
        })
        it('should return the entire auth configuration if the JWT exists', () => {
            expect(cleanNodeAuth(<NodeAuth>{ jwt: 'SOME JWT' })).toEqual(<NodeAuth>{ jwt: 'SOME JWT' })
            expect(cleanNodeAuth(FAKE_NODE_AUTH_JWT)).toEqual(FAKE_NODE_AUTH_JWT)
        })
    })

    describe('Function: isNodeAuthValid', () => {
        it('should return correct result for any auth configuration', () => {
            expect(isNodeAuthValid(<NodeAuth>{})).toBe(false)
            expect(isNodeAuthValid(undefined)).toBe(false)
            expect(isNodeAuthValid(EMPTY_NODE_AUTH)).toBe(false)

            expect(isNodeAuthValid(FAKE_NODE_AUTH)).toBe(true)
            expect(isNodeAuthValid(FAKE_NODE_AUTH_JWT)).toBe(true)
        })
    })

    describe('Function: checkNodeUrlValidity', () => {
        enum UrlError {
            Invalid = 'error.node.invalid',
            Insecure = 'error.node.https',
            Duplicate = 'error.node.duplicate',
        }

        const _check = (url: string, allowInsecure: boolean = false): string | undefined =>
            checkNodeUrlValidity(NODES[NetworkType.ChrysalisMainnet], url, allowInsecure)

        it('should return undefined for valid node URLs', () => {
            expect(_check('https://mainnet.tanglebay.com')).toBeUndefined()
            expect(_check(NODE_URLS[NetworkType.ChrysalisDevnet][0])).toBeUndefined()
        })
        it('should catch generally invalid URLs', () => {
            expect(_check('htps://mainnet.tanglebay.com')).toEqual(UrlError.Invalid)
            expect(_check('https:/mainnet.tanglebay.com')).toEqual(UrlError.Invalid)

            expect(_check('https://mainnet.tanglebay.com')).toBeUndefined()
        })
        it('should catch duplicate node URLs', () => {
            expect(_check(NODE_URLS[NetworkType.ChrysalisMainnet][0])).toEqual(UrlError.Duplicate)
            expect(_check(NODE_URLS[NetworkType.ChrysalisMainnet][1])).toEqual(UrlError.Duplicate)

            expect(_check(NODE_URLS[NetworkType.ChrysalisDevnet][0])).toBeUndefined()
        })
        it('may or may NOT catch insecure URLs', () => {
            expect(_check('http://mainnet.tanglebay.com')).toEqual(UrlError.Insecure)

            // TODO: Enable this test when HTTP support has been audited
            // expect(_check('http://mainnet.tanglebay.com', true)).toBeUndefined()
        })
    })

    describe('Function: getNodeCandidates', () => {
        it('should return nothing if passed invalid configuration', () => {
            expect(getNodeCandidates(undefined)).toEqual([])
        })
        it('should ensure that at least one node candidate is primary', () => {
            expect(getNodeCandidates(CONFIG[NetworkType.ChrysalisMainnet]).find((n) => n.isPrimary)).toBeDefined()
        })
        it('should use official nodes if no nodes exist', () => {
            let nodes = getNodeCandidates({ ...CONFIG[NetworkType.ChrysalisMainnet], nodes: [] })
            expect(nodes.find((n) => n.isPrimary)).toBeDefined()
            nodes.forEach((n) => {
                expect(NODES[NetworkType.ChrysalisMainnet].map((_n) => _n.url).includes(n.url)).toBe(true)
            })

            nodes = getNodeCandidates({ ...CONFIG[NetworkType.ChrysalisDevnet], nodes: [] })
            expect(nodes.find((n) => n.isPrimary)).toBeDefined()
            nodes.forEach((n) => {
                expect(NODES[NetworkType.ChrysalisDevnet].map((_n) => _n.url).includes(n.url)).toBe(true)
            })
        })
        it('should return official nodes if using automatic selection', () => {
            let nodes = getNodeCandidates(CONFIG[NetworkType.ChrysalisMainnet])
            expect(nodes.find((n) => n.isPrimary)).toBeDefined()
            nodes.forEach((n) => {
                expect(NODES[NetworkType.ChrysalisMainnet].map((_n) => _n.url).includes(n.url)).toBe(true)
            })
        })
        it('may return ONLY unofficial nodes OR both', () => {
            const unofficialNodes: Node[] = [
                { url: 'https://mainnet.tanglebay.com', network: NETWORK[NetworkType.ChrysalisMainnet] },
                { url: 'https://other.mainnet.tanglebay.com', network: NETWORK[NetworkType.ChrysalisMainnet] },
            ]

            let nodes = getNodeCandidates({
                ...CONFIG[NetworkType.ChrysalisMainnet],
                nodes: unofficialNodes,
                includeOfficialNodes: false,
                automaticNodeSelection: false,
            })
            nodes.forEach((n) => {
                expect(unofficialNodes.map((_n) => _n.url).includes(n.url)).toBe(true)
            })

            nodes = getNodeCandidates({
                ...CONFIG[NetworkType.ChrysalisMainnet],
                nodes: unofficialNodes,
                includeOfficialNodes: true,
                automaticNodeSelection: false,
            })
            nodes.forEach((n) => {
                const isOfficial = NODES[NetworkType.ChrysalisMainnet].map((_n) => _n.url).includes(n.url)
                const isUnofficial = unofficialNodes.map((_n) => _n.url).includes(n.url)

                expect(isOfficial || isUnofficial).toBe(true)
            })
        })
    })

    describe('Function: ensureSinglePrimaryNode', () => {
        const _hasOnePrimary = (nodes: Node[]): boolean => nodes.filter((n) => n.isPrimary).length === 1

        it('should maintain the primary node if it exists', () => {
            const nodes = NODES[NetworkType.ChrysalisMainnet].map((n, idx) => ({ ...n, isPrimary: idx === 0 }))
            expect(ensureSinglePrimaryNode(nodes)).toEqual(nodes)
            expect(_hasOnePrimary(ensureSinglePrimaryNode(nodes))).toBe(true)
        })
        it('should randomly select a primary node if one does not exist', () => {
            expect(_hasOnePrimary(NODES[NetworkType.ChrysalisMainnet])).toBe(false)
            expect(_hasOnePrimary(ensureSinglePrimaryNode(NODES[NetworkType.ChrysalisMainnet]))).toBe(true)
        })
        it('should handle empty or invalid node arrays', () => {
            expect(ensureSinglePrimaryNode([])).toEqual([])
            expect(ensureSinglePrimaryNode(undefined)).toBeUndefined()
        })
        it('should ensure ONLY one primary node exists', () => {
            const nodes = NODES[NetworkType.ChrysalisMainnet].map((n) => ({ ...n, isPrimary: true }))
            expect(ensureSinglePrimaryNode(nodes) === nodes).toBe(false)
            expect(_hasOnePrimary(ensureSinglePrimaryNode(nodes))).toBe(true)
        })
    })
})

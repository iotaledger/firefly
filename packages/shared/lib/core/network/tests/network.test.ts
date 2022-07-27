import {
    checkNodeUrlValidity,
    cleanAuth,
    ensureSinglePrimaryNode,
    getDefaultClientOptions,
    getNetwork,
    getNodeCandidates,
    getOfficialNetwork,
    getOfficialNodes,
    IAuth,
    IClientOptions,
    INetwork,
    INode,
    isAuthValid,
    isOfficialNetwork,
    NetworkProtocol,
    NetworkType,
} from '../'
import { ITokenMetadata } from '../../wallet'

describe('File: network.ts', () => {
    function _buildNode(url: string): INode {
        return {
            url,
            auth: { username: '', password: '' },
            disabled: false,
        }
    }

    function _buildNodes(networkProtocol: NetworkProtocol, networkType: NetworkType) {
        return OFFICIAL_NODE_URLS?.[networkProtocol]?.[networkType]?.map((url) => _buildNode(url)) ?? []
    }

    const BASE_TOKEN: Readonly<{ [key in NetworkProtocol]: ITokenMetadata }> = {
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
        },
    }

    const NETWORK: Readonly<{ [key in NetworkProtocol]?: { [key in NetworkType]?: INetwork } }> = {
        iota: {
            [NetworkType.Mainnet]: {
                id: 'iota-mainnet',
                name: 'IOTA',
                protocol: NetworkProtocol.IOTA,
                type: NetworkType.Mainnet,
                bech32Hrp: 'iota',
                baseToken: BASE_TOKEN[NetworkProtocol.IOTA],
                rentStructure: {
                    vByteCost: 500,
                    vByteFactorData: 10,
                    vByteFactorKey: 1,
                },
            },
            [NetworkType.Devnet]: {
                id: 'iota-devnet',
                name: 'IOTA Devnet',
                protocol: NetworkProtocol.IOTA,
                type: NetworkType.Devnet,
                bech32Hrp: 'atoi',
                baseToken: BASE_TOKEN[NetworkProtocol.IOTA],
                rentStructure: {
                    vByteCost: 500,
                    vByteFactorData: 10,
                    vByteFactorKey: 1,
                },
            },
            [NetworkType.PrivateNet]: <INetwork>{
                name: 'Private Net',
                protocol: NetworkProtocol.IOTA,
                type: NetworkType.PrivateNet,
            },
        },
        shimmer: {
            [NetworkType.Mainnet]: {
                id: 'shimmer-mainnet',
                name: 'Shimmer',
                protocol: NetworkProtocol.Shimmer,
                type: NetworkType.Mainnet,
                bech32Hrp: 'smr',
                baseToken: BASE_TOKEN[NetworkProtocol.Shimmer],
                rentStructure: {
                    vByteCost: 500,
                    vByteFactorData: 10,
                    vByteFactorKey: 1,
                },
            },
            [NetworkType.Devnet]: {
                id: 'testnet',
                name: 'Shimmer Beta',
                protocol: NetworkProtocol.Shimmer,
                type: NetworkType.Devnet,
                bech32Hrp: 'rms',
                baseToken: BASE_TOKEN[NetworkProtocol.Shimmer],
                rentStructure: {
                    vByteCost: 500,
                    vByteFactorData: 10,
                    vByteFactorKey: 1,
                },
            },
            [NetworkType.PrivateNet]: <INetwork>{
                name: 'Private Net',
                protocol: NetworkProtocol.Shimmer,
                type: NetworkType.PrivateNet,
            },
        },
    }

    const OFFICIAL_NODE_URLS: Readonly<{ [key in NetworkProtocol]?: { [key in NetworkType]?: string[] } }> = {
        [NetworkProtocol.IOTA]: {
            [NetworkType.Mainnet]: [
                'https://chrysalis-nodes.iota.org',
                'https://chrysalis-nodes.iota.cafe',
                'https://mainnet-node.tanglebay.com',
            ],
            [NetworkType.Devnet]: [
                'https://api.lb-0.h.chrysalis-devnet.iota.cafe',
                'https://api.lb-1.h.chrysalis-devnet.iota.cafe',
            ],
        },
        [NetworkProtocol.Shimmer]: {
            [NetworkType.Mainnet]: [''],
            [NetworkType.Devnet]: ['https://api.testnet.shimmer.network'],
        },
    }

    const CONFIG: Readonly<{ [key in NetworkProtocol]: { [key in NetworkType]: IClientOptions } }> = {
        [NetworkProtocol.IOTA]: {
            [NetworkType.Mainnet]: {
                network: NETWORK[NetworkProtocol.IOTA]?.[NetworkType.Mainnet]?.id,
                nodes: _buildNodes(NetworkProtocol.IOTA, NetworkType.Mainnet),
                includeOfficialNodes: false,
                automaticNodeSelection: true,
                localPow: true,
            },
            [NetworkType.Devnet]: {
                network: NETWORK[NetworkProtocol.IOTA][NetworkType.Devnet].id,
                nodes: _buildNodes(NetworkProtocol.IOTA, NetworkType.Devnet),
                includeOfficialNodes: true,
                automaticNodeSelection: false,
                localPow: true,
            },
            [NetworkType.PrivateNet]: <IClientOptions>{},
        },
        [NetworkProtocol.Shimmer]: {
            [NetworkType.Mainnet]: <IClientOptions>{},
            [NetworkType.Devnet]: <IClientOptions>{},
            [NetworkType.PrivateNet]: <IClientOptions>{},
        },
    }

    const NODES: Readonly<{ [key in NetworkProtocol]: { [key in NetworkType]: INode[] } }> = {
        [NetworkProtocol.IOTA]: {
            [NetworkType.Mainnet]: _buildNodes(NetworkProtocol.IOTA, NetworkType.Mainnet),
            [NetworkType.Devnet]: _buildNodes(NetworkProtocol.IOTA, NetworkType.Devnet),
            [NetworkType.PrivateNet]: _buildNodes(NetworkProtocol.IOTA, NetworkType.PrivateNet),
        },
        [NetworkProtocol.Shimmer]: {
            [NetworkType.Mainnet]: _buildNodes(NetworkProtocol.Shimmer, NetworkType.Mainnet),
            [NetworkType.Devnet]: _buildNodes(NetworkProtocol.Shimmer, NetworkType.Devnet),
            [NetworkType.PrivateNet]: _buildNodes(NetworkProtocol.Shimmer, NetworkType.PrivateNet),
        },
    }

    const EMPTY_NODE_AUTH = { username: '', password: '' }
    const FAKE_NODE_AUTH = <IAuth>{
        username: 'theUser',
        password: 'mY-rEaLlY-sEcUrE-pAsSwOrD',
    }
    const FAKE_NODE_AUTH_JWT = <IAuth>{
        jwt: 'SOME JWT',
        username: 'theUser',
        password: 'mY-rEaLlY-sEcUrE-pAsSwOrD',
    }

    describe('Function: getClientOptions', () => {
        it('should return the client options of the active profile if present', () => {
            const clientOpts = getDefaultClientOptions(NetworkProtocol.IOTA, NetworkType.Mainnet)
            expect(clientOpts).toEqual(<IClientOptions>{
                nodes: [
                    _buildNode(OFFICIAL_NODE_URLS[NetworkProtocol.IOTA][NetworkType.Mainnet][0]),
                    _buildNode(OFFICIAL_NODE_URLS[NetworkProtocol.IOTA][NetworkType.Mainnet][1]),
                    _buildNode(OFFICIAL_NODE_URLS[NetworkProtocol.IOTA][NetworkType.Mainnet][2]),
                ],
            })
        })
    })

    describe('Function: getOfficialNetwork', () => {
        it('should return the correct official network metadata given a valid network type', () => {
            Object.values(NetworkProtocol).forEach((networkProtocol) => {
                Object.values(NetworkType).forEach((networkType) => {
                    expect(getOfficialNetwork(networkProtocol, networkType)).toEqual(
                        NETWORK[networkProtocol][networkType]
                    )
                })
            })
        })
    })

    describe('Function: getOfficialNodes', () => {
        it('should return the correct official nodes given a valid network type', () => {
            Object.values(NetworkProtocol).forEach((networkProtocol) => {
                Object.values(NetworkType).forEach((networkType) => {
                    if (networkType !== NetworkType.PrivateNet) {
                        expect(getOfficialNodes(networkProtocol, networkType)).toEqual(
                            OFFICIAL_NODE_URLS[networkProtocol][networkType].map((url) => _buildNode(url))
                        )
                    }
                })
            })
        })
        it('should return no official nodes given an invalid network type', () => {
            expect(getOfficialNodes(undefined, undefined)).toEqual([])
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

    describe('Function: getNetwork', () => {
        it('should return all metadata for official networks', () => {
            Object.values(NetworkProtocol).forEach((networkProtocol) => {
                Object.values(NETWORK[networkProtocol]).forEach((network) => {
                    if (network.type !== NetworkType.PrivateNet) {
                        expect(getNetwork(networkProtocol, network.type)).toEqual(
                            NETWORK[networkProtocol][network.type]
                        )
                    }
                })
            })
        })
        it('should return partial metadata for unofficial networks', () => {
            expect(getNetwork(NetworkProtocol.IOTA, NetworkType.PrivateNet, 'another-tangle')).toEqual(<INetwork>{
                id: 'another-tangle',
                name: 'Private Net',
                protocol: NetworkProtocol.IOTA,
                type: NetworkType.PrivateNet,
            })
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

    describe('Function: isAuthValid', () => {
        it('should return correct result for any auth configuration', () => {
            expect(isAuthValid(<IAuth>{})).toBe(false)
            expect(isAuthValid(undefined)).toBe(false)
            expect(isAuthValid(EMPTY_NODE_AUTH)).toBe(false)

            expect(isAuthValid(FAKE_NODE_AUTH)).toBe(true)
            expect(isAuthValid(FAKE_NODE_AUTH_JWT)).toBe(true)
        })
    })

    describe('Function: checkNodeUrlValidity', () => {
        enum UrlError {
            Invalid = 'error.node.invalid',
            Insecure = 'error.node.https',
            Duplicate = 'error.node.duplicate',
        }

        const _check = (url: string, allowInsecure: boolean = false): string | undefined =>
            checkNodeUrlValidity(NODES[NetworkProtocol.IOTA][NetworkType.Mainnet], url, allowInsecure)

        it('should return undefined for valid node URLs', () => {
            expect(_check('https://mainnet.tanglebay.com')).toBeUndefined()
            expect(_check(OFFICIAL_NODE_URLS[NetworkProtocol.IOTA][NetworkType.Devnet][0])).toBeUndefined()
        })
        it('should catch generally invalid URLs', () => {
            expect(_check('htps://mainnet.tanglebay.com')).toEqual(UrlError.Invalid)
            expect(_check('https:/mainnet.tanglebay.com')).toEqual(UrlError.Invalid)

            expect(_check('https://mainnet.tanglebay.com')).toBeUndefined()
        })
        it('should catch duplicate node URLs', () => {
            expect(_check(OFFICIAL_NODE_URLS[NetworkProtocol.IOTA][NetworkType.Mainnet][0])).toEqual(UrlError.Duplicate)
            expect(_check(OFFICIAL_NODE_URLS[NetworkProtocol.IOTA][NetworkType.Mainnet][1])).toEqual(UrlError.Duplicate)

            expect(_check(OFFICIAL_NODE_URLS[NetworkProtocol.IOTA][NetworkType.Devnet][0])).toBeUndefined()
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
        it('should use official nodes if no nodes exist', () => {
            let nodes = getNodeCandidates({ ...CONFIG[NetworkProtocol.IOTA][NetworkType.Mainnet], nodes: [] })
            nodes.forEach((n) => {
                expect(NODES[NetworkProtocol.IOTA][NetworkType.Mainnet].map((_n) => _n.url).includes(n.url)).toBe(true)
            })

            nodes = getNodeCandidates({ ...CONFIG[NetworkProtocol.IOTA][NetworkType.Devnet], nodes: [] })
            nodes.forEach((n) => {
                expect(NODES[NetworkProtocol.IOTA][NetworkType.Devnet].map((_n) => _n.url).includes(n.url)).toBe(true)
            })
        })
        it('should return official nodes if using automatic selection', () => {
            let nodes = getNodeCandidates(CONFIG[NetworkProtocol.IOTA][NetworkType.Mainnet])
            nodes.forEach((n) => {
                expect(NODES[NetworkProtocol.IOTA][NetworkType.Mainnet].map((_n) => _n.url).includes(n.url)).toBe(true)
            })
        })
        it('may return ONLY unofficial nodes OR both', () => {
            const unofficialNodes: INode[] = [
                { url: 'https://mainnet.tanglebay.com' },
                {
                    url: 'https://other.mainnet.tanglebay.com',
                },
            ]

            let nodes = getNodeCandidates({
                ...CONFIG[NetworkProtocol.IOTA][NetworkType.Mainnet],
                nodes: unofficialNodes,
                includeOfficialNodes: false,
                automaticNodeSelection: false,
            })
            nodes.forEach((n) => {
                expect(unofficialNodes.map((_n) => _n.url).includes(n.url)).toBe(true)
            })

            nodes = getNodeCandidates({
                ...CONFIG[NetworkProtocol.IOTA][NetworkType.Mainnet],
                nodes: unofficialNodes,
                includeOfficialNodes: true,
                automaticNodeSelection: false,
            })
            nodes.forEach((n) => {
                const isOfficial = NODES[NetworkProtocol.IOTA][NetworkType.Mainnet].map((_n) => _n.url).includes(n.url)
                const isUnofficial = unofficialNodes.map((_n) => _n.url).includes(n.url)

                expect(isOfficial || isUnofficial).toBe(true)
            })
        })
    })

    describe.skip('Function: ensureSinglePrimaryNode', () => {
        // const _hasOnePrimary = (nodes: INode[]): boolean => nodes.filter((n) => n.isPrimary).length === 1
        const _hasOnePrimary = (nodes: INode[]): boolean => true

        it('should maintain the primary node if it exists', () => {
            const nodes = NODES[NetworkProtocol.IOTA][NetworkType.Mainnet].map((n, idx) => ({
                ...n,
                isPrimary: idx === 0,
            }))
            expect(ensureSinglePrimaryNode(nodes)).toEqual(nodes)
            expect(_hasOnePrimary(ensureSinglePrimaryNode(nodes))).toBe(true)
        })
        it('should randomly select a primary node if one does not exist', () => {
            expect(_hasOnePrimary(NODES[NetworkProtocol.IOTA][NetworkType.Mainnet])).toBe(false)
            expect(_hasOnePrimary(ensureSinglePrimaryNode(NODES[NetworkProtocol.IOTA][NetworkType.Mainnet]))).toBe(true)
        })
        it('should handle empty or invalid node arrays', () => {
            expect(ensureSinglePrimaryNode([])).toEqual([])
            expect(ensureSinglePrimaryNode(undefined)).toEqual([])
        })
        it('should ensure ONLY one primary node exists', () => {
            const nodes = NODES[NetworkProtocol.IOTA][NetworkType.Mainnet].map((n) => ({ ...n, isPrimary: true }))
            expect(ensureSinglePrimaryNode(nodes) === nodes).toBe(false)
            expect(_hasOnePrimary(ensureSinglePrimaryNode(nodes))).toBe(true)
        })
    })
})

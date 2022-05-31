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

describe('File: network.ts', () => {
    const _buildNode = (
        url: string,
        network: Network,
        isPrimary: boolean = false,
        isDisabled: boolean = false
    ): Node => ({
        url,
        network,
        auth: { username: '', password: '' },
        isPrimary,
        isDisabled,
    })

    const MAINNET: Network = {
        id: 'chrysalis-mainnet',
        name: 'Chrysalis Mainnet',
        type: NetworkType.ChrysalisMainnet,
        bech32Hrp: 'iota',
    }
    const MAINNET_URLS = [
        'https://chrysalis-nodes.iota.org',
        'https://chrysalis-nodes.iota.cafe',
        'https://iota-node.tanglebay.com',
    ]
    const MAINNET_NODES = MAINNET_URLS.map((url) => _buildNode(url, MAINNET))
    const MAINNET_CONFIG: NetworkConfig = {
        network: MAINNET,
        nodes: MAINNET_NODES,
        includeOfficialNodes: false,
        automaticNodeSelection: true,
        localPow: true,
    }

    const DEVNET: Network = {
        id: 'chrysalis-devnet',
        name: 'Chrysalis Devnet',
        type: NetworkType.ChrysalisDevnet,
        bech32Hrp: 'atoi',
    }
    const DEVNET_URLS = [
        'https://api.lb-0.h.chrysalis-devnet.iota.cafe',
        'https://api.lb-1.h.chrysalis-devnet.iota.cafe',
    ]
    const DEVNET_NODES = DEVNET_URLS.map((url) => _buildNode(url, DEVNET))
    const DEVNET_CONFIG: NetworkConfig = {
        network: DEVNET,
        nodes: DEVNET_NODES,
        includeOfficialNodes: true,
        automaticNodeSelection: false,
        localPow: true,
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
                node: _buildNode(MAINNET_URLS[0], MAINNET, true, false),
                nodes: [
                    _buildNode(MAINNET_URLS[0], MAINNET, true, false),
                    _buildNode(MAINNET_URLS[1], MAINNET),
                    _buildNode(MAINNET_URLS[2], MAINNET),
                ],
            })
        })
    })

    describe('Function: getOfficialNetwork', () => {
        it('should return the correct official network metadata given a valid network type', () => {
            expect(getOfficialNetwork(NetworkType.ChrysalisMainnet)).toEqual(MAINNET)
            expect(getOfficialNetwork(NetworkType.ChrysalisDevnet)).toEqual(DEVNET)
            expect(getOfficialNetwork(NetworkType.PrivateNet)).toEqual(<Network>{ type: NetworkType.PrivateNet })
        })
        it('should return an empty network given an invalid network type', () => {
            expect(getOfficialNetwork(undefined)).toEqual(<Network>{})
        })
    })

    describe('Function: getOfficialNodes', () => {
        it('should return the correct official nodes given a valid network type', () => {
            expect(getOfficialNodes(NetworkType.ChrysalisMainnet)).toEqual([
                _buildNode(MAINNET_URLS[0], MAINNET),
                _buildNode(MAINNET_URLS[1], MAINNET),
                _buildNode(MAINNET_URLS[2], MAINNET),
            ])
            expect(getOfficialNodes(NetworkType.ChrysalisDevnet)).toEqual([
                _buildNode(DEVNET_URLS[0], DEVNET),
                _buildNode(DEVNET_URLS[1], DEVNET),
            ])
            expect(getOfficialNodes(NetworkType.PrivateNet)).toEqual([])
        })
        it('should return no official nodes given an invalid network type', () => {
            expect(getOfficialNodes(undefined)).toEqual([])
        })
    })

    describe('Function: isOfficialNetwork', () => {
        it('should return the correct values given a valid network type', () => {
            expect(isOfficialNetwork(NetworkType.ChrysalisMainnet)).toBe(true)
            expect(isOfficialNetwork(NetworkType.ChrysalisDevnet)).toBe(true)
            expect(isOfficialNetwork(NetworkType.PrivateNet)).toBe(false)
        })
        it('should return false given an invalid network type', () => {
            expect(isOfficialNetwork(undefined)).toBe(false)
        })
    })

    describe('Function: getNetworkById', () => {
        it('should return all metadata for official networks', () => {
            expect(getNetworkById(MAINNET.id)).toEqual(MAINNET)
            expect(getNetworkById(DEVNET.id)).toEqual(DEVNET)
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
            checkNodeUrlValidity(MAINNET_NODES, url, allowInsecure)

        it('should return undefined for valid node URLs', () => {
            expect(_check('https://mainnet.tanglebay.com')).toBeUndefined()
            expect(_check(DEVNET_URLS[0])).toBeUndefined()
        })
        it('should catch generally invalid URLs', () => {
            expect(_check('htps://mainnet.tanglebay.com')).toEqual(UrlError.Invalid)
            expect(_check('https:/mainnet.tanglebay.com')).toEqual(UrlError.Invalid)

            expect(_check('https://mainnet.tanglebay.com')).toBeUndefined()
        })
        it('should catch duplicate node URLs', () => {
            expect(_check(MAINNET_URLS[0])).toEqual(UrlError.Duplicate)
            expect(_check(MAINNET_URLS[1])).toEqual(UrlError.Duplicate)

            expect(_check(DEVNET_URLS[0])).toBeUndefined()
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
            expect(getNodeCandidates(MAINNET_CONFIG).find((n) => n.isPrimary)).toBeDefined()
        })
        it('should use official nodes if no nodes exist', () => {
            let nodes = getNodeCandidates({ ...MAINNET_CONFIG, nodes: [] })
            expect(nodes.find((n) => n.isPrimary)).toBeDefined()
            nodes.forEach((n) => {
                expect(MAINNET_NODES.map((_n) => _n.url).includes(n.url)).toBe(true)
            })

            nodes = getNodeCandidates({ ...DEVNET_CONFIG, nodes: [] })
            expect(nodes.find((n) => n.isPrimary)).toBeDefined()
            nodes.forEach((n) => {
                expect(DEVNET_NODES.map((_n) => _n.url).includes(n.url)).toBe(true)
            })
        })
        it('should return official nodes if using automatic selection', () => {
            let nodes = getNodeCandidates(MAINNET_CONFIG)
            expect(nodes.find((n) => n.isPrimary)).toBeDefined()
            nodes.forEach((n) => {
                expect(MAINNET_NODES.map((_n) => _n.url).includes(n.url)).toBe(true)
            })
        })
        it('may return ONLY unofficial nodes OR both', () => {
            const unofficialNodes: Node[] = [
                { url: 'https://mainnet.tanglebay.com', network: MAINNET },
                { url: 'https://other.mainnet.tanglebay.com', network: MAINNET },
            ]

            let nodes = getNodeCandidates({
                ...MAINNET_CONFIG,
                nodes: unofficialNodes,
                includeOfficialNodes: false,
                automaticNodeSelection: false,
            })
            nodes.forEach((n) => {
                expect(unofficialNodes.map((_n) => _n.url).includes(n.url)).toBe(true)
            })

            nodes = getNodeCandidates({
                ...MAINNET_CONFIG,
                nodes: unofficialNodes,
                includeOfficialNodes: true,
                automaticNodeSelection: false,
            })
            nodes.forEach((n) => {
                const isOfficial = MAINNET_NODES.map((_n) => _n.url).includes(n.url)
                const isUnofficial = unofficialNodes.map((_n) => _n.url).includes(n.url)

                expect(isOfficial || isUnofficial).toBe(true)
            })
        })
    })

    describe('Function: ensureSinglePrimaryNode', () => {
        const _hasOnePrimary = (nodes: Node[]): boolean => nodes.filter((n) => n.isPrimary).length === 1

        it('should maintain the primary node if it exists', () => {
            const nodes = MAINNET_NODES.map((n, idx) => ({ ...n, isPrimary: idx === 0 }))
            expect(ensureSinglePrimaryNode(nodes)).toEqual(nodes)
            expect(_hasOnePrimary(ensureSinglePrimaryNode(nodes))).toBe(true)
        })
        it('should randomly select a primary node if one does not exist', () => {
            expect(_hasOnePrimary(MAINNET_NODES)).toBe(false)
            expect(_hasOnePrimary(ensureSinglePrimaryNode(MAINNET_NODES))).toBe(true)
        })
        it('should handle empty or invalid node arrays', () => {
            expect(ensureSinglePrimaryNode([])).toEqual([])
            expect(ensureSinglePrimaryNode(undefined)).toBeUndefined()
        })
        it('should ensure ONLY one primary node exists', () => {
            const nodes = MAINNET_NODES.map((n) => ({ ...n, isPrimary: true }))
            expect(ensureSinglePrimaryNode(nodes) === nodes).toBe(false)
            expect(_hasOnePrimary(ensureSinglePrimaryNode(nodes))).toBe(true)
        })
    })
})

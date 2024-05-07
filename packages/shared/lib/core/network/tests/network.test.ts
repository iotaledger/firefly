import { DEFAULT_MAX_PARALLEL_API_REQUESTS } from '../constants'
import { NetworkId } from '../enums'
import { ClientOptions, INode } from '../interfaces'
import { checkNodeUrlValidity, getDefaultClientOptions, getOfficialNodes, isOfficialNetwork } from '../utils'

describe('File: network.ts', () => {
    function _buildNode(url: string | undefined): INode | undefined {
        if (url) {
            return {
                url,
                disabled: false,
            }
        } else {
            return undefined
        }
    }

    function _buildNodes(networkId: NetworkId): INode[] {
        const nodes = EXPECTED_NODE_URLS?.[networkId]?.map((url) => _buildNode(url))
        return nodes?.filter((node) => node !== undefined) as INode[]
    }

    const EXPECTED_NODE_URLS: Readonly<{ [key in NetworkId]?: string[] }> = {
        [NetworkId.Iota]: ['https://api.stardust-mainnet.iotaledger.net', 'https://iota-node.tanglebay.com'],
        [NetworkId.IotaTestnet]: ['https://api.testnet.iotaledger.net'],
        [NetworkId.IotaAlphanet]: ['https://api.iota-alphanet.iotaledger.net'],
        [NetworkId.Shimmer]: ['https://api.shimmer.network', 'https://shimmer-node.tanglebay.com'],
        [NetworkId.ShimmerTestnet]: ['https://api.testnet.shimmer.network'],
    }

    const EXPECTED_NODES: Readonly<{ [key in NetworkId]: (INode | undefined)[] }> = {
        [NetworkId.Iota]: _buildNodes(NetworkId.Iota),
        [NetworkId.IotaTestnet]: _buildNodes(NetworkId.IotaTestnet),
        [NetworkId.IotaAlphanet]: _buildNodes(NetworkId.IotaAlphanet),
        [NetworkId.Shimmer]: _buildNodes(NetworkId.Shimmer),
        [NetworkId.ShimmerTestnet]: _buildNodes(NetworkId.ShimmerTestnet),
        [NetworkId.Custom]: _buildNodes(NetworkId.Custom),
    }

    describe('Function: getClientOptions', () => {
        it('should return the client options of the active profile if present', () => {
            const clientOptions = getDefaultClientOptions(NetworkId.Iota)
            expect(clientOptions).toEqual(<ClientOptions>{
                nodes: [
                    _buildNode(EXPECTED_NODE_URLS?.[NetworkId.Iota]?.[0]),
                    _buildNode(EXPECTED_NODE_URLS?.[NetworkId.Iota]?.[1]),
                ],
                maxParallelApiRequests: DEFAULT_MAX_PARALLEL_API_REQUESTS,
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
            expect(getOfficialNodes('undefined' as NetworkId)).toEqual([])
        })
    })

    describe('Function: isOfficialNetwork', () => {
        it('should return the correct values given a valid network type', () => {
            Object.values(NetworkId).forEach((networkId) => {
                if (networkId === NetworkId.Custom) {
                    expect(isOfficialNetwork(networkId)).toBe(false)
                } else {
                    expect(isOfficialNetwork(networkId)).toBe(true)
                }
            })
        })
        it('should return false given an invalid network type', () => {
            expect(isOfficialNetwork('undefined' as NetworkId)).toBe(false)
        })
    })

    describe('Function: checkNodeUrlValidity', () => {
        enum UrlError {
            Invalid = 'error.node.invalid',
            Insecure = 'error.node.https',
            Duplicate = 'error.node.duplicate',
        }

        const _check = (url: string | undefined, allowInsecure: boolean = false): string | undefined =>
            checkNodeUrlValidity(EXPECTED_NODES?.[NetworkId.Iota], url ?? '', allowInsecure)

        it('should return undefined for valid node URLs', () => {
            expect(_check('https://mainnet.tanglebay.com')).toBeUndefined()
            expect(_check(EXPECTED_NODE_URLS?.[NetworkId.Shimmer]?.[0] ?? '')).toBeUndefined()
        })
        it('should catch generally invalid URLs', () => {
            expect(_check('htps://mainnet.tanglebay.com')).toEqual(UrlError.Invalid)
            expect(_check('https:/mainnet.tanglebay.com')).toEqual(UrlError.Invalid)

            expect(_check('https://mainnet.tanglebay.com')).toBeUndefined()
        })
        it('should catch duplicate node URLs', () => {
            expect(_check(EXPECTED_NODE_URLS?.[NetworkId.Iota]?.[0])).toEqual(UrlError.Duplicate)
            expect(_check(EXPECTED_NODE_URLS[NetworkId.Shimmer]?.[0])).toBeUndefined()
        })
        it('may or may NOT catch insecure URLs', () => {
            expect(_check('http://mainnet.tanglebay.com')).toEqual(UrlError.Insecure)

            // TODO: Enable this test when HTTP support has been audited
            // expect(_check('http://mainnet.tanglebay.com', true)).toBeUndefined()
        })
    })
})

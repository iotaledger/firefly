<script lang="ts">
    import { get } from 'svelte/store'
    import { Error, PasswordInput, Dropdown, NumberInput, TextInput } from 'shared/components'
    import { INode, IClientOptions, INodeInfoResponse } from '@core/network/interfaces'
    import { COIN_TYPE, EMPTY_NODE } from '@core/network/constants'
    import { nodeInfo } from '@core/network/stores'
    import { NetworkId } from '@core/network/enums'
    import { checkNodeUrlValidity, checkNetworkId } from '@core/network/utils'
    import { localize } from '@core/i18n'
    import { getNodeInfo } from '@core/profile-manager'
    import { IDropdownChoice, cleanUrl, deepCopy } from '@core/utils'
    import { activeProfile } from '@core/profile'
    import features from '../../../desktop/features/features'

    interface NodeValidationOptions {
        checkNodeInfo: boolean
        checkSameNetwork: boolean
        uniqueCheck: boolean
        validateClientOptions: boolean
    }

    export let showNetworkChoice = false
    export let node: INode = deepCopy(EMPTY_NODE)
    export let networkId: NetworkId = NetworkId.Custom
    export let chainId: string
    export let isBusy = false
    export let formError = ''
    export let currentClientOptions: IClientOptions = undefined
    export let isDeveloperProfile: boolean = false
    export let onSubmit: () => void = () => {}

    const networkItems: IDropdownChoice<NetworkId>[] = [
        {
            label: 'IOTA',
            value: NetworkId.Iota,
        },
        {
            label: 'Shimmer',
            value: NetworkId.Shimmer,
        },
        {
            label: 'Testnet',
            value: NetworkId.Testnet,
        },
        {
            label: 'Custom',
            value: NetworkId.Custom,
        },
    ].filter((item) => features.onboarding?.[item.value]?.enabled)

    let [username, password] = node.auth?.basicAuthNamePwd ?? ['', '']
    let jwt = node.auth?.jwt

    $: networkId, chainId, node.url, (formError = '')
    $: networkId, (chainId = COIN_TYPE?.[networkId] ? String(COIN_TYPE?.[networkId]) : undefined)
    $: node = {
        url: node.url,
        auth: {
            ...([username, password].every((val) => val !== '') && {
                basicAuthNamePwd: [username, password],
            }),
            ...(jwt !== '' && {
                jwt,
            }),
        },
    }

    function cleanNodeUrl(): void {
        node.url = cleanUrl(node?.url)
    }

    function onSelectNetworkId(selected: IDropdownChoice<NetworkId>): void {
        networkId = selected.value
    }

    export async function validate(options: NodeValidationOptions): Promise<INode> {
        const errorUrlValidity = checkNodeUrlValidity(currentClientOptions?.nodes, node.url, isDeveloperProfile)
        if (errorUrlValidity) {
            formError = localize(errorUrlValidity) ?? ''
            return Promise.reject({ type: 'validationError', error: formError })
        }

        let nodeInfoResponse: INodeInfoResponse
        if (options.checkNodeInfo) {
            try {
                nodeInfoResponse = await getNodeInfo(node.url)
            } catch (err) {
                formError = localize('error.node.unabledToConnect')
                return Promise.reject({ type: 'validationError', error: formError })
            }
        }

        if (options.checkSameNetwork) {
            const isInSameNetwork =
                get(nodeInfo).protocol.networkName === nodeInfoResponse.nodeInfo.protocol.networkName
            if (!isInSameNetwork) {
                formError = localize('error.node.differentNetwork')
                return Promise.reject({ type: 'validationError', error: formError })
            }
        }

        if (options.uniqueCheck) {
            if (get(activeProfile)?.clientOptions?.nodes.some((_node) => _node.url === node.url)) {
                formError = localize('error.node.duplicateNodes')
                return Promise.reject({ type: 'validationError', error: formError })
            }
        }

        if (options.validateClientOptions && currentClientOptions) {
            const errorNetworkId = checkNetworkId(
                nodeInfoResponse?.nodeInfo?.protocol?.networkName,
                currentClientOptions.network,
                isDeveloperProfile
            )
            if (errorNetworkId) {
                formError = localize(errorNetworkId?.locale, errorNetworkId?.values) ?? ''
                return Promise.reject({ type: 'validationError', error: formError })
            }
        }
    }
</script>

<form id="node-configuration-form" class="w-full h-full flex-col space-y-3" on:submit|preventDefault={onSubmit}>
    {#if showNetworkChoice}
        <Dropdown
            label={localize('popups.node.network')}
            placeholder={localize('popups.node.network')}
            value={networkId}
            items={networkItems}
            disabled={isBusy}
            onSelect={onSelectNetworkId}
        />
    {/if}
    {#if showNetworkChoice && networkId === NetworkId.Custom}
        <NumberInput
            bind:value={chainId}
            placeholder={localize('popups.node.chainId')}
            label={localize('popups.node.chainId')}
            disabled={isBusy}
            isInteger
        />
    {/if}
    <TextInput
        bind:value={node.url}
        placeholder={localize('popups.node.nodeAddress')}
        label={localize('popups.node.nodeAddress')}
        disabled={isBusy}
        on:change={cleanNodeUrl}
    />
    <TextInput
        bind:value={username}
        placeholder={localize('popups.node.optionalUsername')}
        label={localize('popups.node.optionalUsername')}
        disabled={isBusy}
    />
    <PasswordInput
        bind:value={password}
        label={localize('popups.node.optionalPassword')}
        placeholder={localize('popups.node.optionalPassword')}
        disabled={isBusy}
    />
    <PasswordInput
        bind:value={jwt}
        placeholder={localize('popups.node.optionalJwt')}
        label={localize('popups.node.optionalJwt')}
        disabled={isBusy}
    />
    <Error error={formError} />
</form>

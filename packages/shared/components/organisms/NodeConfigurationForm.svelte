<script lang="ts">
    import { localize } from '@core/i18n'
    import { NetworkId } from '@core/network'
    import { EMPTY_NODE } from '@core/network/constants'
    import { IClientOptions, INode, INodeInfoResponse } from '@core/network/interfaces'
    import { nodeInfo } from '@core/network/stores'
    import { checkNetworkId, checkNodeUrlValidity } from '@core/network/utils'
    import { activeProfile } from '@core/profile'
    import { getNodeInfo } from '@core/profile-manager'
    import { IDropdownItem, cleanUrl, deepCopy } from '@core/utils'
    import features from '@features/features'
    import { Dropdown, Error, PasswordInput, TextInput } from 'shared/components'
    import { get } from 'svelte/store'

    interface NodeValidationOptions {
        checkNodeInfo: boolean
        checkSameNetwork: boolean
        uniqueCheck: boolean
        validateClientOptions: boolean
    }

    export let node: INode = deepCopy(EMPTY_NODE)
    export let networkId: NetworkId
    export let isBusy = false
    export let formError = ''
    export let currentClientOptions: IClientOptions = undefined
    export let isDeveloperProfile: boolean = false
    export let onSubmit: () => void = () => {}
    export let showNetworkFields: boolean = false

    const networkItems: IDropdownItem<NetworkId>[] = [
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

    $: networkId, node.url, (formError = '')
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

    function onNetworkIdChanges(selected: IDropdownItem<NetworkId>): void {
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
    {#if showNetworkFields}
        <Dropdown
            label={localize('general.network')}
            placeholder={localize('general.network')}
            value={networkId}
            items={networkItems}
            disabled={isBusy}
            onSelect={onNetworkIdChanges}
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

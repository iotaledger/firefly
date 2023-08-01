<script lang="ts">
    import { localize } from '@core/i18n'
    import { IAuth, NetworkId } from '@core/network'
    import { EMPTY_NODE } from '@core/network/constants'
    import { IClientOptions, INode, INodeInfoResponse } from '@core/network/interfaces'
    import { nodeInfo } from '@core/network/stores'
    import { checkNetworkId, checkNodeUrlValidity, getNetworkNameFromNetworkId } from '@core/network/utils'
    import { activeProfile } from '@core/profile'
    import { getNodeInfo } from '@core/profile-manager'
    import { IDropdownItem, cleanUrl } from '@core/utils'
    import features from '@features/features'
    import { Dropdown, Error, NumberInput, PasswordInput, TextInput } from 'shared/components'
    interface INodeValidationOptions {
        checkNodeInfo: boolean
        checkSameNetwork: boolean
        uniqueCheck: boolean
        validateClientOptions: boolean
    }

    export let node: INode = structuredClone(EMPTY_NODE)
    export let networkId: NetworkId | undefined = undefined
    export let coinType: string = ''
    export let isBusy: boolean = false
    export let formError: string | undefined = undefined
    export let currentClientOptions: IClientOptions | undefined = undefined
    export let isDeveloperProfile: boolean = false
    export let onSubmit: () => void = () => {}
    export let showNetworkFields: boolean = false

    const networkItems: IDropdownItem<NetworkId>[] = [
        {
            label: getNetworkNameFromNetworkId(NetworkId.Iota),
            value: NetworkId.Iota,
        },
        {
            label: getNetworkNameFromNetworkId(NetworkId.Shimmer),
            value: NetworkId.Shimmer,
        },
        {
            label: getNetworkNameFromNetworkId(NetworkId.Testnet),
            value: NetworkId.Testnet,
        },
        {
            label: localize('general.custom'),
            value: NetworkId.Custom,
        },
    ].filter((item) => features.onboarding?.[item.value]?.enabled)

    let [username, password] = node.auth?.basicAuthNamePwd ?? ['', '']
    let jwt = node?.auth?.jwt ?? ''

    $: networkId, (coinType = '')
    $: networkId, coinType, node.url, (formError = '')
    $: jwt,
        username,
        password,
        (node = {
            url: node.url,
            auth: getAuth(),
        })

    function getAuth(): IAuth {
        const auth: IAuth = {}

        if ([username, password].every((value) => value !== '')) {
            auth.basicAuthNamePwd = [username, password]
        }

        if (jwt !== '') {
            auth.jwt = jwt
        }
        return auth
    }

    function cleanNodeUrl(): void {
        node.url = cleanUrl(node?.url)
    }

    function onNetworkIdChanges(selected: IDropdownItem<NetworkId>): void {
        networkId = selected.value
    }

    export async function validate(options: INodeValidationOptions): Promise<void> {
        if (networkId === NetworkId.Custom && !coinType) {
            formError = localize('error.node.noCoinType')
            return Promise.reject({ type: 'validationError', error: formError })
        }

        const errorUrlValidity = checkNodeUrlValidity(currentClientOptions?.nodes, node.url, isDeveloperProfile)
        if (errorUrlValidity) {
            formError = localize(errorUrlValidity) ?? ''
            return Promise.reject({ type: 'validationError', error: formError })
        }

        let nodeInfoResponse: INodeInfoResponse | null = null

        if (options.checkNodeInfo) {
            try {
                nodeInfoResponse = await getNodeInfo(node.url)
            } catch (err) {
                formError = localize('error.node.unabledToConnect')
                return Promise.reject({ type: 'validationError', error: formError })
            }
        }
        const networkName = nodeInfoResponse?.nodeInfo?.protocol.networkName

        if (options.checkSameNetwork) {
            const isInSameNetwork = !!$nodeInfo && $nodeInfo.protocol.networkName === networkName
            if (!isInSameNetwork) {
                formError = localize('error.node.differentNetwork')
                return Promise.reject({ type: 'validationError', error: formError })
            }
        }

        if (options.uniqueCheck) {
            if ($activeProfile?.clientOptions?.nodes?.some((_node) => _node.url === node.url)) {
                formError = localize('error.node.duplicateNodes')
                return Promise.reject({ type: 'validationError', error: formError })
            }
        }

        if (options.validateClientOptions && currentClientOptions) {
            const errorNetworkId = checkNetworkId(networkName, currentClientOptions.network, isDeveloperProfile)
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
        {#if networkId === NetworkId.Custom}
            <NumberInput
                bind:value={coinType}
                placeholder={localize('general.coinType')}
                label={localize('general.coinType')}
                disabled={isBusy}
                isInteger
            />
        {/if}
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

<script lang="ts">
    import { get } from 'svelte/store'
    import { Input, PasswordInput } from 'shared/components'
    import { INode, IClientOptions, INodeInfoResponse } from '@core/network/interfaces'
    import { EMPTY_NODE } from '@core/network/constants'
    import { nodeInfo } from '@core/network/stores'
    import { checkNodeUrlValidity, checkNetworkId } from '@core/network/utils'
    import { localize } from '@core/i18n'
    import { getNodeInfo } from '@core/profile-manager'
    import { cleanUrl, deepCopy } from '@core/utils'
    import { activeProfile } from '@core/profile'

    interface NodeValidationOptions {
        checkNodeInfo: boolean
        checkSameNetwork: boolean
        uniqueCheck: boolean
        validateClientOptions: boolean
    }

    export let node: INode = deepCopy(EMPTY_NODE)
    export let isBusy = false
    export let formError = ''
    export let currentClientOptions: IClientOptions = undefined
    export let isDeveloperProfile: boolean = false
    export let onSubmit: () => void = () => {}

    let [username, password] = node.auth?.basicAuthNamePwd ?? ['', '']
    let jwt = node.auth?.jwt

    $: node.url, (formError = '')

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

<form id="node-configuration-form" class="w-full h-full" on:submit|preventDefault={onSubmit}>
    <Input
        bind:value={node.url}
        placeholder={localize('popups.node.nodeAddress')}
        error={formError}
        disabled={isBusy}
        autofocus
        on:change={cleanNodeUrl}
    />
    <Input
        classes="mt-3"
        bind:value={username}
        placeholder={localize('popups.node.optionalUsername')}
        disabled={isBusy}
    />
    <PasswordInput
        classes="mt-3"
        bind:value={password}
        placeholder={localize('popups.node.optionalPassword')}
        disabled={isBusy}
    />
    <PasswordInput
        classes="mt-3"
        bind:value={jwt}
        placeholder={localize('popups.node.optionalJwt')}
        disabled={isBusy}
    />
</form>

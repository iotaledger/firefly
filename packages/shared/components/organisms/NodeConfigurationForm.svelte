<script lang="typescript">
    import { get } from 'svelte/store'
    import { Input, PasswordInput } from 'shared/components'
    import { INode, checkNodeUrlValidity, checkNetworkId, IClientOptions, nodeInfo } from '@core/network'
    import { localize } from '@core/i18n'
    import { getNodeInfo } from '@core/profile-manager'
    import { stripSpaces, stripTrailingSlash } from '@core/utils'
    import { activeProfile } from '@core/profile'

    export let node: INode = { url: '', auth: { username: '', password: '', jwt: '' } }
    export let isBusy = false
    export let formError = ''
    export let currentClientOptions: IClientOptions = undefined
    export let isDeveloperProfile: boolean = false

    $: node.url, (formError = '')

    function cleanNodeUrl(): void {
        node.url = stripTrailingSlash(stripSpaces(node?.url))
    }

    export async function validate({
        validateUrl,
        checkNodeInfo,
        checkSameNetwork,
        uniqueCheck,
        validateClientOptions,
    }: {
        validateUrl: boolean
        checkNodeInfo: boolean
        checkSameNetwork: boolean
        uniqueCheck: boolean
        validateClientOptions: boolean
    }): Promise<void> {
        if (validateUrl) {
            const errorUrlValidity = checkNodeUrlValidity(currentClientOptions?.nodes, node.url, isDeveloperProfile)
            if (errorUrlValidity) {
                formError = localize(errorUrlValidity) ?? ''
                return Promise.reject({ type: 'validationError', error: formError })
            }
        }

        let nodeInfoResponse
        if (checkNodeInfo) {
            try {
                nodeInfoResponse = await getNodeInfo(node.url)
            } catch (err) {
                formError = localize('error.node.unabledToConnect')
                return Promise.reject({ type: 'validationError', error: formError })
            }
        }

        if (checkSameNetwork) {
            const isInSameNetwork =
                get(nodeInfo).protocol.networkName === nodeInfoResponse.nodeInfo.protocol.networkName
            if (!isInSameNetwork) {
                formError = localize('error.node.differentNetwork')
                return Promise.reject({ type: 'validationError', error: formError })
            }
        }

        if (uniqueCheck) {
            if (get(activeProfile)?.clientOptions?.nodes.some((_node) => _node.url === node.url)) {
                formError = localize('error.node.duplicateNodes')
                return Promise.reject({ type: 'validationError', error: formError })
            }
        }

        if (validateClientOptions && currentClientOptions) {
            const errorNetworkId = checkNetworkId(
                nodeInfoResponse?.protocol?.networkName,
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

<form id="node-configuration-form" class="w-full h-full" on:submit|preventDefault={() => {}}>
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
        bind:value={node.auth.username}
        placeholder={localize('popups.node.optionalUsername')}
        disabled={isBusy}
    />
    <PasswordInput
        classes="mt-3"
        bind:value={node.auth.password}
        placeholder={localize('popups.node.optionalPassword')}
        disabled={isBusy}
    />
    <PasswordInput
        classes="mt-3"
        bind:value={node.auth.jwt}
        placeholder={localize('popups.node.optionalJwt')}
        disabled={isBusy}
    />
</form>

<script lang="typescript">
    import { Input, PasswordInput } from 'shared/components'
    import { INode, nodeInfo, checkNodeUrlValidity, checkNetworkId, IClientOptions } from '@core/network'
    import { localize } from '@core/i18n'
    import { getNodeInfo } from '@core/profile-manager'
    import { stripSpaces, stripTrailingSlash } from '@lib/helpers'

    export let node: INode = { url: '', auth: { username: '', password: '', jwt: '' } }
    export let isBusy = false
    export let formError = ''
    export let currentClientOptions: IClientOptions
    export let isDeveloperProfile: boolean
    export let checkNodeInfo = true

    $: node.url, (formError = '')
    $: node.url = cleanNodeUrl(node?.url)

    function cleanNodeUrl(_url: string): string {
        return stripTrailingSlash(stripSpaces(_url))
    }

    export async function validate(): Promise<void> {
        const errorUrlValidity = checkNodeUrlValidity(currentClientOptions?.nodes, node.url, isDeveloperProfile)
        if (errorUrlValidity) {
            formError = localize(errorUrlValidity) ?? ''
        }

        if (checkNodeInfo) {
            const nodeInfo = await getNodeInfo(node.url)
            if (!nodeInfo) {
                formError =
                    localize('error.node.unabledToConnect', {
                        values: { url: node.url },
                    }) ?? ''
            }
        }

        if (currentClientOptions) {
            const errorNetworkId = checkNetworkId(
                $nodeInfo?.protocol?.networkName,
                currentClientOptions.network,
                isDeveloperProfile
            )
            if (errorNetworkId) {
                formError = localize(errorNetworkId?.locale, errorNetworkId?.values) ?? ''
            }
        }
    }
</script>

<form id="node-config-form" class="w-full h-full">
    <Input
        bind:value={node.url}
        placeholder={localize('popups.node.nodeAddress')}
        error={formError}
        disabled={isBusy}
        autofocus
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

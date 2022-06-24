<script lang="typescript">
    import { Input, PasswordInput } from 'shared/components'
    import { INode, nodeInfo, checkNodeUrlValidity, checkNetworkId } from '@core/network'
    import { activeProfile, newProfile } from '@core/profile'
    import { localize } from '@core/i18n'

    export let node: INode = { url: '', auth: { username: '', password: '', jwt: '' } }
    export let isBusy = false
    export let formError = ''

    const profile = $newProfile ? newProfile : activeProfile
    const clientOptions = $profile.settings?.clientOptions

    $: node.url, (formError = '')

    export function validate(): void {
        const errorUrlValidity = checkNodeUrlValidity(clientOptions?.nodes, node.url, $profile.isDeveloperProfile)
        if (errorUrlValidity) {
            formError = localize(errorUrlValidity) ?? ''
        }

        if ($profile === $activeProfile) {
            const errorNetworkId = checkNetworkId(
                $nodeInfo?.protocol?.networkName,
                clientOptions.network,
                $profile.isDeveloperProfile
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

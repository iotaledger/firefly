<script lang="typescript">
    import { Checkbox, Input, Password, Text } from 'shared/components'
    import { INode, nodeInfo, checkNodeUrlValidity, checkNetworkId } from '@core/network'
    import { showAppNotification } from 'shared/lib/notifications'
    import { activeProfile, newProfile, addNode } from '@core/profile'
    import { localize } from '@core/i18n'
    import { appRoute, AppRoute } from '@core/router'
    import { addCustomNodeToNewProfile } from '@core/profile/actions/addCustomNodeToNewProfile'

    export let node: INode = { url: '', auth: { username: '', password: '', jwt: '' } }
    export let isBusy = false
    export let onSuccess = (..._: any[]): void => {}

    const profile = $newProfile ? newProfile : activeProfile
    const clientOptions = $profile.settings?.clientOptions

    let formError = { address: '', addressWarn: '' }

    $: node.url, (formError = { address: '', addressWarn: '' })

    function checkForErrors(): void {
        const errorNetworkId = checkNetworkId(
            $nodeInfo?.protocol?.networkName,
            clientOptions.network,
            $profile.isDeveloperProfile
        )
        const errorUrlValidity = checkNodeUrlValidity(clientOptions?.nodes, node.url, $profile.isDeveloperProfile)
        formError = {
            address: localize(errorNetworkId?.locale, errorNetworkId?.values) ?? '',
            addressWarn: localize(errorUrlValidity) ?? '',
        }
    }

    export async function handleAddNode(): Promise<void> {
        isBusy = true
        checkForErrors()
        if (!formError.address) {
            try {
                if ($newProfile) {
                    await addCustomNodeToNewProfile(node)
                } else {
                    await addNode(node, profile)
                }
                isBusy = false
                onSuccess()
            } catch (err) {
                showAppNotification({
                    type: 'error',
                    message: localize(err),
                })
            }
        }
        isBusy = false
    }
</script>

<form id="node-config-form" class="w-full h-full">
    <Input
        bind:value={node.url}
        placeholder={localize('popups.node.nodeAddress')}
        error={formError.address}
        disabled={isBusy}
        autofocus
    />
    {#if formError.addressWarn}
        <Text overrideColor classes="text-orange-500 mt-2">{formError.addressWarn}</Text>
    {/if}
    <Input
        classes="mt-3"
        bind:value={node.auth.username}
        placeholder={localize('popups.node.optionalUsername')}
        disabled={isBusy}
    />
    <Password
        classes="mt-3"
        bind:value={node.auth.password}
        placeholder={localize('popups.node.optionalPassword')}
        disabled={isBusy}
    />
    <Password
        classes="mt-3"
        bind:value={node.auth.jwt}
        placeholder={localize('popups.node.optionalJwt')}
        disabled={isBusy}
    />
    {#if $appRoute !== AppRoute.CustomNetwork}
        <Checkbox label={localize('popups.node.setAsPrimaryNode')} disabled={isBusy} classes="mt-4 mb-8" />
    {/if}
</form>

<script lang="typescript">
    import { Input, Password } from 'shared/components'
    import {
        INode,
        nodeInfo,
        checkNodeUrlValidity,
        checkNetworkId,
        NetworkType,
        validateAndCleanNodeData,
    } from '@core/network'
    import { showAppNotification } from 'shared/lib/notifications'
    import { activeProfile, newProfile, addNode, createNewProfile } from '@core/profile'
    import { localize } from '@core/i18n'
    import { networkProtocol } from '@contexts/onboarding'

    export let node: INode = { url: '', auth: { username: '', password: '', jwt: '' } }
    export let isBusy = false
    export let onSuccess = (..._: any[]): void => {}

    const profile = $newProfile ? newProfile : activeProfile
    const clientOptions = $profile.settings?.clientOptions
    const isDeveloperProfile = true // TODO: use real value

    let formError = { error: '' }

    $: node.url, (formError = { error: '' })

    function validateNodeParameters(): void {
        const errorUrlValidity = checkNodeUrlValidity(clientOptions?.nodes, node.url, $profile.isDeveloperProfile)
        if (errorUrlValidity) {
            formError = { error: localize(errorUrlValidity) ?? '' }
        }

        if ($profile === $activeProfile) {
            const errorNetworkId = checkNetworkId(
                $nodeInfo?.protocol?.networkName,
                clientOptions.network,
                $profile.isDeveloperProfile
            )
            if (errorNetworkId) {
                formError = { error: localize(errorNetworkId?.locale, errorNetworkId?.values) ?? '' }
            }
        }
    }

    export async function handleAddNode(): Promise<void> {
        isBusy = true

        validateNodeParameters()

        if (!formError.error) {
            try {
                if (!$profile?.settings?.clientOptions) {
                    const cleanedNode = validateAndCleanNodeData(node)
                    await createNewProfile(isDeveloperProfile, $networkProtocol, NetworkType.PrivateNet, cleanedNode)
                } else {
                    await addNode(node, profile)
                }

                isBusy = false

                onSuccess()
            } catch (err) {
                showAppNotification({
                    type: 'error',
                    message: localize(err?.error ?? 'error.global.generic'),
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
        error={formError.error}
        disabled={isBusy}
        autofocus
    />
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
</form>

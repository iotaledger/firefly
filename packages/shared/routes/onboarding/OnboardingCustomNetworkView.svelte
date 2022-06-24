<script lang="typescript">
    import { OnboardingLayout, Text, Button, Spinner, NodeConfigurationForm } from 'shared/components'
    import { localize } from '@core/i18n'
    import { INode, NetworkType, validateAndCleanNodeData } from '@core/network'
    import { appRouter } from '@core/router'
    import { destroyProfileManager, getNodeInfo } from '@core/profile-manager'
    import { activeProfile, addNode, createNewProfile, newProfile } from '@core/profile'
    import { showAppNotification } from '@lib/notifications'

    let nodeConfigurationForm: NodeConfigurationForm
    let node: INode
    let isBusy = false
    let formError = ''

    const profile = $newProfile ? newProfile : activeProfile
    const clientOptions = $profile.settings?.clientOptions

    function onBackClick(): void {
        $appRouter.previous()
    }

    async function onSuccess(): Promise<void> {
        try {
            await getNodeInfo(node.url)
            $appRouter.next()
        } catch (err) {
            await destroyProfileManager()
            formError = localize('error.node.invalid')
        }
    }

    async function handleAddNode(): Promise<void> {
        formError = ''
        nodeConfigurationForm.validate()
        if (!formError) {
            isBusy = true
            try {
                if (!clientOptions) {
                    const cleanedNode = validateAndCleanNodeData(node)
                    await createNewProfile(
                        $profile.isDeveloperProfile,
                        $newProfile.networkProtocol,
                        NetworkType.PrivateNet,
                        cleanedNode
                    )
                } else {
                    await addNode(node, profile)
                }
                onSuccess()
            } catch (err) {
                showAppNotification({
                    type: 'error',
                    message: localize(err?.error ?? 'error.global.generic'),
                })
            } finally {
                isBusy = false
            }
        }
    }
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.customNetwork.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{localize('views.customNetwork.body')}</Text>
        <NodeConfigurationForm
            bind:this={nodeConfigurationForm}
            bind:node
            bind:formError
            {isBusy}
            hideButtons
            hideCheckbox
        />
    </div>
    <div slot="leftpane__action">
        <Button
            disabled={!node?.url || isBusy}
            type="submit"
            form="node-config-form"
            classes="w-full"
            onClick={handleAddNode}
        >
            {#if isBusy}
                <Spinner busy={isBusy} message={localize('popups.node.addingNode')} classes="justify-center" />
            {:else}
                {localize('actions.continue')}
            {/if}
        </Button>
    </div>
</OnboardingLayout>

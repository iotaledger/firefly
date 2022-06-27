<script lang="typescript">
    import { OnboardingLayout, Text, Button, Spinner, NodeConfigurationForm } from 'shared/components'
    import { localize } from '@core/i18n'
    import { INode, NetworkType } from '@core/network'
    import { appRouter } from '@core/router'
    import { getStorageDirectoryOfProfile, newProfile } from '@core/profile'
    import { showAppNotification } from '@lib/notifications'
    import { setNewProfileClientOptions } from '@contexts/onboarding'
    import { initialiseProfileManager } from '@core/profile-manager'
    import { destroyProfileManager, getNodeInfo } from '@core/profile-manager'

    let nodeConfigurationForm: NodeConfigurationForm
    let node: INode
    let isBusy = false
    let formError = ''

    function onBackClick(): void {
        $appRouter.previous()
    }

    async function handleAddNode(): Promise<void> {
        formError = ''
        await nodeConfigurationForm.validate()
        if (!formError) {
            isBusy = true
            try {
                await setNewProfileClientOptions($newProfile.networkProtocol, NetworkType.PrivateNet, node)

                const path = await getStorageDirectoryOfProfile($newProfile.id)
                initialiseProfileManager(path, $newProfile.clientOptions, {
                    Stronghold: { snapshotPath: `${path}/wallet.stronghold` },
                })

                await getNodeInfo(node.url)

                $appRouter.next()
            } catch (err) {
                console.error(err?.error)
                if (err?.error.includes('error sending request for url')) {
                    formError = localize('error.node.unabledToConnect')
                    await destroyProfileManager()
                } else {
                    showAppNotification({
                        type: 'error',
                        message: localize(err?.error ?? 'error.global.generic'),
                    })
                }
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
            isDeveloperProfile
            checkNodeInfo={false}
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

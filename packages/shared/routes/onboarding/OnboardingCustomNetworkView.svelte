<script lang="typescript">
    import { Animation, OnboardingLayout, Text, Button, Spinner, NodeConfigurationForm } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { INode } from '@core/network'
    import { appRouter } from '@core/router'
    import { showAppNotification } from '@lib/notifications'
    import {
        deleteAccountsAndDatabase,
        destroyProfileManager,
        getNodeInfo,
        TimeNotSyncedError,
    } from '@core/profile-manager'
    import { initProfileManagerFromNewProfile } from '@contexts/onboarding'

    let nodeConfigurationForm: NodeConfigurationForm
    let node: INode
    let isBusy = false
    let formError = ''

    function onBackClick(): void {
        $appRouter.previous()
    }

    async function handleAddNode(): Promise<void> {
        isBusy = true
        try {
            await nodeConfigurationForm.validate({
                validateUrl: true,
                uniqueCheck: false,
                checkSameNetwork: false,
                checkNodeInfo: false,
                validateClientOptions: false,
            })
            await initProfileManagerFromNewProfile(node)
            await getNodeInfo(node.url)
            $appRouter.next()
        } catch (err) {
            console.error(err)
            if (err?.error?.includes('error sending request for url')) {
                formError = localize('error.node.unabledToConnect')
                await deleteAccountsAndDatabase()
                await destroyProfileManager()
            } else if (err instanceof TimeNotSyncedError) {
                destroyProfileManager()
            } else if (err?.type !== 'validationError') {
                showAppNotification({
                    type: 'error',
                    message: localize(err?.error ?? 'error.global.generic'),
                })
            }
        } finally {
            isBusy = false
        }
    }
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.customNetwork.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{localize('views.customNetwork.body')}</Text>
        <NodeConfigurationForm bind:this={nodeConfigurationForm} bind:node bind:formError {isBusy} isDeveloperProfile />
    </div>
    <div slot="leftpane__action">
        <Button
            disabled={!node?.url || isBusy}
            type="submit"
            form="node-configuration-form"
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
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="onboarding-protocol-desktop" />
    </div>
</OnboardingLayout>

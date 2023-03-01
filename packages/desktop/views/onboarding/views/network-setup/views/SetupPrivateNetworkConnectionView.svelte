<script lang="ts">
    import { onMount } from 'svelte'
    import {
        Animation,
        OnboardingLayout,
        Text,
        Button,
        NodeConfigurationForm,
        HTMLButtonType,
        TextType,
    } from 'shared/components'
    import {
        cleanupOnboardingProfileManager,
        initialiseProfileManagerFromOnboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { INode } from '@core/network'
    import { destroyProfileManager, getNodeInfo } from '@core/profile-manager'
    import { networkSetupRouter } from '@core/router'
    import { showAppNotification } from '@auxiliary/notification'

    let nodeConfigurationForm: NodeConfigurationForm
    let node: INode
    let isBusy = false
    let formError = ''

    function onBackClick(): void {
        $networkSetupRouter.previous()
    }

    async function onContinueClick(): Promise<void> {
        isBusy = true
        try {
            const validatedNode = await nodeConfigurationForm.buildNode({
                checkNodeInfo: false,
                checkSameNetwork: false,
                uniqueCheck: false,
                validateClientOptions: false,
            })
            updateOnboardingProfile({ clientOptions: { nodes: [validatedNode], primaryNode: validatedNode } })
            await initialiseProfileManagerFromOnboardingProfile(true)

            // The API request to check if a node is reachable requires an existing account manager.
            await getNodeInfo(validatedNode.url)
            await destroyProfileManager()
            $networkSetupRouter.next()
        } catch (err) {
            console.error(err)
            if (err?.error?.includes('error sending request for url')) {
                formError = localize('error.node.unabledToConnect')
                updateOnboardingProfile({ clientOptions: null })
                await cleanupOnboardingProfileManager()
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

    onMount(() => {
        updateOnboardingProfile({ clientOptions: null })
        void cleanupOnboardingProfileManager()
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type={TextType.h2}>{localize('views.onboarding.networkSetup.setupPrivateNetworkConnection.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type={TextType.p} secondary classes="mb-8"
            >{localize('views.onboarding.networkSetup.setupPrivateNetworkConnection.body')}</Text
        >
        <NodeConfigurationForm
            onSubmit={onContinueClick}
            bind:this={nodeConfigurationForm}
            bind:node
            bind:formError
            {isBusy}
            isDeveloperProfile
        />
    </div>
    <div slot="leftpane__action">
        <Button
            disabled={!node?.url || isBusy}
            type={HTMLButtonType.Submit}
            form="node-configuration-form"
            classes="w-full"
            {isBusy}
            busyMessage={localize('actions.addingNode')}
        >
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="onboarding-custom-network-desktop" />
    </div>
</OnboardingLayout>

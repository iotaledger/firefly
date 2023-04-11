<script lang="ts">
    import { showAppNotification } from '@auxiliary/notification'
    import { OnboardingLayout } from '@components'
    import {
        cleanupOnboardingProfileManager,
        initialiseProfileManagerFromOnboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { INode, NetworkId, buildNetworkFromNodeInfoResponse, getNetworkIdFromNetworkName } from '@core/network'
    import { destroyProfileManager, getNodeInfo } from '@core/profile-manager'
    import { networkSetupRouter } from '@core/router'
    import { Animation, Button, HTMLButtonType, NodeConfigurationForm, Text, TextType } from '@ui'
    import { onMount } from 'svelte'

    let nodeConfigurationForm: NodeConfigurationForm
    let networkId: NetworkId
    let chainId: string
    let node: INode
    let isBusy = false
    let formError = ''

    function onBackClick(): void {
        $networkSetupRouter.previous()
    }

    async function onContinueClick(): Promise<void> {
        isBusy = true
        try {
            await nodeConfigurationForm.validate({
                uniqueCheck: false,
                checkSameNetwork: false,
                checkNodeInfo: false,
                validateClientOptions: false,
            })
            updateOnboardingProfile({ clientOptions: { nodes: [node], primaryNode: node } })
            await initialiseProfileManagerFromOnboardingProfile(true, Number(chainId) || undefined)

            // The API request to check if a node is reachable requires an existing account manager.
            const nodeInfoResponse = await getNodeInfo(node.url)
            // check network Id
            if (
                networkId !== NetworkId.Custom &&
                networkId !== getNetworkIdFromNetworkName(nodeInfoResponse?.nodeInfo?.protocol?.networkName)
            ) {
                throw new Error('error.node.networkIdMismatch')
            }
            const network = buildNetworkFromNodeInfoResponse(nodeInfoResponse)
            updateOnboardingProfile({ network })
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
            bind:networkId
            bind:chainId
            bind:formError
            {isBusy}
            isDeveloperProfile
            showNetworkChoice
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

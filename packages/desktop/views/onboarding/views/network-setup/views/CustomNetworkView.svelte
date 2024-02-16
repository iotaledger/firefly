<script lang="ts">
    import { showAppNotification } from '@auxiliary/notification'
    import { OnboardingLayout } from '@components'
    import {
        cleanupOnboardingProfile,
        initialiseOnboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import {
        INode,
        NetworkId,
        buildPersistedNetworkFromNodeInfoResponse,
        getEnabledNetworkFromFeatureFlags,
        getNetworkIdFromNetworkName,
    } from '@core/network'
    import { getNodeInfo } from '@core/wallet/actions'
    import { Animation, Button, HTMLButtonType, NodeConfigurationForm, Text, TextType } from '@ui'
    import { onMount } from 'svelte'
    import { networkSetupRouter } from '@core/router'
    import { AnimationEnum } from '@auxiliary/animation'

    let nodeConfigurationForm: NodeConfigurationForm
    let networkId: NetworkId = getEnabledNetworkFromFeatureFlags()
    let coinType: string
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
            await initialiseOnboardingProfile(true)

            // The API request to check if a node is reachable requires an existing wallet manager.
            const nodeInfoResponse = await getNodeInfo(node.url)
            // Check network of node matches selected id
            if (
                networkId !== NetworkId.Custom &&
                networkId !==
                    getNetworkIdFromNetworkName(
                        nodeInfoResponse?.nodeInfo?.protocolParameters?.[0]?.parameters?.networkName
                    )
            ) {
                throw new Error('error.node.differentNetwork')
            }
            const customCoinType = networkId === NetworkId.Custom ? Number(coinType) : undefined
            const network = buildPersistedNetworkFromNodeInfoResponse(nodeInfoResponse, customCoinType)
            updateOnboardingProfile({ network })
            await cleanupOnboardingProfile()
            $networkSetupRouter.next()
        } catch (err) {
            console.error(err)

            updateOnboardingProfile({ clientOptions: undefined, network: undefined })
            await cleanupOnboardingProfile()

            if (err?.error?.includes('error sending request for url')) {
                formError = localize('error.node.unabledToConnect')
            } else if (err?.message === 'error.node.differentNetwork') {
                formError = localize('error.node.differentNetwork')
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
        // Clean up if user has navigated back to this view
        updateOnboardingProfile({ network: undefined, clientOptions: undefined })
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type={TextType.h2}>{localize('views.onboarding.networkSetup.setupCustomNetwork.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <NodeConfigurationForm
            onSubmit={onContinueClick}
            bind:this={nodeConfigurationForm}
            bind:networkId
            bind:coinType
            bind:node
            bind:formError
            {isBusy}
            isDeveloperProfile
            showNetworkFields
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
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-yellow dark:bg-gray-900">
        <Animation animation={AnimationEnum.OnboardingCustomNetworkDesktop} />
    </div>
</OnboardingLayout>

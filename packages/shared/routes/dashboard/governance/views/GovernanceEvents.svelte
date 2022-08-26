<script lang="typescript">
    import { localize } from '@core/i18n'
    import { governanceRouter, openSettings, settingsRouter } from '@core/router/'
    import { GovernanceRoute, SettingsRoute } from '@core/router/enums'
    import { Button, Illustration, Link, Spinner, Text } from 'shared/components'
    import { getOfficialNetworkConfig, updateClientOptions } from 'shared/lib/network'
    import { isFetchingParticipationInfo } from 'shared/lib/participation/stores'
    import { ParticipationEvent } from 'shared/lib/participation/types'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { NetworkConfig, NetworkType } from 'shared/lib/typings/network'

    export let event: ParticipationEvent

    const networkConfig: NetworkConfig =
        $activeProfile?.settings.networkConfig || getOfficialNetworkConfig(NetworkType.ChrysalisMainnet)

    let illustrationHeight = 0

    $: {
        updateClientOptions(networkConfig)
        updateProfile('settings.networkConfig', networkConfig)
    }

    const handleViewProposalClick = () => $governanceRouter.goTo(GovernanceRoute.EventDetails)

    const handleConnectDefaultNodeClick = () => {
        networkConfig.automaticNodeSelection = true
    }

    const handleViewNodeSettingsClick = () => {
        openSettings()
        $settingsRouter.goTo(SettingsRoute.AdvancedSettings)
    }
</script>

{#if event}
    <div class="p-6 h-full flex flex-col">
        <div bind:clientHeight={illustrationHeight} class="relative illustration-wrapper max-w-full h-full max-h-3/5">
            <Illustration
                height={illustrationHeight}
                background
                illustration="iota-governance"
                classes="bg-cover bg-center w-full h-full rounded-2xl"
            />
            <Text
                type="p"
                classes="bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl uppercase absolute transform left-1/2 -bottom-4 -translate-x-1/2"
                highlighted
                bold
                smaller
            >
                {localize(`views.governance.events.status.${event?.status?.status}`)}
            </Text>
        </div>
        <div class="flex flex-col items-center flex-1 justify-between mt-8 mx-14">
            <div class="text-center">
                <Text type="h2" classes="mb-2">{event?.information?.name}</Text>
                <!-- Note: commented out for Shimmer EF Proposal -->
                <!-- <Text
                    type="p"
                    classes="text-gray-700 dark:text-gray-500 mb-6 text-14 min-w-0 overflow-auto"
                    overrideColor
                >
                    {event?.information?.additionalInfo}
                </Text> -->
            </div>
            <div class="relative min-w-40">
                <Button onClick={handleViewProposalClick} disabled={!event} classes="w-full">
                    {localize('views.governance.events.button')}
                </Button>
            </div>
        </div>
    </div>
{:else}
    <div class="p-6 h-full w-full flex flex-col justify-center items-center">
        <Illustration illustration="governance-not-found" classes="w-36 h-36 mb-6" />
        {#if $isFetchingParticipationInfo}
            <Spinner
                busy={$isFetchingParticipationInfo}
                message={localize('views.governance.events.treasury.notFound.fetching')}
                classes="justify-center"
            />
        {:else}
            <div class="mb-8 text-center">
                <Text type="p" secondary bold>{localize('views.governance.events.treasury.notFound.title')}</Text>
                <Text type="p" secondary>{localize('views.governance.events.treasury.notFound.subtitle')}</Text>
            </div>
            {#if !networkConfig.automaticNodeSelection}
                <Button onClick={handleConnectDefaultNodeClick} classes="mb-4">
                    {localize('views.governance.events.treasury.notFound.buttonConnect')}
                </Button>
            {/if}
            <Link onClick={handleViewNodeSettingsClick}>
                {localize('views.governance.events.treasury.notFound.buttonSettings')}
            </Link>
        {/if}
    </div>
{/if}

<style type="text/scss">
    .min-w-40 {
        min-width: 10rem;
    }
    .max-h-3\/5 {
        max-height: 60%;
    }
</style>

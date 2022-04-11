<script lang="typescript">
    import { Text, Button, Illustration } from 'shared/components'
    import { localize } from '@core/i18n'
    import { openSettings, governanceRouter, settingsRouter } from '@core/router/'
    import { GovernanceRoute, SettingsRoute } from '@core/router/enums'
    import { ParticipationEvent } from 'shared/lib/participation/types'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { NetworkConfig, NetworkType } from 'shared/lib/typings/network'
    import { getOfficialNetworkConfig, updateClientOptions } from 'shared/lib/network'

    export let event: ParticipationEvent

    const networkConfig: NetworkConfig =
        $activeProfile?.settings.networkConfig || getOfficialNetworkConfig(NetworkType.ChrysalisMainnet)

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
    <Illustration illustration="treasury-bg" classes="w-full bg-lightblue-200 rounded-2xl" />
    <Text
        type="p"
        classes="bg-white dark:bg-gray-800 text-14 px-4 py-2 rounded-2xl text-blue-500 uppercase w-fit -mt-4 mb-2"
        overrideColor
        bold
        smaller
    >
        {localize(`views.governance.events.status.${event?.status?.status}`)}
    </Text>
    <Text type="h2" classes="text-gray-800 dark:text-white mb-2" overrideColor>{event?.information?.name}</Text>
    <Text
        type="p"
        classes="text-gray-700 dark:text-gray-500 mb-2 mx-16 text-14 text-center min-w-0 overflow-auto"
        overrideColor
        >{event?.information?.additionalInfo}
    </Text>
    <Button classes="w-1/4 mt-auto" onClick={handleViewProposalClick} disabled={!event} small
        ><Text type="p" overrideColor bold classes="text-white">{localize('views.governance.events.button')}</Text
        ></Button
    >
{:else}
    <div class="h-full w-full flex flex-col justify-center items-center">
        <Illustration illustration="governance-not-found" classes="w-32 h-32 mb-6" />
        <div class="mb-8 text-center">
            <Text type="p" classes="text-gray-600 dark:text-white" overrideColor bold
                >{localize('views.governance.events.treasury.notFound.title')}</Text
            >
            <Text type="p" classes="text-gray-600 dark:text-white" overrideColor
                >{localize('views.governance.events.treasury.notFound.subtitle')}</Text
            >
        </div>
        {#if !networkConfig.automaticNodeSelection}
            <Button onClick={handleConnectDefaultNodeClick} classes="mb-2">
                <Text type="h5" bold classes="text-white px-4" overrideColor
                    >{localize('views.governance.events.treasury.notFound.buttonConnect')}
                </Text>
            </Button>
        {/if}
        <Button secondary onClick={handleViewNodeSettingsClick} classes="border-transparent">
            <Text type="h5" bold classes="text-blue-500 dark:text-white" overrideColor>
                {localize('views.governance.events.treasury.notFound.buttonSettings')}
            </Text>
        </Button>
    </div>
{/if}

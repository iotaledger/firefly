<script lang="typescript">
    import { activeProfile } from 'shared/lib/profile'
    import { Link, Text } from 'shared/components'
    import type { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale
    export let classes: string

    let showIndicator = true

    const handleDismiss = () => {
        showIndicator = false
    }
</script>

{#if $activeProfile?.isDeveloperProfile && showIndicator}
    <div class="flex justify-center  w-full h-8 content-center items-center bg-yellow-700 space-x-4 p-2 {classes}">
        <Text type="p" overrideColor="text-gray-800">
            {locale('indicators.developerProfileIndicator.warningText', {
                values: { networkName: $activeProfile.settings.networkConfig.network.name },
            })}
        </Text>
        <Link onClick={handleDismiss} classes="text-13 hover:underline">
            {locale('actions.dismiss')}
        </Link>
    </div>
{/if}

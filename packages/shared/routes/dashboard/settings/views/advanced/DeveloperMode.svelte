<script language="typescript">
    import { Checkbox, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { activeProfile } from 'shared/lib/profile'
    import { get } from 'svelte/store'

    export let id

    let isDeveloperProfile = get(activeProfile)?.isDeveloperProfile

    $: updateProfile('isDeveloperProfile', isDeveloperProfile)
</script>

<section {id} class="w-full sm:w-3/4">
    <Text type="h4" classes="mb-3">{localize('views.settings.developerMode.title')}</Text>
    <Text type="p" secondary classes="mb-5">{localize('views.settings.developerMode.description')}</Text>
    <Checkbox label={localize('actions.enableDeveloperMode')} bind:checked={isDeveloperProfile} />
</section>

<script lang="ts">
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfile } from '@core/profile'
    import { Checkbox, Text, TextType } from '@ui'

    let isDeveloperProfile = $activeProfile?.isDeveloperProfile
    $: updateActiveProfile({ isDeveloperProfile })
</script>

<Text type={TextType.h4} classes="mb-3">{localize('views.settings.developerToggle.title')}</Text>
<Text type={TextType.p} secondary classes="mb-5">{localize('views.settings.developerToggle.description')}</Text>
<Checkbox label={localize('actions.enableDeveloperMode')} bind:checked={isDeveloperProfile} />

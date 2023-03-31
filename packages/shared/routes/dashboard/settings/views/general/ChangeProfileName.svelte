<script lang="typescript">
    import { Button, Input, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { activeProfile, updateProfile, validateProfileName } from 'shared/lib/profile'
    import { showAppNotification } from 'shared/lib/notifications'

    let newName = $activeProfile.name
    let error = ''

    $: trimmedProfileName = newName.trim()
    $: newName, (error = '')
    $: disabled = invalidName(trimmedProfileName)

    function onSubmitClick(): void {
        try {
            validateProfileName(trimmedProfileName)
            updateProfile('name', trimmedProfileName)
            showAppNotification({
                type: 'info',
                message: localize('views.settings.changeProfileName.success'),
            })
        } catch (err) {
            return (error = err.message)
        }
    }

    function invalidName(name: string): boolean {
        const isSameName = name === $activeProfile.name
        const isTooShort = name?.length < 1
        return isSameName || isTooShort
    }
</script>

<form id="form-change-profile-name" on:submit|preventDefault={onSubmitClick}>
    <Text type="h4" classes="mb-3">
        {localize('views.settings.changeProfileName.title')}
    </Text>
    <Text type="p" secondary classes="mb-5">
        {localize('views.settings.changeProfileName.description')}
    </Text>
    <Input {error} placeholder={$activeProfile.name} bind:value={newName} classes="mb-5" />
    <Button medium form="form-change-profile-name" type="submit" {disabled}>
        {localize('views.settings.changeProfileName.title')}
    </Button>
</form>

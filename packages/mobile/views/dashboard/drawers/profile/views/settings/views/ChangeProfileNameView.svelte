<script lang="typescript">
    import { showAppNotification } from '@auxiliary/notification'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfile, validateProfileName } from '@core/profile'
    import { Button, HTMLButtonType, Input, Text, TextType } from 'shared/components'

    let newName = $activeProfile?.name
    let error = ''

    $: trimmedProfileName = newName.trim()
    $: newName, (error = '')
    $: disabled = invalidName(trimmedProfileName)

    function onSubmitClick(): void {
        try {
            validateProfileName(trimmedProfileName)
            updateActiveProfile({ name: trimmedProfileName })
            showAppNotification({
                type: 'info',
                message: localize('views.settings.changeProfileName.success'),
            })
        } catch (err) {
            return (error = err.message)
        }
    }

    function invalidName(name: string): boolean {
        const isSameName = name === $activeProfile?.name
        const isTooShort = name?.length < 1
        return isSameName || isTooShort
    }
</script>

<form
    class="h-full flex flex-col justify-between space-y-4"
    id="form-change-profile-name"
    on:submit|preventDefault={onSubmitClick}
>
    <div class="flex flex-col space-y-4">
        <Text type={TextType.p} secondary>
            {localize('views.settings.changeProfileName.description')}
        </Text>
        <Input {error} placeholder={$activeProfile?.name} bind:value={newName} />
    </div>

    <div class="drawer-footer">
        <Button classes="w-full" type={HTMLButtonType.Submit} {disabled}>
            {localize('views.settings.changeProfileName.title')}
        </Button>
    </div>
</form>

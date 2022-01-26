<script lang="typescript">
    import { Button, Input, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { activeProfile, updateProfile } from 'shared/lib/profile'

    let newName: string

    function changeProfileName(): void {
        updateProfile('name', newName)
    }
</script>

<form id="form-change-profile-name" on:submit={changeProfileName}>
    <Text type="h4" classes="mb-3">
        {localize('views.settings.changeProfileName.title')}
    </Text>
    <Text type="p" secondary classes="mb-5">
        {localize('views.settings.changeProfileName.description')}
    </Text>
    <Input
        placeholder={$activeProfile.name}
        bind:value={newName}
        classes="mb-5"
    />
    <Button medium form="form-change-profile-name" type="submit">
        {localize('views.settings.changeProfileName.title')}
    </Button>   
</form>
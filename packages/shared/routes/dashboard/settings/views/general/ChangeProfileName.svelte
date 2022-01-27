<script lang="typescript">
    import { Button, Input, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { activeProfile, updateProfile, validateProfileName } from 'shared/lib/profile'
    import { Electron } from 'shared/lib/electron';
    import { getProfileDataPath } from 'shared/lib/wallet';

    let newName: string
    let error = ''

    async function onSubmitClick(): Promise<void> {
        const trimmedProfileName = newName.trim();
        try {
            validateProfileName(trimmedProfileName)
            await renameProfileFolder(trimmedProfileName)
            updateProfile('name', newName)
        } catch (err) {
            return (error = err.message)
        }
    }

    async function renameProfileFolder(newName: string): Promise<void> {
        const oldPath = await getProfileDataPath($activeProfile.name)
        const newPath = await getProfileDataPath(newName)
        await Electron.renameProfileFolder(oldPath, newPath);
    }
</script>

<form id="form-change-profile-name" on:submit={onSubmitClick}>
    <Text type="h4" classes="mb-3">
        {localize('views.settings.changeProfileName.title')}
    </Text>
    <Text type="p" secondary classes="mb-5">
        {localize('views.settings.changeProfileName.description')}
    </Text>
    <Input
        {error}
        placeholder={$activeProfile.name}
        bind:value={newName}
        classes="mb-5"
    />
    <Button medium form="form-change-profile-name" type="submit">
        {localize('views.settings.changeProfileName.title')}
    </Button>   
</form>
<script lang="typescript">
    import { Button, Password, Text } from 'shared/components'
    import { logout } from 'shared/lib/app'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    import { activeProfile, isSoftwareProfile, profiles, removeProfile, removeProfileFolder } from 'shared/lib/profile'
    import { setRoute } from 'shared/lib/router'
    import { AppRoute } from 'shared/lib/typings/routes'
    import { api } from 'shared/lib/wallet'
    import { get } from 'svelte/store'

    export let locale

    let isBusy = false
    let error = ''
    let password

    async function handleDeleteClick() {
        isBusy = true
        error = ''
        if ($isSoftwareProfile) {
            api.setStrongholdPassword(password, {
                async onSuccess() {
                    await triggerDeletProfile()
                },
                onError(err) {
                    isBusy = false
                    error = locale(err.error)
                },
            })
        } else {
            await triggerDeletProfile()
        }
    }

    async function triggerDeletProfile() {
        try {
            const ap = get(activeProfile)

            // We have to logout before the profile is removed
            // from the profile list otherwise the activeProfile which is
            // derived from profiles is undefined and the actor
            // is not destroyed
            await logout()

            // Now that all the resources have been freed we try
            // and remove the profile folder, this will retry until locks
            // can be gained
            if (ap) {
                // Remove the profile from the active list of profiles
                removeProfile(ap.id)

                // If after removing the profile there are none left
                // we need to make sure the router gets reset to the welcome screen
                // by default it will go to the profile selection
                if (get(profiles).length === 0) {
                    setRoute(AppRoute.Welcome)
                }

                // Remove the profile folder this will wait until it can get
                // the lock on the resources
                await removeProfileFolder(ap.name)
            }
        } catch (err) {
            showAppNotification({
                type: 'error',
                message: locale('Something bad happened'),
            })
        } finally {
            isBusy = false
        }
    }
</script>

<Text type="h4" classes="mb-5">{locale('popups.deleteProfile.title')}</Text>
<div class="w-full h-full mb-5">
    <Text classes="mb-3">{locale('popups.deleteProfile.confirmation')}</Text>
    {#if $isSoftwareProfile}
        <Text type="p" secondary classes="mb-3">{locale('popups.deleteProfile.typePassword')}</Text>
        <Password
            {error}
            classes="w-full mb-8"
            bind:value={password}
            showRevealToggle
            {locale}
            placeholder={locale('general.password')}
            autofocus
            submitHandler={() => handleDeleteClick()}
            disabled={isBusy} />
    {/if}
</div>
<div class="flex flex-row justify-between space-x-4 w-full px-8 ">
    <Button secondary classes="w-1/2" onClick={() => closePopup()} disabled={isBusy}>{locale('actions.no')}</Button>
    <Button disabled={(!password && $isSoftwareProfile) || isBusy} classes="w-1/2" onClick={() => handleDeleteClick()} warning>
        {locale('actions.yes')}
    </Button>
</div>
